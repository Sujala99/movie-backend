const bcrypt = require('bcrypt');
const User = require('../models/User');


const auth = require('../auth');


module.exports.registerUser = (req, res) => {
	if (!req.body.email.includes("@")) {
		return res.status(400).send({error: "Email invalid"});
	} else if (req.body.password.length < 8) {
		return res.status(400).send({error: "Password must be at least 8 charaters"})
	} else {
		let newUser = new User({
			email : req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((user) => res.status(201).send({message: "Registered Successfully"}))
		.catch(err => {
			console.error("Error in saving:", err)
			return res.status(500).send({error: "Erro in save"})
		})

	}
};


module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                // if the email is not found, send a message 'No email found'.
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    // if all needed requirements are achieved, send a success message 'User logged in successfully' and return the access token.
                    return res.status(200).send({ 
                        message: 'User logged in successfully',
                        access : auth.createAccessToken(result)
                        })
                } else {
                    // if the email and password is incorrect, send a message 'Incorrect email or password'.
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    } else{
        // if the email used in not in the right format, send a message 'Invalid email format'.
        return res.status(400).send({ message: 'Invalid email format' });
    }
};

module.exports.getProfile = (req, res) => {
    // Retrieve the user's ID from the authenticated request
    const userId = req.user.id;

    return User.findById(userId)
        .select('-password') // Exclude password from the response
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            return res.status(200).send({ user });
        })
        .catch(err => {
            console.error('Error fetching user profile:', err);
            return res.status(500).send({ error: 'Failed to fetch user profile', details: err });
        });
};
