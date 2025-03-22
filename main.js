/* 
 * Larissa Rosenbrant
 */
const sqlite3 = require('sqlite3');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// Aktivera CORS middleware för alla rutter
const cors = require('cors');
const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
const handler = require('./routes/handler');
const protected = require('./routes/protected');
app.use('/handler', handler);
app.use('/protected', protected);

// Här är ENDAST ÖPPNA ROUTES I READ ONLY-LÄGET;

// Uppgifter inhämtas från ENV-filen;
const port = process.env.PORT;
const dbpath = process.env.DB_DATABASE;

// För visning öppnas databasen i Read only-läget
app.get('/api/courses', function (req, res, next) {

    let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            res.status(404).json({message: err.message});
        } else {
            db.serialize(function () {
                db.all("SELECT * FROM courses", function (err, courses) {
                    if (err)
                        res.status(404).json({message: err.message});
                    else
                    {
                        res.status(200).json(courses);
                    }
                });
            });
        }
        db.close();
    });
});

// För visning öppnas databasen i read only-läget;
// Visar alla inlagda arbeten i databasen;
// OPEN_READONLY
app.get('/api/works', (req, res) =>
{
    let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            res.status(404).json({message: err.message});
        } else {
            db.serialize(function () {
                db.all("SELECT * FROM myjobs", function (err, myjobs) {
                    if (err)
                        res.status(404).json({message: err.message});
                    else
                    {
                        res.status(200).json(myjobs);
                    }
                });
            });
        }
        db.close();
    });
});

app.listen(port);
