const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1.MIDDLEWARS
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Hello from middleware 👋');
  next();
});
//2.ROUTE HANDLERS
//3.ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//4.SERVER
module.exports = app;
