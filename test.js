const express = require('express');
const { redisClient } = require('./Seeder');

const app = express();
const port = 3001;


app.get('/list_of_campaigns', (req, res) => { 
    res.set('Access-Control-Allow-Origin', '*');
    redisClient.smembers('LIST_OF_CAMPAIGNS', function (err, replies) {
        if (!err) res.json(replies)
    });
})

app.get('/list_of_bids', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    redisClient.zrange('LIST_OF_BIDS', 1, 20, 'WITHSCORES', function (err, replies) {
        if (!err) res.json(replies)
    });
})

app.get('/bid/:bidid', async(req,res) => { 
    res.set('Access-Control-Allow-Origin', '*');
    var bidId = req.params.bidid;
    redisClient.get(bidId, function (err, replies) {
        if (!err) res.json(replies);
    })
    });

  
app.listen(port, () => console.log(`Example app listening on port ${port}!`));