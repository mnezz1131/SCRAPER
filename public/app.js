$(document).ready(function () {
  console.log("Ready")
 
  var articleContainer = $(".article-container");

  // When user hits the scrape new articles-btn
  $(".scrape-new").on("click", function (event) {
    event.preventDefault();
    console.log("Yeah! Buttons bitch!")
 
    $.get("/scrape", function (data) {
      console.log(data)
   
    });
    alert("Scrape Complete!")
  })


  $(".get").on("click", function (event) {
    event.preventDefault();
    console.log("Yeah, buttons bitch!") 
   
      $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      //$("#articles").append("<p data-id='" + data[i]._id + "'>" +"Title : "+ data[i].name + "<br />" + "Summary : " + data[i].synopsis + "<br />" + "Story Link : " + data[i].link + "<br />" + data[i].img + "</p>");
      $("#articles").show();
      var div = $("<div>");
      div.addClass("card")
      div.addClass("card-header")
      div.append("<h3>Click the on story title to leave a note!</h3>")
      div.append("<h2 data-id='" + data[i]._id + "'>" + "Title : " + data[i].name + "<h2>")
      div.append('<p data-id => <img src="' + data[i].img + '" />' + '<p>');
      div.append('<h5>Story Link : ' + "<a href=" + data[i].link + ">" + data[i].synopsis + '</a>' + '</h5>');
      $("#articles").append(div);
    }
  });

});

  // When user hits the clear articles-btn

  $(".clear").on("click", function (event) {
    event.preventDefault();
    console.log("Yeah, buttons bitch!");
    articleContainer.empty();
    function reloadPage(){
      location.reload(true);
  }
  reloadPage();
  });


  // Whenever someone clicks a h4 tag
  $(document).on("click", "h2", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the h5 tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
      // With that done, add the note information to the page
      .then(function (data) {
       // console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.name + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data.note._id + "' id='deletenote'>Delete Note</button>");
        //    If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val(),
        }
      })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });


  //  // When you click the deletenote button
  $(document).on("click", "#deletenote", function () {
    //   // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    //   // Run a DELETE request to DELETE the note, using what's entered in the inputs
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
     
      })
      //    With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  });




 


});