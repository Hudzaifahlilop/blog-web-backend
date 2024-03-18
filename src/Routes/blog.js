const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const blogController = require('../Controller/blog');

// mengirim data
router.post('/post',
    [
        body('tittle').isLength({ min: 5 }).withMessage('input minimal 5 karakter'),
        body('body').isLength({ min: 5 }).withMessage('input minimal 5 karakter')
    ],
    blogController.createBlogPost);

// Mendapatkan seluruh Data
router.get('/posts', blogController.getAllBlogPost);

// Mendapatkan Data By ID
// router.get('post/:postid', blogController.getBlogPostById);
router.route('/post/:postId')
    .get(blogController.getBlogPostById)
    .put(
        [
            body('tittle').isLength({ min: 5 }).withMessage('input minimal 5 karakter'),
            body('body').isLength({ min: 5 }).withMessage('input minimal 5 karakter')
        ],
        blogController.updateBlogPost)
    .delete(blogController.deleteBlogById)

module.exports = router;
