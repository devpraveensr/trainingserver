const express = require('express');
const app = express();

const morgan = require('morgan');

const mongoose = require('mongoose');
const cors = require("cors");

const TrainingRoutes = require('./routes/training-routes');
const UserRoutes = require('./routes/user-routes');
const AuthRoutes = require('./routes/auth-routes');
const CreateAdmin = require('./middlewares/createadmin.middleware');

// mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB}`, {
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => console.log(err.reason));

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.status(200).json({});
  }
  next();
});
app.use(CreateAdmin);
app.use('/api/v1/training', TrainingRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/auth', AuthRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found!');
  res.status(404).json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;