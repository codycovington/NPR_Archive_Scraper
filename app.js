// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'><br><strong>" + data[i].title + "</strong><br /><br><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "</a><br /><br>" + data[i].summary + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='user' placeholder='Enter a user name'>");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body' placeholder='Enter a comment'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment' class='btn btn-round-xs btn-success'>Add Comment</button><br>");

      $("#comments").append("<h3>Comments</h3><br>");

      console.log(data.notes);
      for (let i = 0; i < data.notes.length; i++) {
      $("#comments").append("<p><strong>" + data.notes[i].user + "</strong> <i>commented:</i></p> </br>" + "<p>" + data.notes[i].body + "</p>");
      $("#comments").append("<button data-id='" + data.notes[i]._id + "' id='deletecomment' class='btn btn-round-xs btn-danger'>Delete</button>");
      }

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.user);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      user: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      //$("#comments").empty();
      location.reload();
      
    
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When user clicks the delete button for a note
$(document).on("click", "#deletecomment", function() {
  // Save the p tag that encloses the button
  var thisId = $(this).attr("data-id");
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + thisId,

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      thisId.remove();

      location.reload();
    }
  });
});

