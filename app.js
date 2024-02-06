require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');

const db = require('./database/mongodb');
const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');

const app = express();

db.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// set global variable for pug template
app.locals.ADMIN_PATH = process.env.ADMIN_PATH || '/admin';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.locals.currentPath = req.path;
	next();
});
app.use('/', clientRouter);
app.use(process.env.ADMIN_PATH || '/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(process.env.PORT, () => {
	console.log(`App listening at http://localhost:${process.env.PORT}`);
});
