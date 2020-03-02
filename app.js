// Dependencies
const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      expressLayouts = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 3000;
const Schema = mongoose.Schema;

app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set('layout', 'layouts/layout');

// DB connection
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Set Schema
const taskSchema = new Schema({
  item: String
});
const listSchema = new Schema({
  name: String,
  tasks: [taskSchema]
});

// Set Model
const List = mongoose.model("list", listSchema),
      Task = mongoose.model("task", taskSchema);

// Default sample lists
const list0 = new List({name: "Daily Workout", tasks: [{item: "Run 3k"}, {item: "Code for 1h"}, {item: "50 pushup"}]}),
      list1 = new List({name: "Work", tasks: [{item: "Reply Emails"}, {item: "Visit clients"}, {item: "Team meeting"}]}),
      list2 = new List({name: "Shopping", tasks: [{item: "Cat Food"}, {item: "Mask"}, {item: "Sanitizer"}]}),
      defaultLists = [list0, list1, list2];

// Routing
app.get("/", (req, res) => {
  List.find({}, (err, lists) => {
    if (lists.length === 0) {
      // console.log("Nothing in the DB!!!");
      List.insertMany(defaultLists, err => err ? console.log(err) : console.log("Insert Successfully!"));
      res.redirect("/");
    } else {
      // res.send(`${lists[0].name} (${lists[0]._id}) : ${lists[0].tasks}`);
      res.render("lists", {
        listsName: lists
      });
    }
  })
});

// Listen for request
app.listen(port, () => console.log(`Server started on port: ${port}`));
