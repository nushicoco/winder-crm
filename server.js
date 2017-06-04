console.log('Starting Server......');

const express = require('express');
const app = express();

app.listen(3000, function (){
    console.log("listening to 3000");
})