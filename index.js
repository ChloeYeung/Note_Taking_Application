//import library
const express = require("express");
const app = express();
const path = require("path")
const fs = require('fs')
const port = 3000;
const { engine } = require('express-handlebars');
const basicAuth = require("express-basic-auth");
const users = require("./Stores/users.json");
require('dotenv').config();
const knexConfig = require("./knexfile")["development"];
const knex = require ("knex")(knexConfig);

//Basic Auth
const AuthChallenger = require("./AuthChallenger.js")

app.use(
    basicAuth({
        authorizeAsync: true,
        authorizer: AuthChallenger(knex), //pass the auth js here
        challenge: true, // if true -> pop up window for asking user & pw
        realm: "Note Taking Application woth knex",
    }))

//Node Service local modules
const noteService = require("./Services/NoteService");

//Node Router local modules
const NoteRouter = require("./Routers/NoteRouter");
const exp = require("constants");

let response;

//express middleware (handling request)
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // make ajax call, will make json format, not form
app.use(express.static(__dirname + 'public'));
app.use(express.static(path.join(__dirname, 'public')));

//express-handlebar set up
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', './views');

//express server
app.get("/", (req, res) => {
    console.log("someone came...")
    res.type('.html')    
    res.render('index', {user:req.auth.user});
})

//Set up note router
app.use("/api/notes", new NoteRouter(new noteService("../Stores/notes.json",fs, knex), express).router());

app.listen(port, () => console.log(`App listening to port ${port}, http://localhost:3000
`));

module.exports = app;