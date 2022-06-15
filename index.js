const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dataRouter = require('./routes/dataRouter');
const userRouter = require("./routes/user")
const errorHandle = require("./middleware/error-handling")
require('dotenv/config');

const PORT = process.env.PORT ?? 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', dataRouter);
app.use('/api', userRouter);
app.use(errorHandle)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true },
      () => console.log('connected to database')
    )

    app.listen(PORT, () => {
      console.log('server has been started on port ' + PORT);
    });

  } catch(e) {
    console.log(e);
  }
};
start();
