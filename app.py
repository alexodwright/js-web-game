from flask import Flask, render_template, session, request, redirect, g, url_for
from flask_session import Session
from database import get_db, close_db
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from forms import LoginForm, RegistrationForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "my-secret-key"
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.teardown_appcontext(close_db)
Session(app)

methods = ["POST", "GET"]

@app.before_request
def load_logged_in_user():
    g.user = session.get('username', None)

def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

@app.route("/login", methods=methods)
def login():
    form = LoginForm()
    db = get_db()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        query = """
                SELECT *
                FROM users
                WHERE username = ?
                """
        res = db.execute(query, (username, )).fetchone()
        if res is None:
            form.username.errors.append("User does not exist!")
        else:
            if check_password_hash(res["password"], password):
                session["username"] = res["username"]
                next_page = request.args.get('next')
                if not next_page:
                    next_page = url_for('index')
                return redirect(next_page)
            else:
                form.password.errors.append("Wrong Password!")
            session.modified = True
    return render_template("login.html", form=form)

@app.route("/register", methods=methods)
def register():
    form = RegistrationForm()
    db = get_db()
    if form.validate_on_submit():
        username = form.username.data.strip()
        password = generate_password_hash(form.password.data)
        check_query = """
                    SELECT *
                    FROM users
                    WHERE username = ?
                    """
        check_user = db.execute(check_query, (username, )).fetchone()
        if check_user is None: 
            query = """
                    INSERT INTO users (username, password)
                    VALUES (?, ?)
                    """
            db.execute(query, (username, password))
            db.commit()
            return redirect(url_for('login'))
        else:
            form.username.errors.append("User already exists!")
    return render_template("registration.html", form=form)

@app.route("/logout")
def logout():
    session.clear()
    session.modified = True
    return redirect(url_for('login'))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/game")
@login_required
def game():
    return render_template("game.html")

@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    query = '''
            SELECT username, round, kills
            FROM leaderboard
            ORDER BY round DESC, kills DESC 
            '''
    entries = db.execute(query).fetchall()
    return render_template("leaderboard.html", entries=entries)

@app.route("/storeScore", methods=["POST"])
@login_required
def store_score():
    round_num = int(request.form['roundReached'])
    kills = int(request.form['kills'])
    db = get_db()
    query = '''
            INSERT INTO leaderboard (username, round, kills)
            VALUES (?, ?, ?)
            '''
    db.execute(query, (g.user, round_num, kills))
    db.commit()
    return redirect('leaderboard')