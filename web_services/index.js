const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

// Read value from .env file
dotenv.config();

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'ecom'
  });
let MONGODB_URI = "mongodb+srv://@cluster0.chhg7.mongodb.net/"
let DB_NAME = "onlineBook"
let USERNM = "arpit1011"
let PASS = "arpit1011"
mongoose.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		user: USERNM,
		pass: PASS,
		dbName: DB_NAME
	})
	.then(() => {
		console.log('db connected...')
	})
	.catch(err => console.log(err.message))
//Allow to call from different source
app.use(cors());
// parse requests of content-type - application/json, Read JSON data from request
app.use(express.json());

//Use routes
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);
app.use("/api/checkout",stripeRoute);


//Read PORT from .env file OR Default set 5002
const API_PORT = process.env.API_PORT || 5002;

app.listen(API_PORT,()=>{
	console.log(`Backend Server is running on port ${API_PORT}`)
})
