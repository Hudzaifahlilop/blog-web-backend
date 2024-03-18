const {validationResult} = require('express-validator');
const BlogPost = require('../Models/blog');
const path = require('path');
const fs = require('fs');

// mengirim data
exports.createBlogPost = (req, res, next) => {
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if(!req.file){
        const err = new Error('image harus diupload');
        err.errorStatus = 422;
        throw err;
    }
    
    const tittle = req.body.tittle;
    const image = req.file.path;
    const body = req.body.body;

    const Posting = new BlogPost({
        tittle: tittle,
        body: body,
        image: image,
        author: {uid: 1, name:'hudzaifah'}
    });

    Posting.save()
    .then( result => {
        res.status(201).json({
            message: 'Create Blog Post Success',
            data: result
        });
    })
    .catch( err => {console.log(err)})

    // const result = {
    //     message: "Craate Blog Post Success",
    //     data: {
    //         post_id: 1,
    //         tittle: tittle,
    //         image: "imagefile.jpg",
    //         body: body,
    //         created_at: "12/06/2020",
    //         author: {
    //             uid: 1,
    //             name: "testing"
    //         }
    //     }
    // }

    // res.status(201).json(result);

}


// Mendapatkan Data
exports.getAllBlogPost = (req, res, next) => {
    const currentPage = req.query.page || 4;
    const perPage = req.query.perPage || 10;

    let totalItems;

    BlogPost.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return BlogPost.find()
        .skip((currentPage - 1) * 4)
        .limit(perPage);
    })
    .then(result => {
        res.status(200).json({
            message: "Data Blog Berhasil dipanggil",
            data: result,
            total_data: totalItems,
            per_page: perPage,
            current_page: currentPage,
        })
    })
    .catch(err => {
        next(err);
    });
   
}

// Mendapatkan data by id
exports.getBlogPostById = (req, res, next) => {
        const postId = req.params.postId;
        BlogPost.findById(postId)
        .then(result => {
            if(!result){
                const error = new Error('Data Tidak Ditemukan');
                error.errorStatus = 404;
                throw error;
            }
            res.status(200).json({
                message: "Data By ID Berhasil diakses",
                data: result,
            });
        })
        .catch(err => {
            next(err);
        });
}

// merubah post 
exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if(!req.file){
        const err = new Error('image harus diupload');
        err.errorStatus = 422;
        throw err;
    }
    
    const tittle = req.body.tittle;
    const image = req.file.path;
    const body = req.body.body;
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error("Data Tidak Ditemukan");
            error.errorStatus = 404;
            throw err;
        }

        post.tittle = tittle;
        post.body = body;
        post.image = image;

        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: "Update Success",
            data: result,
        });
    })
    .catch(err => {
        next(err);
    });
}


// meremove blog
exports.deleteBlogById = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error("Data Tidak Ditemukan");
            error.errorStatus = 404;
            throw err;
        }
        console.log("post", post);
        removeImage(post.image);
        return BlogPost.findByIdAndDelete(postId);
    })
    .then(result => {
        res.status(200).json({
            message:'Delete Success',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    });
}

const removeImage = (filePath) => {
    console.log('filePath', filePath);
    console.log('dirname', __dirname);
    // menuju direktori atau file image
    filePath = path.join(__dirname, '../..',  filePath);
    // remove image dengan filesystem
    fs.unlink(filePath, err => console.log(err));
}
