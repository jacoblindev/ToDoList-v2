// Dependencies
const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      expressLayouts = require("express-ejs-layouts"),
      movieQuote = require("popular-movie-quotes");

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

// Get Today's Date
const today = new Date();
const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
// console.log(today.toDateString());

// Routing
app.get("/", (req, res) => {
  List.find({}, (err, lists) => {
    if (lists.length === 0) {
      List.insertMany(defaultLists, err => err ? console.log(err) : console.log("Insert Successfully!"));
      res.redirect("/");
    } else {
      // console.log(movieQuote.getSomeRandom(1)[0]);
      res.render("lists", {
        listsName: lists,
        randomQuote: movieQuote.getSomeRandom(1)[0],
        today: today.toLocaleDateString(undefined, options)
      });
    }
  })
});

// Listen for request
app.listen(port, () => console.log(`Server started on port: ${port}`));
