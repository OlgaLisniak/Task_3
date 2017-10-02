const fs = require('fs');
const STAT = './data/statistics.json';
const express = require('express');
const router = express.Router();


module.exports = {

    getTop10: function(req,res) {
        getTop((err, top10) => {
            if(err) {
                res.writeHead(500, {'Content-Type':'text/plain'});
                res.end('File not Found');
            } else {
                let data = JSON.stringify(top10);
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(data);
            };
        });
    },

    save: function(req, res) {

        let newPlayer = req.body;

        fs.readFile (STAT, (err, stat) => {
            if (err) {
                throw err;
            }

            

            resArr = JSON.parse(stat);

            let match = false;

            for (let i = 0; i < resArr.length; i++) {

                var player = resArr[i];

                if (player.name == newPlayer.name) {

                    match = true;

                    if (player.score < newPlayer.score) {
                        player.score = newPlayer.score;
                    }

                    break;
                } 
            }

            if (!match) {
                resArr.push(newPlayer);
            }

            let arrToWrite = JSON.stringify(resArr, null, 2);

            fs.writeFile(STAT, arrToWrite, function () {
                sortStat(JSON.parse(arrToWrite));

            });
        });
        res.end();
    }
}

function getTop(done) {
    
      fs.readFile(STAT, "utf8", (err, data) => {
    
        if (err) {
          return done(err);
        }
      
        let results = JSON.parse(data);
    
        sortStat(results);
    
        let res = results.slice(0,10);
    
        done(null, JSON.stringify(res));
      });
    };
    
    function sortStat(stats) {
        stats.sort((a, b) => a.score < b.score);
    }