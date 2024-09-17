from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, EqualTo
from flask_wtf import FlaskForm

class RegistrationForm(FlaskForm):
    username = StringField("USERNAME", validators=[InputRequired("Please enter your username!")])
    password = PasswordField("PASSWORD", validators=[InputRequired("Please enter your password!")])
    confirm_password = PasswordField("CONFIRM PASSWORD", validators=[InputRequired(message="Please confirm your password!"), EqualTo("password", "Passwords do not match!")])
    submit = SubmitField("REGISTER")

class LoginForm(FlaskForm):
    username = StringField("USERNAME", validators=[InputRequired("Please enter your username!")])
    password = PasswordField("PASSWORD", validators=[InputRequired("Please enter your password!")])
    submit = SubmitField("LOG IN")