$(document).ready(function() {
  console.log('main.js is ready');

  // show ALL data in main block
  $('#show-button').click(function() {
    $.ajax({
      type: 'GET',
      url: '/api/entries',
      success: function(array) {
        // console.log(array);
        var newHTML = $.map(array, function(value) {
          return ('<p>' + value.user + ' ' + value.sum + ' ' + value.date + '</p>');
        });
        $("#data").html(newHTML.join(""));
      },
      error: function(err){
        console.log(err);
      }
    });
  });

});
