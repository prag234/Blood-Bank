const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        
        // Validation
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'User Already exists',
                user: existingUser, // This should be existingUser
            });
        }
        console.log(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // Rest data
        const user = new userModel(req.body);
        await user.save();
        return res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Register API',
            error
        });
    }
};

module.exports = { registerController };
