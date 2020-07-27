const express = require("express");
const mongoose = require("mongoose");
const Challenge = require("./schemas/challenge");
const User = require("./schemas/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Init app.
const app = express();
// Connect to MongoDB and then start the server.
const uri = "mongodb+srv://therealsangwoohan:c68nmsiobMbaBDtj@cluster0.c6hyu.mongodb.net/database0?retryWrites=true&w=majority";
mongoose.connect(uri)
    .then(function(result) {
        app.listen(3000);
    })
    .catch(function(error) {
        console.log(error);
    });

// Register view engine.
app.set("view engine", "ejs");

// Passport.
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get("*", function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Routing.
app.use(express.static("public"));
app.use(express.urlencoded())

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/challenges/create", function(req, res) {
    res.render("create");
});

app.post("/challenges/create", function(req, res) {
    const challenge = new Challenge(req.body);
    challenge.save()
        .then(function(result) {
            res.redirect("/challenges");
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get("/challenges", function(req, res) {
    Challenge.find()
        .then(function(result) {
            res.render("challenges", {challenges: result});
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get("/challenges/:id", function(req, res) {
    Challenge.findById(req.params.id)
        .then(function(result) {
            res.render("details", {challenge: result});
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get("/challenge/edit/:id", function(req, res) {
    Challenge.findById(req.params.id)
    .then(function(result) {
        res.render("edit", {challenge: result});
    })
    .catch(function(error) {
        console.log(error);
    });
});

app.post("/challenge/edit/:id", function(req, res) {
    Challenge.update({_id: req.params.id}, req.body, function(error) {
        if (error) {
            console.log(error);
        } else {
            res.redirect(`/challenges/${req.params.id}`);
        }
    });
});

app.get("/user/register", function(req, res) {
    res.render("register");
});

app.post("/user/register", function(req, res) {
    const user = new User(req.body);
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                console.log(err);
            }
            user.password = hash;
            user.save()
            .then(function(result) {
                res.redirect("/user/login");
            })
            .catch(function(error) {
                console.log(error);
            });
        })
    });
});

app.get("/user/login", function(req, res) {
    res.render("login");
});

app.post("/user/login", function(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login"
    })(req, res, next);
});

app.get("/user/logout", function(req, res) {
    req.logout();
    res.redirect("/user/login");
})

app.use(function(req, res) {
    res.status(404).render("404");
});