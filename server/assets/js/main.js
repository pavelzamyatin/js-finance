$(document).ready(function() {
  console.log('main.js is ready');

  // GET ALL data in main block
  $('#show-all-button').click(function() {
    $.ajax({
      type: 'GET',
      url: '/api/entries',
      success: function(array) {
        console.log(array);
        var newHTML = $.map(array, function(value) {
          return (`
            <tr>
              <td>${value._id}</td>
              <td>${value.user}</td>
              <td>${value.sum}</td>
              <td>${value.category}</td>
              <td>${value.date}</td>
              <td>${value.comment}</td>
            </tr>
            `);
        });
        $("#main-table").html(newHTML.join(""));
      },
      error: function(err){
        console.log(err);
      }
    });
  });

  // POST FROM form
  $('form').on('submit', function(e) {
    var formData = $('form').serializeArray();
    // console.log(formData);

    $.ajax({
      type: 'POST',
      url: '/api/entries',
      dataType: "json",
      data: {
        user      : 'form',
        date      : formData[0].value,
        sum       : formData[1].value,
        category  : formData[2].value,
        comment   : formData[3].value
      },
      success: function(data) {
        console.log(data);
      },
      error: function(err){
        alert(err);
      }
    });
    e.preventDefault();
    return false;
  })

  // POST NEW ENTRY BUTTON TEST
  $('#post-entry-button').click(function() {

    $.ajax({
      type: 'POST',
      url: '/api/entries',
      dataType: "json",
      data: {
        user      : "ajax",
        date      : new Date(),
        sum       : 88.88,
        category  : "category string",
        comment   : "Post request from ajax"
      },
      success: function(data) {
        console.log(data);
      },
      error: function(err){
        alert(err);
      }
    });
  });

});
