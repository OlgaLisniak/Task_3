const express = require('express');
const router = express.Router();
const _ = require('lodash');
const fs = require('fs');
const USERS ='./data/USERS.json';
const STAT = './data/statistics.json'
const path = require('path');
var dialog = require('dialog');

//const authController = require('../controller/registrController');
/* GET home page. */
/*router.get('/', registrController.index);

router.post('/register', registrController.login);

router.get('/logout', registrController.logout);*/

router.get('/', function(req,res) {
    res.render('registration', {errors:{}});
});

let getUsers = function (done) {

    fs.readFile(USERS, function (err, data) {
        if (err) {
            return done (err);
        }

        let usersList;

        try {
            usersList = JSON.parse(data);
        } catch (err) {
            return done(err);
        }

        return done(null, usersList);
    });
};

router.post ('/add', function (req, res, next) {

    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
    const pass2 = req.body.pass2;

    req.checkBody('name', 'Name must not be empty').notEmpty();
    req.checkBody('email', 'Email must not be empty').notEmpty();
    req.checkBody('email', 'Check your email').isEmail();
    req.checkBody('pass', 'Password must not be empty').notEmpty();
    req.checkBody('pass2', 'Please confirm your password').notEmpty();
    req.checkBody('pass2','Passwords do not match').equals(req.body.pass);

    let user = _.pick(req.body,['name', 'email', 'pass']);

    var errors = req.validationErrors();

    if (errors) {
        res.render ('registration', {
            errors: errors
        });
    };

     
    if (name && (pass === pass2)) {

        fs.readFile(USERS, function (err, data) {

            if (err) {
                return next(err);
            }
    
            let usersList;
    
            try {
                usersList = JSON.parse(data);
            } catch (err) {
                return next(err);
            }

            let usersNames = [];
            let userName;

            for (let i = 0; i < usersList.length; i++) {
                usersNames.push(usersList[i].name);
            }

            if (usersNames.lastIndexOf(name) > -1) {
                dialog.warn('You are already registered');
                res.redirect(301,'/');
            } else {

                usersList.push(user);
                
                fs.writeFile(USERS, JSON.stringify(usersList, null, 2), function (err) {
                    if (err) {
                        return next(err);
                    }
                });

                fs.readFile(STAT, function(err,data){
                    if (err) {
                        return next(err);
                    }

                    let statistics;
                    let score;

                    try {
                        statistics = JSON.parse(data);
                    } catch (err) {
                        return next(err);
                    }

                    let match = false;

                    for (let i = 0; i < statistics.length; i++) {
                        
                        var statUser = statistics[i];
            
                        if (statUser.name==name) {
                            hasMatch = true;
                            score = statUser.score;
                            break;
                        }
                    }

                    if(!match) {
                        score = 0; 
                    }
                    res.render('game', {
                                        name:name,
                                        score:score
                                    });

                });

                
            
            };
        });
    };
});

module.exports = router;