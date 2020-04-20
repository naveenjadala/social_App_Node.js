const express = require('express')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const { check, validationResult } = require('express-validator');
dotenv.config()

mongoose.connect(process.env.MONGO_URI,
  { useUnifiedTopology: true, useNewUrlParser: true,  useFindAndModify: false  })
  .then(() =>  console.log("DB Connected"))
  .catch(v => console.log(v));

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err}`)
})

const postRouter = require("./router/postRouter")
const userRouter = require("./router/userRouter")

app.use(morgan('test'))
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(validationResult());

app.use("/", postRouter)
app.use("/", userRouter)
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message:'Unauthorized...' });
    }
  });
  require('./prod')(app);

const port = process.env.PORT || 8080
app.listen(port, console.log(`${port}`));