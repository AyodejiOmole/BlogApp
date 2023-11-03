import Blog from "../model/Blog";
import User from "../model/User";
import mongoose from "mongoose";

export const getAllBlogs = async(req, res, next) => {
    let blogs;

    try {
        blogs = await Blog.find();
    } catch (error) {
        return console.log(error);
    }
    if(!blogs) {
        return res.status(404).json({ message: "Blogs not found" });
    }

    return res.status(200).json({ blogs });
}

export const addBlog = async(req, res, next) => {
    const { title, description, image, user } = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch(error) {
        return console.log(error);
    }
    if(!existingUser) {
        return res.status(400).json({ message: "Unable to find user by this ID."});
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }

    return res.status(200).json({ blog });
};

export const updateBlog = async(req, res, next) => {
    const blogId = req.params.id;
    const { title, description } = req.body;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        });
    } catch (error) {
        return console.log(error);
    }

    if(!blog) {
        return res.status(500).json({ message: "Unable to update blog" });
    }

    return res.status(200).json({ blog });
}

export const getById = async(req, res, next) => {
    const blogId = req.params.id;
    let blog;

    try {
        blog = await Blog.findById(blogId);
    } catch (error) {
        return console.log(error);
    }
    if(!blog) {
        return res.status(404).json({ message: "Blog not found!"});
    }

    return res.status(200).json({ blog });
}

export const deleteBlog = async(req, res, next) => {
    const blogId = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndRemove(blogId).populate("user");
        await blog.user.blogs.pull(blog);
    } catch (error) {
        return console.log(error);
    }
    if(!blog) {
        return res.status(500).json({ message: "Could not delete blog. Retry in a bit."});
    }

    return res.status(200).json({ message: "Successfully deleted" });
}