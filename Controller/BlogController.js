const BlogModel = require('../Model/BlogModel');

// Create Blog
const createBlog = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newBlog = new BlogModel({
        title,
        description,
        image,
        createdBy: req.user.id,
    });

    await newBlog.save();
    res.redirect('/blogs/all'); // Redirect to the blogs listing page after creating a blog
};

// View All Blogs
const viewAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find();
        const user = req.user || null; // Get the logged-in user if available
        res.render("blogs", { blogs, user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// View User Blogs
const viewUserBlogs = async (req, res) => {
    const blogs = await BlogModel.find({ createdBy: req.user.id });
    res.render('blogs', { blogs });
};
const updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            blogId,
            { title, description, image },
            { new: true } // Return the updated blog
        );

        if (!updatedBlog) {
            return res.status(404).send('Blog not found');
        }

        // Redirect to the blogs listing page after update
        res.redirect('/blogs/all');
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update blog.");
    }
};

// Delete Blog
const deleteBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        const deletedBlog = await BlogModel.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).send('Blog not found');
        }

        res.redirect('/blogs/all'); // Redirect to the blogs listing page after deleting the blog
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete blog.");
    }
};

module.exports = { createBlog, viewAllBlogs, viewUserBlogs, updateBlog, deleteBlog };
