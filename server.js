let express = require('express')
let session = require('express-session')
let app = express()
let mongoose = require('mongoose')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let port = 8080
let user = require('./app/routes/user')
let User = require('./app/models/user')
let config = require('config')
let passport = require('passport')

let db_options = {
	server: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		}
	},
	replset: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		}
	}
}

//db connection      
mongoose.connect(config.DBHost, db_options)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')) //'combined' outputs the Apache style LOGs
}

app.use(session({
  secret: 'ooNgu0wae8oiJae5Cagh',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// mongoose local auth: https://github.com/saintedlama/passport-local-mongoose
passport.use(User.createStrategy())

//parse application/json and look for raw text                                        
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({	extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({	type: 'application/json' }))

app.get("/", (req, res) => res.json({ message: "Welcome!" }))

app.route("/user")
	.get(user.list)
	.post(user.add)

app.route("/user/:id")
	.get(user.get)
	.delete(user.remove)
	.put(user.update)

app.route("/register")
	.post(user.register)

app.route("/login")
	.post(user.login)

app.route("/logout")
	.post(user.logout)
	
app.listen(port)
console.log("Listening on port " + port)

module.exports = app // for testing