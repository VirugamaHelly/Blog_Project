const express = require('express');
const multer = require('multer');
const BlogModel = require('../Model/BlogModel');
const { authenticate } = require('../Middleware/AuthMiddleware');
const { createBlog, viewAllBlogs, viewUserBlogs, updateBlog, deleteBlog } = require('../Controller/BlogController');

const router = express.Router();
const upload = multer({ dest: 'Uploads/' });

// Route to render blog creation form
router.get('/create', authenticate, (req, res) => {
  res.render('createBlog', { user: req.user });
});

// Route to handle blog creation
router.post('/create', authenticate, upload.single('image'), createBlog);

// Route to view all blogs
router.get('/all', viewAllBlogs);

// Route to view user's own blogs
router.get('/user', authenticate, viewUserBlogs);

// Route to render blog update form
router.get('/edit/:id', authenticate, async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);
  if (!blog) {
    return res.status(404).send('Blog not found');
  }
  res.render('editBlog', { blog, user: req.user });
});

// Route to handle blog update (POST request for updating)
router.post('/update/:id', authenticate, upload.single('image'), updateBlog);

// Route to handle blog deletion
router.post('/delete/:id', authenticate, deleteBlog);

module.exports = router;
