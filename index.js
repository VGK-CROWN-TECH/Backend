require('dotenv').config();
const express = require('express');
const app = express();
const routes = require("./routes");
const { isEmpty } = require("../node/public/validation");
const responses = require("./public/response")
const connectDB = require('./config/dbconfig');
const cors = require('cors');
app.use(cors());
app.use(express.json());
connectDB();


app.post('/api', async (req, res) => {
    const payload = {
        apikey: req.body.apiKey,
        module: req.body.module,
        method: req.body.method,
        data: req.body.data
    }

    let apikey = payload.apikey;

    let moduleName = payload.module;
    let method = payload.method;

    if (apikey == "" || apikey == undefined || apikey != process.env.API_KEY) {
        console.log(`invalid api key `);
        let response = responses.error('401', 'unauthorized request');
        console.log(response);
    }

    let reqFields = isEmpty(payload, ["method", "module"]);

    if (reqFields.length > 0) {
        let response = responses.missingParam(reqFields);
        console.log(response);
    } else if (routes[moduleName] == undefined) {
        console.log("module error");
    }

    let result = await routes[moduleName](method, payload.data)
    res.json(result);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
