var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var dialog = require('dialog');


const USERS ='./data/USERS.json';
const STAT = './data/statistics.json'

  router.get('/', function(req,res,next) {
    res.render('login', {errors:{} });
  });

  router.post('/game', function(req,res, next) {
   
    const login = req.body.login;
    const pass = req.body.pass;

    req.checkBody('login','Login must not be empty!').notEmpty();
    req.checkBody('pass', 'Password must not be empty!').notEmpty();

    var errors = req.validationErrors();
    
    if (errors) {
      return res.render ('login', {
          errors: errors
      });
    };

    let user = _.pick(req.body, ['login', 'pass']);

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
      
      let hasMatch = false;
      let incorrect = false;

      for (let i = 0; i < usersList.length; i++) {

          var user = usersList[i];

          if (user.name==login && user.pass == pass) {
            hasMatch = true;
            break;
          }
          
          if ((user.name == login && user.pass !== pass) || (user.name !== login && user.pass == pass) ) {
              incorrect = true;
              break;
          }
      }

      if(incorrect) {
        dialog.warn('Login or password is incorrect');
        res.redirect(301,'/');
      } else if (!hasMatch) {
        dialog.warn('User is not registered'+'\n'+'Please, register');
        res.redirect(301, '/');
        
      } else {
          req.session.isLoggedIn = true;
        fs.readFile(STAT, function(err,data) {
            if (err) {
                return next(err);
            }

            let statistics;
            let userScore;

            try {
                statistics = JSON.parse(data);
            } catch (err) {
                return next(err);
            }

            let match = false;

            for (let i = 0; i < statistics.length; i++) {
                
                var statUser = statistics[i];
    
                if (statUser.name == login) {
                    match = true;
                    userScore = statUser.score;
                    break;
                }
            }
            
            if(!match) {
                userScore = 0; 
            }
            res.render('game', {
                        name:login,
                        score:userScore
                    });

        });
      };
    });
    
  });
  
  
  router.get('/logout', function (req,res,next) {
    req.session.destroy(function (err) {
        res.redirect(301, '/');
    });
});

module.exports = router;
