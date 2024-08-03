const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');

const registerController = async (req, res) => {
    try {
        const { email, password, role, name, address, phone } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'User Already exists',
                user: existingUser,
            });
        }

        console.log('Request body:', req.body);

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        console.log('Generated salt:', salt);

        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed password:', hashedPassword);

        // Replace the plain text password with the hashed password
        req.body.password = hashedPassword;

        // Create a new user instance with the hashed password
        const user = new userModel(req.body);

        // Save the user to the database
        await user.save();

        // Respond with success
        return res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
        });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({
            success: false,
            message: 'Error In Register API',
            error
        });
    }
};

module.exports = { registerController };
