$(document).ready(function() {
  console.log('main.js is ready');

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

  // =======================================
  // ============== TEST ZONE ==============
  // =======================================

  // This function helps to show data in the table from the API GET request
  var showTable = function(res) {
    console.log(res);
    var newHTML = $.map(res.ITEMS, function(value) {
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
  };

  // GET all entries
  $('#show-all-button').click(function() {
    $.ajax({
      type: 'GET',
      url: '/api/entries',
      success: function(response) { showTable(response) },
      error: function(err){
        console.log(err);
      }
    });
  });

  // GET entry by ID
  $('#show-id-button').click(function() {
    $.ajax({
      type: 'GET',
      url: '/api/entry/' + $('#inputId')[0].value,
      success: function(response) { showTable(response) },
      error: function(err){
        console.log(err);
      }
    });
  });

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
        comment   : "POST request from AJAX"
      },
      success: function(data) {
        console.log(data);
      },
      error: function(err){
        console.log(err);
      }
    });
  });

});
