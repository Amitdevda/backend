const mongoose = require("mongoose")

const weatherSchema = mongoose.Schema({
    name: String,
    temp: Number,
    pressure: Number,
    humidity: Number,
}, {
    versionKey: false
})

const weathModel = mongoose.model("weathData", weatherSchema)

module.exports = { weathModel }