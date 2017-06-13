//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../app/models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Users', () => {
	beforeEach((done) => {
		User.remove({}, (err) => { 
		   done();		   
		});		
	});

  describe('list user', () => {
	  it('it should list all the Users', (done) => {
			chai.request(server)
		    .get('/user')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body.length.should.be.eql(0);
		      done();
		    });
	  });
  });

  describe('add user', () => {
	  it('it should not ADD a user without email field', (done) => {
			let user = {       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				//"email": "dingo@gmail.com",        
				"coordX" : "374.3",        
				"coordY" : "789.6"      
			};
			chai.request(server)
		    .post('/user')
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('email');
		      done();
		    });
	  });
	  it('it should add a user ', (done) => {
			let user = {       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"coordX" : "374.3",        
				"coordY" : "789.6"      
			};
			chai.request(server)
		    .post('/user')
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	//res.body.should.have.property('message').eql('user successfully added!');
			  	res.body.user.should.have.property('email');
			  	res.body.user.should.have.property('_id');
		      done();
		    });
	  });
  });

  describe('get user', () => {
	  it('it should GET a user by the given id', (done) => {
			let user = new User({       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"coordX" : "374.3",        
				"coordY" : "789.6"      
			});
	  	user.save((err, user) => {
	  		chai.request(server)
		    .get('/user/' + user.id)
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('email');
			  	res.body.should.have.property('_id').eql(user.id);
		      done();
		    });
	  	});
			
	  });
  });

  describe('update user', () => {
	  it('it should UPDATE a user given the id', (done) => {
			let user = new User({       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"coordX" : "374.3",        
				"coordY" : "789.6"      
			});

	  	user.save((err, user) => {
				chai.request(server)
			    .put('/user/' + user.id)
			    .send({email: "test@test.com"})
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('User updated!');
				  	res.body.user.should.have.property('email').eql("test@test.com");
			      done();
			    });
		  });
	  });
  });

  describe('remove user', () => {
	  it('it should REMOVE a user given the id', (done) => {
				let user = new User({       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"coordX" : "374.3",        
				"coordY" : "789.6"      
			});
	  	user.save((err, user) => {
				chai.request(server)
			    .delete('/user/' + user.id)
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('User successfully deleted!');
				  	res.body.result.should.have.property('ok').eql(1);
				  	res.body.result.should.have.property('n').eql(1);
			      done();
			    });
		  });
	  });
  });

  describe('register user', () => {
	  it('it should REGISTER a user', (done) => {
			let user = {       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"password": "testtest",
				"coordX" : "374.3",        
				"coordY" : "789.6"      
			};

			chai.request(server)
		    .post('/register')
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
		      done();
		    });			
	  });
  });
	
  describe('login user', () => {
	  it('it should AUTH a user', (done) => {
				let user = new User({       
				"email": "dingo@gmail.com",        
				"password": "testtest"
			});

			chai.request(server)
		    .post('/login')
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
		      done();
		    });			
	  });
  });	

  describe('logout user', () => {
	  it('it should LOGOUT a user', (done) => {
			chai.request(server)
		    .post('/logout')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.have.property('message').eql('ok');
		      done();
		    });			
	  });
  });		
});
  