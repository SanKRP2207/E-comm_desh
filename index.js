require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4500;
const jwtKey = process.env.JWT_SECRET;
require("./db/config");
const user = require('./db/User');
const cors = require('cors');
app.use(cors());
const Jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

app.get('/searchuser/:key', async (req, res) => {
    const searchuser = await user.find({
        '$or': [
            { name: { $regex: req.params.key } }
        ]
    })
    res.send(searchuser);
})

app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
})

app.post('/register', async (req, resp) => {
    try {
        // let User = new user(req.body);


        const User = new user({
            ...req.body,
            // image: req.file.filename
        })

        let result = await User.save();
        result = result.toObject();
        delete result.password;
        resp.status(201).send(result);
    } catch (error) {
        console.error('Error creating product:', error);
        resp.status(500).send({ error: 'An error occurred while creating the product' });

    }
});

// app.post('/login', async (req, resp) => {

//     if (req.body.email && req.body.password) {

//         let User = await user.findOne(req.body).select('-password');
//         if (User) {
//             Jwt.sign({ User }, jwtKey, (err, token) => {
//                 if (err) {
//                     resp.send({ result: ' Something wrong try after same time' });
//                 }
//                 // console.log(token);
//                 resp.send({ User, auth: token });
//             });
//             // resp.send(User);
//         } else {
//             resp.send({ result: ' User Not found' });
//         }
//     } else {
//         resp.send({ result: ' Missing data' });
//     }



// });

app.post('/login', async (req, resp) => {
    if (req.body.email && req.body.password) {
        let User = await user.findOne(req.body).select('-password');
        if (User) {
            Jwt.sign({ User }, jwtKey, (err, token) => {
                if (err) {
                    return resp.send({ result: 'Something went wrong, try again later.' });
                }
                return resp.send({ User, auth: token });
            });
        } else {
            return resp.send({ result: 'User not found' });
        }
    } else {
        return resp.send({ result: 'Missing data' });
    }
});



const product = require('./db/Product');


app.post('/addProduct', upload.single('file'), async (req, res) => {
    try {
        const Product = new product({
            ...req.body,
            image: req.file.filename
        });
        // let Product = await product(req.body);
        let result = await Product.save();
        // resp.send(result);
        res.status(201).send(result);
    } catch (error) {
        // Handle errors and send an appropriate response
        console.error('Error creating product:', error);
        res.status(500).send({ error: 'An error occurred while creating the product' });
    }
})
app.use('/images', express.static(path.join(__dirname, 'public/Images')));


app.get('/productList', async (req, resp) => {
    let Products = await product.find();
    // resp.send(Products);
    if (Products.length > 0) {
        resp.send(Products);
    } else {
        resp.send({ result: 'No Product found' });
    }
});

app.delete('/delete/:id', async (req, resp) => {
    let result = await product.deleteOne({ _id: req.params.id });
    resp.send(result);
})


app.get('/products/:id', async (req, resp) => {
    let result = await product.find({ _id: req.params.id });

    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: 'Not found' })
    }
})


app.put('/update/:id', async (req, resp) => {
    let result = await product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result);
});


app.get('/search/:key', async (req, resp) => {

    let result = await product.find({
        "$or": [
            { image: { $regex: req.params.key, $options: 'i' } },
            { name: { $regex: req.params.key, $options: 'i' } },
            { price: { $regex: req.params.key, $options: 'i' } },
            { category: { $regex: req.params.key, $options: 'i' } },
            { company: { $regex: req.params.key, $options: 'i' } }
        ]
    })
    resp.send(result);

})
app.listen(PORT); 