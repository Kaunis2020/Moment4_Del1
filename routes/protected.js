/* 
 * Larissa Rosenbrant
 * Skyddad router för radering och 
 * inläggning av data i databasen;
 */
const sqlite3 = require('sqlite3');
const express = require('express');
const router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');

const dbpath = process.env.DB_DATABASE;
// Raderar kurs med ett visst ID i databasen
// OPEN_READWRITE
router.delete('/course/:id', function (req, res, next)
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null)
    {
        res.status(404).json({message: "Obehörig person!"});
    }
    // VALIDERAR TOKEN FÖR BEHÖRIGHET ATT RADERA i databasen;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err)
        {
            res.status(404).json({message: "Obehörig person!"});
        } else
        {
            let courseid = req.params.id;
            if (!courseid)
            {
                res.status(404).json({message: "Kursens ID måste anges!"});
            } else
            {
                let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
                    if (err)
                    {
                        res.status(404).json({message: err.message});
                    } else {
                        db.run("DELETE FROM courses WHERE id = ?", [courseid], (err) => {
                            if (err)
                            {
                                res.status(404).json({message: err.message});
                            } else
                            {
                                //Skickar koden OK;
                                res.status(200).json({message: "Kursen har raderats"});
                            }
                        });
                    }
                    db.close();
                });
            }
        }
    });
});

// Raderar arbete med ett visst ID i databasen
// OPEN_READWRITE
router.delete('/work/:id', (req, res) =>
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null)
    {
        res.status(404).json({message: "Obehörig person!"});
    }
    // VALIDERAR TOKEN FÖR BEHÖRIGHET ATT RADERA i databasen;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err)
        {
            res.status(404).json({message: "Obehörig person!"});
        } else
        {
            let workid = req.params.id;
            if (!workid)
            {
                res.status(404).json({message: "Arbetets ID måste anges!"});
            } else
            {
                let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
                    if (err)
                    {
                        res.status(404).json({message: err.message});
                    } else {
                        db.run("DELETE FROM myjobs WHERE id = ?", [workid], (err) => {
                            if (err)
                            {
                                res.status(404).json({message: err.message});
                            } else
                            {
                                //Skickar koden OK;
                                res.status(200).json({message: "Arbetet har raderats"});
                            }
                        });
                    }
                    db.close();
                });
            }
        }
    });
});
// Lägger kurs i databasen
// OPEN_READWRITE
router.post("/course", (req, res) =>
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null)
    {
        res.status(404).json({message: "Obehörig person!"});
    }
    // VALIDERAR TOKEN FÖR BEHÖRIGHET ATT LÄGGA i databasen;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err)
        {
            res.status(404).json({message: "Obehörig person!"});
        } else
        {
            let code = req.body.code;
            let name = req.body.name;
            let syllabus = req.body.syllabus;
            let level = req.body.level;
            let credits = req.body.credits;
            if (!code || !name || !syllabus) {
                res.status(404).json({message: "Tomma fält får inte förekomma!"});
            } else
            {
                let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        res.status(404).json({message: err.message});
                    } else {
                        db.run('INSERT INTO courses(code, name, syllabus, level, credits) VALUES(?, ?, ?, ?, ?)', [code, name, syllabus, level, credits], (err) => {
                            if (err) {
                                res.status(404).json({message: err.message});
                            } else
                            {
                                res.status(200).json({message: "Kursen har sparats i databasen."});
                            }
                        });
                    }
                });
                db.close();
            }
        }
    });
});

// Lägger arbete i databasen
// OPEN_READWRITE
router.post('/work', (req, res) =>
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null)
    {
        res.status(404).json({message: "Obehörig person!"});
    }
// VALIDERAR TOKEN FÖR BEHÖRIGHET ATT LÄGGA i databasen;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err)
        {
            res.status(404).json({message: "Obehörig person!"});
        } else
        {
            let company = req.body.company;
            let title = req.body.title;
            let location = req.body.location;
            let description = req.body.description;
            let start = req.body.start;
            let end = req.body.end;
            let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    res.status(404).json({message: err.message});
                } else {
                    db.run('INSERT INTO myjobs(company, title, location, description, start, end) VALUES(?, ?, ?, ?, ?, ?)', [company, title, location, description, start, end], (err) => {
                        if (err) {
                            console.log(err);
                            res.status(404).json({message: err.message});
                        } else
                        {
                            res.status(200).json({message: "Arbetet har sparats i databasen."});
                        }
                    });
                } 
                 db.close();
            });
        }       
    });
});

module.exports = router;