const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = ["Sweep Room", "Eat Breakfast", "Take Lesson"];

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let today = new Date();

    let day = today.toLocaleDateString("en-US", options);


    res.render("list", {
        kindOfDay: day,
        newListItems: items
    });

    app.post("/", (req, res) => {
        let item = req.body.newItem;

        items.push(item);


        res.redirect("/")
    })

});





const port = process.env.port || 3000;

app.listen(port, function () {
    console.log(`server listening on port ${port}`)
});