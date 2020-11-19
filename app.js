const express = require("express");
const body = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(body.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true,useUnifiedTopology: true});

const itemsSchema = {
    name: String
};

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name : "Buy Apples"
});

const item2 = new Item ({
    name : "Read a book"
});

const item3 = new Item ({
    name : "Play Game"
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (err) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("items inserted successfully");
//     }
// });




app.get("/", function (req, res) {

    let day = date.getDate();

  Item.find({}, (err, foundItems) => {
    res.render("list", {
        listTitle: day,
        newListItems: foundItems
    });
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

app.get("/about", (req, res) => {
    res.render("about");
})

const port = process.env.port || 3000;

app.listen(port, function () {
    console.log(`server listening on port ${port}`)
});