const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');


const app = express();
const router = express.Router();

const productsRoutes = require("./src/Routes/products.js");
const authRoutes = require('./src/Routes/auth.js');
const blogRoutes = require('./src/Routes/blog.js');


// tempat menyimpan file image dari client
const fileStorage = multer.diskStorage({
        destination:(req, file, cb) => {
                cb(null, 'images');
        },
        filename: (req, file, cb) => {
                cb(null, new Date().getTime() + '-' + file.originalname)
        }
})

// proses filter untuk jenis file
const fileFilter = (req, file, cb) => {
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
                cb(null, true);
        } else {
                cb(null, false);
        }
}

app.use(bodyParser.json());

// agar image bisa diakses
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// mengatasi error cross origin
app.use((req,res,next) => {
        // untuk bisa diakses semua halaman website
        res.setHeader('Access-Control-Allow-Origin','*');
        // bisa akses semua metode
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        // bisa akses semua type konten
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();

})

app.use('/', productsRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

app.use((error, req, res, next) => {

        const status = error.errorStatus || 500;
        const message = error.message;
        const data = error.data;

        res.status(status).json({
                message: message,
                data: data
        });
})

// koneksi dengan mongodb meggunakan mongoose
mongoose.connect('mongodb+srv://lilopambudi:XFjiGS2wYdd4Sze0@cluster0.kzxkcnc.mongodb.net/blog?retryWrites=true&w=majority')
.then(() =>{
        app.listen(4000, () => console.log('connection success'));
})
.catch(err => console.log(err));

