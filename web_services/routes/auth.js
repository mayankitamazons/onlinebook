const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


//Register
router.post("/register",async (req,res)=>{
	const {username,email,password} = req.body;
	const newUser = new User({
		username,
		email,
		password: CryptoJS.AES.encrypt(password, process.env.PASS_SECRET).toString()
	});

	try{

		const savedUser = await newUser.save();
		res.status(200).json({success:1,message:"User registered successfully",data:[savedUser]});

	}catch(err){
		
		res.status(500).json({success:0,message:err});
	}

});

//Login
router.post("/login",async (req,res)=>{
	const {username,password} = req.body;
	
	try{
		const user = await User.findOne({username});
		if(!user){
			res.status(200).json({success:1,message:"Invalid Username or Password"});
		}else{
			const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
			const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
			
			if(req.body.password!=originalPassword){
				res.status(200).json({success:1,message:"Invalid Username or Password"});
			}else{
				const accessToken = jwt.sign(
					{
						id:user._id,
						isAdmin: user.isAdmin				
					},
					process.env.JWT_SECRET,
					{expiresIn:"3d"}
				);

				const {password,...others} = user._doc;
				res.status(200).json({success:1,message:"",data:[{...others}],token:accessToken});
			}
		}
		

	}catch(err){
		res.status(500).json({success:0,message:err});
	}

});


module.exports = router;