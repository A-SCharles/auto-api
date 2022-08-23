const express = require("express");
const con = require("../config/dbcon");
const router = express.Router();
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");

// get all
router.get("/", (req, res) => {
  try {
    const strQry = `SELECT * FROM users`;

    con.query(strQry, (err, results) => {
      if (err) throw err;
      res.status(200).json({
        results: results,
        msg: "All from users Selected",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// get one
router.get("/:id", (req, res) => {
  try {
    const strQry = `SELECT * FROM users WHERE id = ${req.params.id}`;

    con.query(strQry, (err, results) => {
      if (err) throw err;
      res.status(200).json({
        results: results,
        msg: "one from users Selected",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// add user
router.post("/", bodyparser.json(), async (req, res) => {
  try {
    const user = req.body;
    if (user.usertype === "" || user.usertype === null) {
      user.usertype = "user";
    }
    let emailCheck = `SELECT * FROM users WHERE email = '${user.email}';`;
    con.query(emailCheck, async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.json({
          msg: "Email already in use",
        });
      } else {
        // adding to db
        const strQry = `INSERT INTO users (username, email, usertype, password) VALUES(?, ?, ?, ?);`;
        user.password = await hash(user.password, 10);
        con.query(
          strQry,
          [user.username, user.email, user.usertype, user.password],
          async (err, results) => {
            if (err) throw err;
            res.json({
              results: results,
              msg: "Registration Successful",
            });
          }
        );
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
});

// user login
router.patch("/", bodyparser.json(), (req, res) => {
  try {
    const { email, password } = req.body;
    const strQry = `SELECT * FROM users WHERE email = '${email}'`;

    con.query(strQry, async (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.json({
          msg: "email not found",
        });
      } else {
        const isMatch = await compare(password, results[0].password);
        if (isMatch === true) {
          const payload = {
           user : results[0]
            // user: {
            //   id: results[0].id,
            //   username: results[0].username,
            //   email: results[0].email,
            //   usertype: results[0].usertype,
            }
            jwt.sign(
                payload,
                process.env.jwtSecret,
                {
                    expiresIn: "365d",
            },
            (err, token) => {
                if (err) throw err;
                res.json({
                    msg: "Login Successful",
                    user: payload.user,
                    token: token,
                });
                // res.json(payload.user);
            }
            );
        // };
          
        } else {
          res.json({
            msg: "Password Incorrect",
          });
        }
      }
    });
  } catch (error) {
    res.status;
  }
});

// update user 
router.put("/:id", (req, res)=>{
    try {
        const strQry = `UPDATE users SET ? WHERE id = ${req.params.id}`;
        const  {username, firstname, surname, email, profile} = req.body

        const user = {
            firstname, surname, profile
        }
        con.query(strQry, user, (err, results) => {
            if (err) throw err;

            res.json({
                msg : "Updated Successfully"
            })
        })
    } catch (error) {
        res.send(400).json({
            error
        })
    }
})

// delete users 
router.delete("/:id", (req, res) => {
    try {
        const strQry = `DELETE FROM users WHERE id = ${req.params.id}`
        
        con.query(strQry, (err, results) => {
            if (err) throw err;
            res.json({
                msg : "User deleted successfully"
            }) 
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})
module.exports = router;
