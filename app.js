const dotenv = require('dotenv')
dotenv.config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

/* Routes*/
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var claimRouter = require('./routes/claims');
var municipalityRouter = require('./routes/municipalitys');
var locationRouter = require('./routes/locations');
var eventRouter = require('./routes/events');
var articlesRouter = require('./routes/articles')


var app = express();

// mongoose connect string_conn = mongodb+srv://adminIOS:<IFJWGrpWfCv5jAuV>@ios.sonll.mongodb.net/IOS?retryWrites=true&w=majority
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/claims', claimRouter);
app.use('/municipalitys', municipalityRouter);
app.use('/locations', locationRouter);
app.use('/events', eventRouter);
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/articles', articlesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.json({ message: err.message, error: req.app.get('env') === 'development' ? err : {} })


  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
