var path = require('path');
var db = require("../models");
var isAuthenticated = require("../config/middleware/isAuthenticated");


module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index')
    });

    app.get('/signup', function (req, res) {
        res.render('signup')
    });

    app.get('/logout', function (req, res) {
        res.render('logout')
    });

    app.get('/css', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/css/main.css'));
    });

    app.get('/forgot', function (req, res) {
        res.render("password-forgot");
    });

    app.get('/reset/:token', function (req, res) {
        // const Op = Sequelize.Op;
        db.User.findOne({
            where: {
                resetPasswordToken: req.params.token,
                // resetPasswordExpires: { [Op.gte]: Date.now() }
            }
        }).then(function (user) {
            if (!user) {
                return res.redirect('/forgot');
            }
            res.render('password-reset');
        });
    });

    app.get("/login", function (req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("members");
        } else {
            res.render('login');
        }
    });

    app.get("/members", isAuthenticated, function (req, res) {
        db.User.findAll().then(function (users) {
            console.log('users', users)
            res.render('members', {
                users
            })
        })
    });

    app.get("/members/:username", isAuthenticated, function (req, res) {
        db.User.findOne({
            where: {
                username: req.params.username
            }
        }).then(function (users) {
            res.render('profile', {
                users
            })
        })
    });
//This is to find if a user already exists in the database
    app.get("/members/:username", isAuthenticated, function (req, res) {
        var chosen = req.params.username
        db.User.findOne({
            where: {
                username: req.params.username
            }
        }).then(function (dbUsers) {
            res.json(dbUsers)
        })
    });

    app.get('/interests', function (req, res) {
        res.render('interests')
    });

    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });
}