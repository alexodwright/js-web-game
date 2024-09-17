DROP TABLE IF EXISTS leaderboard;

CREATE TABLE leaderboard (
    entryid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    round INTEGER NOT NULL,
    kills INTEGER NOT NULL
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)

SELECT *
FROM leaderboard