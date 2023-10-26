import User from "../model/User";

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