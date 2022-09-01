const bodyParser = require("body-parser");
const con = require("../config/dbcon");
const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth")

// get wishlist items from user
router.get("/users/:id/wishlist", middleware, (req, res) => {
    try {
        const strQuery = "SELECT wishlist FROM users WHERE id = ?";
        con.query(strQuery, [req.user.id], (err, results) => {
            if (err) throw err;
            (function Check(a, b) {
                a = parseInt(req.user.id);
                b = parseInt(req.params.id);
                if (a === b) {
                    res.json(results[0].wishlist);
                } else {
                    res.json({
                        a,
                        b,
                        msg: "Please Login To View Wishlist",
                    });
                }
            })();
        });
    } catch (error) {
        throw error;
    }
});

// add wishlist items
router.post("/users/:id/wishlist", middleware, bodyParser.json(), (req, res) => {
    try {
        let {
            id
        } = req.body;
        const qwishlist = `SELECT wishlist
      FROM users
      WHERE id = ?;
      `;
        con.query(qwishlist, req.user.id, (err, results) => {
            if (err) throw err;
            let wishlist;
            if (results.length > 0) {
                if (results[0].wishlist === null) {
                    wishlist = [];
                } else {
                    wishlist = JSON.parse(results[0].wishlist);
                }
            }
            const strProd = `
      SELECT *
      FROM cars
      WHERE id = ${id};
      `;
            con.query(strProd, async (err, results) => {
                if (err) throw err;



                let product = {
                    wishlistid: wishlist.length + 1,
                    id: results[0].id,
                    vin: results[0].vin,
                    manufacturer: results[0].manufacturer,
                    bodystyle: results[0].bodystyle,
                    model: results[0].model,
                    modelyear: results[0].modelyear,
                    MSRP: results[0].MSRP,
                    fueltype: results[0].fueltype,
                    transmission: results[0].transmission,
                    img: results[0].img,
                };

                wishlist.push(product);
                // res.send(wishlist)
                const strQuery = `UPDATE users
      SET wishlist = ?
      WHERE (id = ${req.user.id})`;
                con.query(strQuery, /*req.user.id */ JSON.stringify(wishlist), (err) => {
                    if (err) throw err;
                    res.json({
                        results,
                        msg: "Product added to wishlist",
                    });
                });
            });
        });
    } catch (error) {
        console.log(error.message);
    }
});

// delete one item from wishlist
router.delete("/users/:id/wishlist/:prodid", middleware, (req, res) => {
    const dwishlist = `SELECT wishlist
    FROM users
    WHERE id = ?`;
    con.query(dwishlist, req.user.id, (err, results) => {
        if (err) throw err;
        let item = JSON.parse(results[0].wishlist).filter((x) => {
            return x.wishlistid != req.params.prodid;
        });
        // res.send(item)
        const strQry = `
    UPDATE users
    SET wishlist = ?
    WHERE id= ? ;
    `;
        con.query(
            strQry,
            [JSON.stringify(item), req.user.id],
            (err, data, fields) => {
                if (err) throw err;
                res.json({
                    msg: "Item Removed from wishlist",
                });
            }
        );
    });
});

// delete all wishlist items
router.delete("/users/:id/wishlist", middleware, (req, res) => {
    const dwishlist = `SELECT wishlist 
    FROM users
    WHERE id = ?`;

    con.query(dwishlist, req.user.id, (err, results) => {
        // let wishlist =
    });
    const strQry = `
    UPDATE users
      SET wishlist = null
      WHERE (id = ?);
      `;
    con.query(strQry, [req.user.id], (err, data, fields) => {
        if (err) throw err;
        res.json({
            msg: "Item Deleted",
        });
    });
});

module.exports = router