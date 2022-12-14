const express = require('express');
const app = express();
const dotenv = require("dotenv");
// need to require mongoose so we can connect to our database
const mongoose = require("mongoose");

// models
const TodoTask = require("./models/TodoTask");

// connecting to env
dotenv.config();

app.use("/static", express.static("public"));

// extract the data from the form by adding her to the body property of the request
app.use(express.urlencoded({ extended: true }));

// connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    // server should only run after the connection is made
    // bind  web server to the dynamic PORT environment variable set by heroku
    app.listen(process.env.PORT || 3000, () => console.log("Server Up and running"));
});

// view engine configuration
app.set("view engine", "ejs");

// GET METHOD
// need to read the data from the database so when we enter the page or when we add a new item we can see it at our app
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// UPDATE task
app
    .route("/edit/:id")
    .get((req, res) => {
        // find our id
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            // render the new template after editing task list
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        // update our task using the method findByIdAndUpdate
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

// DELETE tasks from list
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});