const express = require('express');
const Redis = require("ioredis");
const http = require('http');
const cors = require('cors');

const redisClient = new Redis();
const app = express();
const port = 3001;

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
const { on } = require('events');

io.on('connection', async (socket) => {
    console.log('a user connected');
    io.send("Hello, this is server");
    const m = await redisClient.smembers('LIST_OF_CAMPAIGNS', function (err, replies) {
        if (!err) return replies;
    });
    await io.emit("getCampaigns", m);
    socket.on("message", (data) => { console.log(data) });
    socket.on("bla", (data) => console.log(data));
    socket.on("campaignSelected", async (data) => {
        console.log("Campaign selected: " + data.campaign);
        console.log("timeSelected: " + data.timeSelected);
        let currentSecond = data.timeSelected;
        const bids = await redisClient.zrangebyscore("LIST_OF_BIDS", currentSecond - 1, "+inf", 'withscores', function (err, replies) {
            if (!err) return replies;
        });
        if (bids) {
            let timeStamp = [];
            let bidsArr = [];
            for (let i = 0; i < bids.length; i += 2) {
                bidsArr.push(bids[i]);
                timeStamp.push(bids[i + 1]);
            }
            const bidsInfo = await redisClient.mget(bidsArr, (err, replies) => {
                if (!err) return replies;
                return [];
            })

            let bidsByCampaign = [];

            bidsInfo.forEach(bid => {
                const bidJson = JSON.parse(bid);
                if (bidJson.campaign === data.campaign) {
                    bidsByCampaign.push(bidJson);
                }
            })

            let i = 0;
            bidsByCampaign.forEach(bid => {
                bid['id'] = bidsArr[i];
                bid['date'] = timeStamp[i];
                i += 1;
            })

            await io.emit("getBids", bidsByCampaign);
        }
    })

});

server.listen(port, () => {
    redisClient.flushdb(function (err, succeeded) {
        console.log(succeeded); // will be true if successful
    });
    console.log(`Example app listening on port ${port}!`)
});