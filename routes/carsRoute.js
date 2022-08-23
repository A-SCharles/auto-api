const express = require('express');
const app = express()
const router = express.Router()

// get all cars
router.get("/", (req, res) => {
    try {
        const strQry =`SELECT * FROM users`;

        con.query(strQry, (err, results) => {
            if (err) throw err;

            res.json({
                results : results,
                msg : "All products shown"
            })
        })

    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

module.exports = router

