const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function register(req, res) {

    try {

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });


        await newUser.save();


        res.status(201).json({
            message: "User Registered Successfully"
        });


    } catch (error) {

        console.log("REGISTER ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }

}



async function login(req, res) {

    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);


        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            "fleet_secret_key",
            {
                expiresIn: "1d"
            }
        );


        res.status(200).json({

            message: "Login Successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    } catch (error) {

        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }

}



module.exports = {
    register,
    login
};