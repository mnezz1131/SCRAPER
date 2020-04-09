 // Require all models
 var db = require("../models");

 module.exports = function (app) {

     // Main route (renders the index page)
     app.get("/", function (req, res) {
         res.render("index");
     });


 }