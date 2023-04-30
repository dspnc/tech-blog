//this file is the app runner that sets up Express and installs the middleware such as
//authentication/session/handlebars/routes/static files

//built in node.js package with utilities for working with the file directory, useful for views
const path = require('path');

//import express to create the "app" instance and handle HTTP requests
const express = require('express');

//import express session middleware used to manage session data in the app
const session = require('express-session');

//import express handlebars for express templating engine with dynamic HTML views
const exphbs = require('express-handlebars');

//store session data in the database using sequelize
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//route handlers for incoming HTTP requests
const routes = require('./controllers');

//imports the sequelize instance from connection.js for connecting to the mysql database
const sequelize = require('./config/connection');

//import helper functions for handlebar templates
const helpers = require('./utils/helpers');

//initializes express instance and sets server to listen at specified port
const app = express();
const PORT = process.env.PORT || 3001;

//sets up sess object as instance of express-session with definied options to set behavior of
//session management middleware
const sess = {
    //sign session ID cookie with secret
    secret: 'Super secret secret',
    //sets the session ID cookie options, such as 
    //the name of the cookie, the expiration time, and the path (empty=default)
    cookie: {},
    //session data not saved to the store on every request, only after being modified
    resave: false,
    //uninitialized sessions will be saved to the store
    //uninitialized session is a session that is new but not modified
    saveUninitialized: true,
    //creates a new SequelizeStore instance and passes in the sequelize instance
    //used to store session data in the MySQL database using Sequelize
    store: new SequelizeStore({
      db: sequelize,
    }),
  };
  
  //passes sess instance to the app to manage session data
  app.use(session(sess));

//creates new instance of express-handlebars with the helpers object passed in as option
//helpers object contains helper functions that can be used in the handlebars template
const hbs = exphbs.create({ helpers });

//sets up the handlebars engine for rendering templates by calling the engine() method on the app instance
//two arguments: the name of the engine and the actual engine to use (hbs.engine)
app.engine('handlebars', hbs.engine);

//sets the default view engine to handlebars by calling the set() method on the app instance 
//The set() method takes two arguments: the name of the setting to set ('view engine')
//                                        and the value to set it to ('handlebars')    
//tells Express to use the handlebars engine to render templates.
app.set('view engine', 'handlebars');

//allows Express to parse requests sent in JSON payloads
//parses the data for use in the req.body for route handlers
app.use(express.json());
// parse incoming requests with URL-encoded payloads
//parses URL-encoded data and makes it available as req.body object in the route handlers
//The extended: true option allows for parsing of rich objects and arrays encoded in the URL
app.use(express.urlencoded({ extended: true }));
//serve static files from the public directory
//specifies the directory where the static files are located
//and any files in that directory can be accessed directly from the client-side by navigating to the appropriate URL
//the __dirname variable is a Node.js global variable that contains the absolute path of the directory containing the currently executing file.
app.use(express.static(path.join(__dirname, 'public')));

//sets up the application to use the routes defined in the ./controllers directory
//adds the router middleware to the application's request handling chain
app.use(routes);

//synchronizes the application's database schema with the Sequelize models defined in the ./models directory
//calls the sync() method on the sequelize instance, passing in an options object with the force: false option
//tells Sequelize not to drop and recreate the database tables if they already exist
//The sync() method returns a promise that resolves when the synchronization is complete
sequelize.sync({ force: false }).then(() => {

  //starts the server listening on the specified port (PORT) by calling the listen() method on the app instance
  //two arguments: the port to listen on and a callback function
  app.listen(PORT, () => console.log('Now listening'));
});
