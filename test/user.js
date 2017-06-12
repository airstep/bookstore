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

  describe('/GET user', () => {
	  it('it should GET all the Users', (done) => {
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

  describe('/POST user', () => {
	  it('it should not POST a user without email field', (done) => {
			let user = {       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				//"email": "dingo@gmail.com",        
				"sis": "321",        
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
	  it('it should POST a user ', (done) => {
			let user = {       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"sis": "321",        
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

  describe('/GET/:id user', () => {
	  it('it should GET a user by the given id', (done) => {
			let user = new User({       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"sis": "321",        
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

  describe('/PUT/:id user', () => {
	  it('it should UPDATE a user given the id', (done) => {
			let user = new User({       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"sis": "321",        
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

  describe('/DELETE/:id user', () => {
	  it('it should DELETE a user given the id', (done) => {
				let user = new User({       
				"dogName" : "Dingo",        
				"gender" : "male",        
				"age" : "2",        
				"ownerName": "avi",        
				"email": "dingo@gmail.com",        
				"sis": "321",        
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
});
  