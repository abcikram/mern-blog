const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController')



router.post('/create-blog',blogController.createBlog)

router.get('/all-blog', blogController.getAllBlog)

// Single - blog details:-
router.get('/get-blog/:id', blogController.getBlogById)

router.put('/update-blog/:id', blogController.updateBlog)

router.delete('/delete-blog/:id', blogController.deleteBlog)

router.get('/user-blog/:id',blogController.userBlog)




module.exports = router