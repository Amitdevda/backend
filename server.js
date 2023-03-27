const express=require('express')
const winston=require('winston')
const expressWinston=require('express-winston')
const { connect } = require('mongoose')
const { user_Router } = require('./route/userRoute')
const {authentication}=require('./middleware/authentication.js')
const { weathModel } = require('./model/wethModel')


const app=express()
app.use(express.json())

app.use(expressWinston.logger({
    statusLevels: true,
    transports:[
        new winston.transports.Console({
            level: 'silly',
            json: true
        }),
        new winston.transports.File({
            level: 'silly',
            json : true,
            filename: 'logging.log'
        })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
}));

app.use('/',user_Router)
app.use(authentication)
app.use('/',weathModel)

app.listen(3131,async()=>{
    try {
        await connect;
        console.log(`DB is connected & server is listing at 3131`)
    } catch (error) {
        console.log(error)
    }
})