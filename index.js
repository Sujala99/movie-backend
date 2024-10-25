const express = require("express");
const mongoose = require("mongoose");
// const commentRoutes = require('./routes/comment'); // Import the comment routes

// // Google login
// const passport = require('passport');
// const session = require('express-session');
// require('./passport');

const cors = require("cors");

// [SECTION] Routes
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");
// const port = 4000;
// Environment Setup
require('dotenv').config();

// Server setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(cors());

// Customizing cors options to meet specific requirments
const corsOptions = {
    // to update the origin of the request
    origin: ['http://localhost:3000','http://localhost:8000'], // Allow requests from this origin. The origin is in array form if there are multiple origins.
    credentials: true, // allow credentials
    optionsSuccessStatus: 200 // Provide a status code to use for successful OPTIONS request.
}

app.use(cors(corsOptions));



// Database Connection
mongoose.connect(process.env.MONGODB_STRING,{
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

// [SECTION] Backend Routes
app.use("/users", userRoutes); 
app.use("/movies", movieRoutes);
// app.use('/comments', commentRoutes); 


// Server Gateway Response
if(require.main === module){
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    })
}

module.exports = app;
