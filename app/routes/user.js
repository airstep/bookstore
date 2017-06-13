let mongoose = require('mongoose');
let User = require('../models/user');

function list(req, res) {
	let query = User.find({});
	query.exec((err, users) => {
		if(err) res.send(err);
		res.json(users);
	});
}

function add(req, res) {
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

function register(req, res) {
	var newUser = new User(req.body);
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "User successfully registered!", user });
		}
	});
}

function login(req, res) {
	var user = new User(req.body);
	User.authenticate()(user.email, user.password, (err, user, message)  => {
		if (err)
			res.send(err);
		else
			res.json({message: "User successfully registered!", user });
	});
}

function logout(req, res) {
  req.logOut();
	if (req.session) {
		req.session.destroy(function (err) {
			if (err) { return next(err); }
			// The response should indicate that the user is no longer authenticated.
			return res.json({ message: 'ok', authenticated: req.isAuthenticated() });
		});	
	} else {
		return res.json({ message: 'ok', authenticated: req.isAuthenticated() });
	}
}
/*
 * GET /user/:id route to retrieve a user given its id.
 */
function get(req, res) {
	User.findById(req.params.id, (err, user) => {
		if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(user);
	});		
}

/*
 * DELETE /user/:id to delete a user given its id.
 */
function remove(req, res) {
	User.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "User successfully deleted!", result });
	});
}

/*
 * PUT /user/:id to updatea a user given its id
 */
function update(req, res) {
	User.findById({_id: req.params.id}, (err, user) => {
		if(err) res.send(err);
		Object.assign(user, req.body).save((err, user) => {
			if(err) res.send(err);
			res.json({ message: 'User updated!', user });
		});	
	});
}

//export all the functions
module.exports = { list, add, get, remove, update, login, logout, register };