CREATE TABLE courses(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
code varchar(10) NOT NULL,
name varchar(100) NOT NULL,
syllabus text NOT NULL,
level char(2) NOT NULL,
credits REAL NOT NULL
);

CREATE TABLE myjobs(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
company varchar(100) NOT NULL,
title varchar(100) NOT NULL,
location varchar(100) NOT NULL,
description TEXT NOT NULL,
start TEXT NOT NULL,
end TEXT NOT NULL
);

INSERT INTO myjobs(company, title, location, description, start, end) VALUES('Skatteverket', 'Skattehandläggare', 'Gävle', 'Handläggning av skatteärenden', '2004-08-01', '2004-12-31');
INSERT INTO myjobs(company, title, location, description, start, end) VALUES('Söderströms AB', 'Revisor', 'Gävle', 'Arbete med revisioner', '2005-03-01', '2008-09-30');
INSERT INTO myjobs(company, title, location, description, start, end) VALUES('Tullverket', 'Tullrevisor', 'Stockholm', 'Arbete med tullrevisioner', '2008-10-01', '2014-02-15');


CREATE TABLE users(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
fname varchar(100) NOT NULL,
lname varchar(100) NOT NULL,
email varchar(100) NOT NULL,
username varchar(100) NOT NULL,
password text NOT NULL,
account_created text
);