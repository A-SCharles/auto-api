const bodyParser = require("body-parser");
const con = require("../config/dbcon");
const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth")

// get all cars
router.get("/", (req, res) => {
  try {
    const strQry = `SELECT * FROM cars`;

    con.query(strQry, (err, results) => {
      if (err) throw err;

      res.json({
        results: results,
        msg: "All products shown",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const strQry = `SELECT * FROM cars WHERE id = ${req.params.id}`;

    con.query(strQry, (err, results) => {
      if (err) throw err;
      res.json({
        results: results,
        msg: "one car shown",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// add product
router.post("/", bodyParser.json(), middleware, (req, res) => {
  try {
    const car = req.body;
    const strQry = `INSERT INTO cars (manufacturer, bodystyle, model, modelyear, MSRP, fueltype, transmission, img) VALUES (?,?,?,?,?,?,?,?)`;

    con.query(
      strQry,
      [
        car.manufacturer,
        car.bodystyle,
        car.model,
        car.modelyear,
        car.MSRP,
        car.fueltype,
        car.transmission,
        car.img,
      ],
      (err, results) => {
        if (err) throw err;
        res.status(200).json({
          msg: "Product Added",
        });
      }
    );
  } catch (error) {
    res.status(200).json({
      error,
    });
  }
});

router.put("/:id", bodyParser.json(), middleware, (req, res) => {
  try {
    const strQry = `UPDATE cars SET ? WHERE id = ${req.params.id}`;
    const {
      manufacturer,
      bodystyle,
      model,
      modelyear,
      MSRP,
      fueltype,
      transmission,
      img,
    } = req.body;

    const car = {
      manufacturer,
      bodystyle,
      model,
      modelyear,
      MSRP,
      fueltype,
      transmission,
      img,
    }

    con.query(strQry, car,(err, results) => {
        if (err) throw err;
        res.status(200).json({
            results,
            msg : "Updated item Successfully"
        })
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// DELETE
router.delete("/:id", middleware, (req, res) => {
try {
    const strQry =`DELETE FROM cars WHERE id = ${req.params.id}`

    con.query(strQry, (err, results) => {
      if (err) throw err;
      res.status(200).json({
        results,
        msg : "Item Deleted"
      })
    })
} catch (error) {
    res.status(400).json({
        error,
      });
}
})
module.exports = router;
