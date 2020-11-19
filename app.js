const express = require("express");
const body = require("body-parser");
const mongoose = require("mongoose");

// const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(body.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemsSchema = {
    name: String
};

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Buy Apples"
});

const item2 = new Item({
    name: "Read a book"
});

const item3 = new Item({
    name: "Play Game"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

    // let day = date.getDate();

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("items inserted successfully");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            });
        }

    });

});

app.post("/", (req, res) => {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today") {
        item.save();

    res.redirect("/");

    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item)
            foundList.save();

            res.redirect(`/${listName}`);
        })
    }
    

});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, (err) => {
        if (err) {
            console.log(err)
        } else console.log("Item deleted successfully");

        res.redirect("/");
    })
})

app.get("/:customListName", (req, res) => {

    const customListName = req.params.customListName;

    List.findOne({name: customListName}, (err, foundList) => {
        if(!err) {
            if(!foundList) {
                // Create a new list

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();

                res.redirect(`/${customListName}`);
            } else {
                // Show an existing list

                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });

            }
        }
    });

});

app.post("/work", (req, res) => {

    let item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
});

const port = 3000;

app.listen(port, function () {
    console.log(`server listening on port ${port}`)
});