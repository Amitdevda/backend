const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const express = require("express")

const wethRouter = express.Router()
const { weathModel } = require("../model/wethModel")

const { createClient } = require("redis")
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();




wethRouter.post("/weather/:city", async (req, response) => {

    const { city } = req.params;
    console.log(city)
    const data = await client.hGet("th", `${JSON.stringify(city)}`)
    if (data) {
        response.status(200).send(JSON.stringify(data))
    } else {
        function display(city) {
            latlanUrl = `api.openweathermap.org/data/2.5/weather?q=${city}&APPID=12107293464689028c88d0a76b1f1601`
            fetch(latlanUrl).then((result) => {
                return result.json()
            }).then(async (res) => {
                // const data = await res.main
                const name = await res.name
                const temp = await res.main.temp
                const pressure = await res.main.pressure
                const humidity = await res.main.humidity
                const mausam = {
                    "name": name,
                    "temp": temp,
                    "pressure": pressure,
                    "humidity": humidity
                }
                const wetda = new weathModel(mausam)
                await wetda.save()
                await client.hSet("th", `${city}`,`${mausam}`)

                response.status(200).send(JSON.stringify(mausam))

            })
        }

        display(city)

    }
})

module.exports = { wethRouter }