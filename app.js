require('dotenv').config();
require('express-async-errors');

const connectDB = require('./db/connect');

const express = require('express');
const app = express();

const path = require('path');

const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRouter');
const orderRouter = require('./routes/orderRouter');
const uploadRouter = require('./routes/uploadRouter');

const fileUpload = require('express-fileupload');

const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');

app.use(cors());
app.use(helmet());
app.use(xss());

app.use(fileUpload());

app.use(express.static('./public'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

app.get('/about', (req, res) => {
  res.send('Hello');
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => console.log(`Server listening on port ${port}`));
};

start();
