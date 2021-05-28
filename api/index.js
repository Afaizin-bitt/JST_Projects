var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1886847408:AAGl7bmfOwX9d9IQL99ISX2ptEY6t3MwTQg'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict to main predict`
    );   
});

state = 0;
bot.onText(/\/predict/, (msg) => { 
        bot.sendMessage(
        msg.chat.id,
        `Masukkan nilai i|v seperti 2/2`
    );
    state = 1   
});

bot.on('message',(msg) => {
    if(state == 1){
        s = msg.text.split("|");
        i = s[0]
        v = s[1]
        model.predict(
            [
                parseFloat (s[0]),
                parseFloat (s[1])
            ]
        ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                'nilai v yang diprediksi adalah ${jres[0]} volt'  
            );
           bot.sendMessage(
               msg.chat.id,
               'Nilai P yang diprediksi adalah ${jres[1]} Watt'
           );
        })
    }else{
        state = 0
    }
})


// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
