require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT
const cors = require("cors")

app.set("port", port || 4000);

app.use(express.json(), cors(), express.static("public"));

app.listen(port, ()=> {
    console.log(`Server is running on ${port}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

const userRoute  = require("./routes/userRoute")
app.use("/users", userRoute)

const carsRoute  = require("./routes/carsRoute")
app.use("/cars", carsRoute)
