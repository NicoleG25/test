const express = require('express');
const { redisClient } = require('./Seeder/index');

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
    startTime = parseInt(req.query.startTime);
    endTime = parseInt(req.query.endTime);
    minBids = parseInt(req.query.min);
    maxBids = parseInt(req.query.max);
    if (!startTime) {
        startTime = '-inf';
    }
    if (!minBids && !maxBids) {
        minBids = 1;
        maxBids = -1;
    }
    if (!minBids) minBids = 1;
    if (!maxBids) maxBids = minBids + 20;

    redisClient.zrangebyscore("LIST_OF_BIDS", startTime, endTime, 'withscores', 'limit', minBids, maxBids, function (err, replies) {
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


app.listen(port, () => {
    redisClient.flushdb( function (err, succeeded) {
        console.log(succeeded); // will be true if successfull
    });
    console.log(`Example app listening on port ${port}!`)});