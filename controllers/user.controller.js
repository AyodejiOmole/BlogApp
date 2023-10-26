import User from "../model/User";
import bcrypt from "bcrypt";

export const getAllUsers = async(req, res, next) => {
    let users;
    try {
        users = await User.find();
        
    } catch(error) {
        console.log(error);
    }
    
    if(!users) {
        return res.status(404).json({ message: "No users found!" });
    }

    return res.status(200).json({ users });
}

export const signUp = async(req, res, next) => {
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(err) {
        return console.log(err);
    }

    if(existingUser) {
        return res.status(400).json({ message: "User already exists! Login instead"});
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });
    
    try {
        user.save();
    } catch (error) {
        return console.log(error);
    }

    return res.status(201).json({ user });
}