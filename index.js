require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT
const cors = require("cors")

app.set("port", port || 4000);

app.use(express.json(), cors(), express.static("public"));

app.use((req, res, next) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    });
    next();
  });

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

const userRoute  = require("./routes/userRoute")
app.use("/users", userRoute)

const wishListRoute = require("./routes/wishListRoute")
app.use(wishListRoute)

const carsRoute  = require("./routes/carsRoute")
app.use("/cars", carsRoute)

