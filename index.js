const express = require('express');
const app = express();
require("./db/config");
const user = require('./db/User');
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.post('/register', async (req, resp) => {

    let User = new user(req.body);
    let result = await User.save();
    result = result.toObject();
    delete result.password;
    resp.send(result);

});

app.post('/login', async (req, resp) => {

    if (req.body.email && req.body.password) {
        let User = await user.findOne(req.body).select('-password');
        if (User) {
            resp.send(User);
        } else {
            resp.send({ result: ' User Not found' });
        }
    }else{
        resp.send({ result: ' User Not found' });
    }



});


const product = require('./db/Product');

app.post('/addProduct',async(req,resp)=>{
    let Product = await product(req.body);
    let result = await Product.save();
    resp.send(result);
})

app.get('/productList', async (req,resp)=>{
    let Products = await product.find();
    // resp.send(Products);
    if(Products.length>0)
    {
        resp.send(Products);
    }else{
        resp.send({result:'No Product found'});
    }
});

app.delete('/delete/:id', async(req,resp)=>{
    let result = await product.deleteOne({_id:req.params.id});
    resp.send(result);
})


app.get('/update/:id', async (req, resp)=>{
    let result = await product.find({_id:req.params.id});

    if(result)
    {
        resp.send(result)
    }else{
        resp.send({result:'Not found'})
    }
})


app.put('/update/:id', async (req,resp)=>{
    let result = await product.updateOne(
        {_id:req.params.id},
        {
            $set : req.body
        }
    )
    resp.send(result);
})
app.listen(4500); 