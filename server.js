let express = require('express')
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

// mongoose local auth: https://github.com/saintedlama/passport-local-mongoose
passport.use(User.createStrategy());

//parse application/json and look for raw text                                        
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({	extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({	type: 'application/json' }))

app.get("/", (req, res) => res.json({ message: "Welcome!" }))

app.route("/user")
	.get(user.getUsers)
	.post(user.postUser)

app.route("/user/:id")
	.get(user.getUser)
	.delete(user.deleteUser)
	.put(user.updateUser)

app.listen(port)
console.log("Listening on port " + port)

module.exports = app // for testing