const express = require("express");
const body = require("body-parser");

const app = express();

let items = ["Sweep Room", "Eat Breakfast", "Take Lesson"];
let workItems = [];

app.use(body.urlencoded({
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
        listTitle: day,
        newListItems: items
    });


});

app.post("/", (req, res) => {
    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);

        res.redirect("/work")
    } else {
        items.push(item);

        res.redirect("/");
    }

});

app.get("/work", (req, res) => {

    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.post("/work", (req, res) => {

    let item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
});



const port = process.env.port || 3000;

app.listen(port, function () {
    console.log(`server listening on port ${port}`)
});