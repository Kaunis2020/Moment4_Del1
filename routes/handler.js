/* 
 * Larissa
 * Router för registrering och inloggning
 */
const sqlite3 = require('sqlite3');
const express = require('express');
const router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');

// Uppgifter inhämtas från ENV-filen;
const port = process.env.PORT;
const dbpath = process.env.DB_DATABASE;

// Skapar användarkonto i databasen;
// LÖSENORDET SPARAS SOM HASHKOD;
// OPEN_READWRITE
router.post('/register', (req, res) =>
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
            let fname = req.body.fname;
            let lname = req.body.lname;
            let email = req.body.email;
            let username = req.body.username;
            let password = req.body.password;
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (day < 10)
                day = "0" + day;
            if (month < 10)
                month = "0" + month;
            var fulldate = String(year) + "-" + String(month) + "-" + String(day);
            var account_created = fulldate;
            // Kontrollerar uppgifter;
            if (!fname || !lname || !email || !username || !password)
            {
                res.status(404).json();
            } else
            {
                var crypto = require("crypto");
                var sha256 = crypto.createHash("sha256");
                sha256.update(password, "utf8");
                var hashcode = sha256.digest("base64");
                let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        res.status(404).json(err.message);
                    } else {
                        db.run('INSERT INTO users(fname, lname, email, username, password, account_created) VALUES(?, ?, ?, ?, ?, ?)', [fname, lname, email, username, hashcode, account_created], (err) => {
                            if (err) {
                                res.json(err.message);
                            } else
                            {
                                const obj = {message: "Kontot har sparats i databasen"};
                                res.status(200).json(obj);
                            }
                        });
                    }
                });
            }
            db.close();
        }
    });
});

// Jämför användarnamn och lösenord vid inloggning;
// OMVANDLAR INMATAT LÖSENORD TILL HASHKOD; 
// OPEN_READONLY
router.post('/login', (req, res) =>
{
    let username = req.body.username;
    let password = req.body.password;
    // Kontrollerar uppgifter;
    if (!username || !password)
    {
        res.status(404).json();
    } else
    {
        var crypto = require("crypto");
        var sha256 = crypto.createHash("sha256");
        sha256.update(password, "utf8");
        var hashcode = sha256.digest("base64");
        let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                res.status(404).json(err.message);
            } else {
                db.all('SELECT fname, username, password FROM users WHERE username = ? AND password = ?', [username, hashcode], function (error, results) {
                    if (error) {
                        res.status(404).json(error.message);
                    } else
                    {
                        if (results.length > 0)
                        {
                            const payload = {
                                username: username
                            };
                            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1800s'});
                            const obj = {fname: results[0].fname, username: results[0].username, token: token};
                            res.status(200).json(obj);
                        } else
                        {
                            const obj = {error: "Felaktig inloggning!"};
                            res.status(404).json(obj);
                        }
                    }
                });
            }
        });
        db.close();
    }
});
module.exports = router;