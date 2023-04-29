const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose')

exports.createBlog = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;

        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                message: "Please Provide all fields"
            })
        }

        const existUser = await userModel.findOne({ _id: user });

        //validation:-
        if (!existUser) {
            return res.status(400).send({
                success: false,
                message: "unable to find user"
            })
        }

        // It starts a new transaction with the session.startTransaction() method.Transactions allow multiple operations to be grouped together as a single unit of work.If any operation in the transaction fails, all changes made in the transaction will be rolled back.

        const newBlog = new blogModel(req.body)
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        existUser.blogs.push(newBlog);
        await existUser.save({ session })

        //It commits the transaction with the session.commitTransaction() method, which makes all changes made in the transaction permanent.
        await session.commitTransaction()
        await newBlog.save()
        // or we use:- 
        // const newBlog = await blogModel.create(req.body)

        return res.status(201).send({
            success: true,
            message: "Blog Create",
            newBlog
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}



exports.getAllBlog = async (req, res) => {
    try {
        const blogs = await blogModel.find({});

        if (!blogs) {
            return res.status(200).send({ success: false, message: "No blog is found" })
        }

        return res.status(200).send({
            blogCount: blogs.length,
            success: true,
            message: "all Blogs Lists",
            blogs
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}


exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params

        const getBlog = await blogModel.findById(id)

        if (!getBlog) {
            return res.status(404).send({
                success: false,
                message: 'Blog not found',
            })
        }

        return res.status(200).send({
            success: true,
            message: 'fetch single blog ',
            getBlog
        })

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}


exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, image } = req.body;
        const updateBlog = await blogModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        )
        return res.status(200).send({
            success: true,
            message: 'Blog Updated',
            updateBlog
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}


exports.deleteBlog = async (req, res) => {
    try {

        const blog = await blogModel.findOneAndDelete(req.params.id).populate("user")

        //we are pull the blog from Blog array in the user collection.
        await blog.user.Blog.pull(blog)

        // Then remaning blog will be save
        await blog.user.save()

        return res.status(200).send({
            success: true,
            message: 'The blog is deleted',
        })

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}

exports.userBlog = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate('blogs') //using the poputate we are going to "blogs" path in userSchema .
        
        if (!userBlog) {
            return res.status(401).send({
                success: false,
                message: "blogs not found with this id"
            })
        }

        return res.status(200).send({
            success: true,
            message: "userBlog",
            userBlog
        })

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }

}