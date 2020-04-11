console.log("ready!")
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

module.exports = function (app) {

  // Routes
  // A GET route for scraping the Guitar World website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.guitarworld.com/lessons").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      //console.log(response.data)
      // Now, we grab every article within an article tag within the liveForLiveMusic website, and do the following:
      $(".listingResult").each(function (i, element) {
        //  console.log(this)
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children() //var title = $(element).children().text();
          .text();
        result.name = $(this) //var synopsis = $(element).find(".synopsis").text();
          .find(".article-name")
          .text();
        result.synopsis = $(this) //var name = $(element).find(".article-name").text();
          .find(".synopsis")
          .text();
        result.link = $(this) // var link = $(element).find("a").attr("href");
          .find("a")
          .attr("href");
        result.img = $(this) //var img = $(element).find('img').attr('src');
          .find("img")
          .attr("data-pin-media");
        result.date = $(this) // var date =$(element).find(".published-date").attr("data-published-date");
          .find(".published-date")
          .attr("data-published-date");
         

        db.Article.findOne({
            title: result.title
          })
          .then(function (data) {
         
            if (data) {
              console.log("Already created")
            } else {
              // Create a new Article using the `result` object built from scraping
              console.log(result);
              db.Article.create(result)
                .then(function (dbArticle) {
                  // View the added result in the console
                  console.log(dbArticle);
                })
                .catch(function (err) {
                  // If an error occurred, log it
                  console.log(err);
                });
            }
          })
      });
      // Send a message to the client
      res.send("Scrape Complete");
    });
 
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for getting all Notes from the db
  app.get("/notes", function (req, res) {
    // Grab every document in the Articles collection
    db.Note.find({})
      .then(function (dbNote) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbNote);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });




  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
        _id: req.params.id
      })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, {
          note: dbNote._id,
      
        }, {
          new: true
        });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  }); //app.post


  // Delete One from the DB
  app.delete("/articles/:id", function (req, res) {
    // Remove a note using the objectID
    db.Note.remove({
        _id: req.params.id
      },{
        note: dbNote._id,
    
      },
      function (error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });




}; //module.exports