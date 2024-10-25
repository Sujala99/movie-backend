const Movie = require("../models/movie");
const auth = require('../auth');
const Comment = require('../models/comment');

exports.addMovie = async (req, res) => {
    try {
        const { title, director, year, description, genre } = req.body;

        // Create a new movie document
        const newMovie = new Movie({
            title,
            director,
            year,
            description,
            genre
        });

        // Save the movie to the database
        await newMovie.save();

        // Send success response
        res.status(201).send({
            message: 'Movie added successfully',
            movie: newMovie
        });

    } catch (error) {
        // Error handling
        res.status(500).send({
            message: 'Failed to add movie',
            error: error.message
        });
    }
};



// Get all movies without authentication
exports.getMoviesPublic = async (req, res) => {
    try {
        const movies = await Movie.find().populate('comments'); // Populate comments if needed

        res.status(200).json({
            message: "Movies retrieved successfully",
            movies: movies
        });
    } catch (error) {
        res.status(500).send({
            message: "Failed to retrieve movies",
            error: error.message
        });
    }
};

// Get a single movie by ID without authentication
exports.getMovieByIdPublic = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the movie by ID
        const movie = await Movie.findById(id).populate('comments');

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({
            message: "Movie retrieved successfully",
            movie: movie
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve movie",
            error: error.message
        });
    }
};



exports.updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({
            message: "Movie updated successfully",
            movie: updatedMovie
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update movie",
            error: error.message
        });
    }
};



exports.deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the movie by ID and delete it
        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({
            message: "Movie deleted successfully",
            movie: deletedMovie
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete movie",
            error: error.message
        });
    }
};











// Add a comment to a movie
exports.addCommentToMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        // Find the movie by ID
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Create a new comment
        const newComment = new Comment({
            user: req.user.email,  // Assuming req.user contains the user's email
            text: text
        });

        // Save the comment
        await newComment.save();

        // Add the comment to the movie's comments array
        movie.comments.push(newComment._id);
        await movie.save();

        res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
};



// Get all comments from a movie
exports.getCommentsFromMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Find the movie by ID and populate the comments field
        const movie = await Movie.findById(movieId).populate('comments');
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({
            message: "Comments retrieved successfully",
            comments: movie.comments
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve comments",
            error: error.message
        });
    }
};
