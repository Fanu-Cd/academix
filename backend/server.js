const mongoose = require('mongoose');
const express=require('express')
const bodyParser=require('body-parser')
const port=3001
const app=express()
const cors=require('cors');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())

const mongodburl=""
mongoose.connect(mongodburl,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.listen(port,()=>{
    console.log(`Server Listening on Port ${port}`)
})

