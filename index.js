const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');
const homeRouter = require('./routes/homeRouter');
const adminRouter = require('./routes/adminRouter');

const jsonParser = express.json();
require('dotenv').config();
const app = express();
let PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.text({limit: '50mb', extended: true}));
app.use(bodyParser.raw({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({parameterLimit: 100000, limit: '50mb', extended: true}));
async function start() {
    await mongoose.connect('mongodb://127.0.0.1:27017/PhoneSalon');
    app.listen(PORT);
    console.log(`Server listen on ${PORT}`);
}
start();
app.use('/',express.static(__dirname + '/views'));
app.use('/catalog',express.static(__dirname + '/views'));
app.use(jsonParser);
app.use('/admin/',express.static(__dirname + '/views'));
app.use('/admin/control',express.static(__dirname + '/views'));

app.use('/admin/control',express.static(__dirname + '/views'));

app.use('/auth', authRouter);
app.use('/', homeRouter);
app.use('/admin', adminRouter);