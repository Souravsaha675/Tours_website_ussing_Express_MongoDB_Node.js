/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('Unhandled Exception! shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

/*const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);*/

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection established successfully'));
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection! shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
