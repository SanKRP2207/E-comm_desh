const express = require('express');
const app = express();

app.get('/',(req,resp)=>{
    resp.send('Back End is ready to work');
});
app.listen(4500);