/*module.exports = {
    
        index: function (req,res, next) {
            res.render('login');
        },
    
        login: function(req,res, next) {
            if (req.body.name === "james" || req.body.pass === "bond") {
                //req.session.isLoggedIn = true; 
              //  res.sendFile('index.html');
                //res.redirect(301, '/');
            } else {
                res.redirect(301, '/auth');
            }
        },
        
        logout: function (req,res,next) {
            req.session.destroy(function (err) {
                res.redirect(301, '/auth');
            });
        }
    
}*/