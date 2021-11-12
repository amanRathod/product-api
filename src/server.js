const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));

const port = process.env.PORT || 5000;


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
