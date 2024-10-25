const express = require("express");
const movieController = require("../controller/movie");
const auth = require("../auth");
const { verify, isLoggedIn } = auth;
const { verifyAdmin } = require("../auth");


const router = express.Router();
// / Routes accessible to everyone (no verification)
router.get('/getallmovies', movieController.getMoviesPublic);
router.get('/movies/:id', movieController.getMovieByIdPublic);

// Protected routes
router.post("/add", verify, verifyAdmin, movieController.addMovie);
router.put('/:id', verify, verifyAdmin, movieController.updateMovie);
router.delete('/:id', verify, verifyAdmin, movieController.deleteMovie);
router.post('/movie/:id/comments', verify, isLoggedIn, movieController.addCommentToMovie);
router.get('/movie/:id/getcomments', verify, isLoggedIn, movieController.getCommentsFromMovie);


module.exports= router;