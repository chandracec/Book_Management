const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
const validation = require('../utils/validation')

//  User registration handler
const registerUser = async (req, res) => {
  try {

    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({
        error: !req.body
          ? "Request body is missing"
          : !req.body.email
          ? "Email is required"
          : "Password is required",
      });
    }
    if(!validation.validEmail(req.body.email)) return res.status(400).send({status:false,message:"email is invalid"})
    
    if(!validation.passwordCheck(req.body.password))return res.status(400).send({status:false,message:"password is invalid"})

    const data = await userModel.create(req.body);
    res.status(201).send({ data });
  } catch (error) {
    if (error.message.includes('validation')) {
      return res.status(400).send({ status: false, message: error.message })
  } else if (error.message.includes('duplicate')) {
      return res.status(400).send({ status: false, message: error.message })
  } else {
      res.status(500).json({ status: false, message: error.message })
  }}
};

// User login handler
const loginUser = async (req, res) => {
  try {

    // Check if request body is empty or missing required fields
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Find the user by their email
    const userData = await userModel.findOne({ email: req.body.email });

    // Check if the user exists and the password is correct
    if (!userData || userData.password !== req.body.password) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    // Generate a JWT token with the user's ID
    const token = jwt.sign({ userId: userData._id }, "secretKey", {
      expiresIn: "5h",
    });

    // Return the token and HTTP status 200 (OK)
    res.status(200).json({ status:true,data:token });
  } catch (error) {
    // Handle any errors that occurred during the login process
    res.status(500).json({ status:false,error: error.message });
  }
};

module.exports = { registerUser, loginUser };
