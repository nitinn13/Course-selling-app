const express = require('express');
const cors = require("cors");
require('dotenv').config()

const mongoose = require("mongoose")


const {userRouter} = require("./routes/user")
const {adminRouter} = require("./routes/admin")
const {courseRouter} = require("./routes/courses")


const app = express();
const port = 3000;
app.use(cors());

app.use(express.json());


app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/course', courseRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

async function main(){
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(port, () => {
    console.log(`Example app listening at http:/user//user/localhost:${port}`);
  });
}
main()