let mongoose = require('mongoose');
let User = require('../models/user');

function getUsers(req, res) {
	let query = User.find({});
	query.exec((err, users) => {
		if(err) res.send(err);
		res.json(users);
	});
}

function postUser(req, res) {
	var newUser = new User(req.body);
	newUser.save((err,user) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "User successfully added!", user });
		}
	});
}

/*
 * GET /user/:id route to retrieve a user given its id.
 */
function getUser(req, res) {
	User.findById(req.params.id, (err, user) => {
		if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(user);
	});		
}

/*
 * DELETE /user/:id to delete a user given its id.
 */
function deleteUser(req, res) {
	User.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "User successfully deleted!", result });
	});
}

/*
 * PUT /user/:id to updatea a user given its id
 */
function updateUser(req, res) {
	User.findById({_id: req.params.id}, (err, user) => {
		if(err) res.send(err);
		Object.assign(user, req.body).save((err, user) => {
			if(err) res.send(err);
			res.json({ message: 'User updated!', user });
		});	
	});
}

//export all the functions
module.exports = { getUsers, postUser, getUser, deleteUser, updateUser };