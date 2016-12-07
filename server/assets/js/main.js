$(document).ready(function() {
  console.log('main.js is ready');

  // show ALL data in main block
  $('#show-all').click(function() {
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

  // POST NEW ENTRY
  $('#post').click(function() {
    var arr = JSON.stringify(['fuck', 'you', 'bitch']);

    $.ajax({
      type: 'POST',
      url: '/api/entries',
      dataType: "json",
      data: {
        user      : "ajax",
        date      : new Date(),
        sum       : 88.88,
        category  : arr,
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
