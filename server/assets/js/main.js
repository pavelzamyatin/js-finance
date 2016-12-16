$(document).ready(function() {
  console.log('main.js is ready');

  // POST FROM new-entry-form
  $('#new-entry-form').validator().on('submit', function(e) {
    var formData = $('form').serializeArray();
    // console.log(formData);
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
        myNotify(`Form is not completed OR you made some mistake!`, 'danger');
      } else {
        // everything looks good!
        $.ajax({
          type: 'POST',
          url: '/api/entries',
          headers: { "X-CSRF-Token": $('input[name="_csrf"]')[0].value },
          dataType: "json",
          data: {
            user      : $('input[name="_userID"]')[0].value,
            date      : formData[2].value,
            sum       : formData[3].value,
            category  : formData[4].value,
            comment   : formData[5].value
          },
          success: function(data) {
            myNotify('New entry posted successfuly!', 'success');
            showALLEntries();
            console.log(data);
          },
          error: function(err) {
            myNotify(`${err.responseText} - ${err.statusText}`, 'danger');
            console.log(err);
          }
        });
        e.preventDefault();
      }
  });

  // =======================================
  // ============== TEST ZONE ==============
  // =======================================

  // SHOW ALL ENTRIES
  var showALLEntries = function() {
    $.ajax({
      type: 'GET',
      url: '/api/entries',
      success: function(data) {
        showTable(data)
      },
      error: function(err){
        myNotify(`${err.responseText} - ${err.statusText}`, 'danger');
        console.log(err);
      }
    });
  };

  // This function helps to show data in the table from the API GET request
  var showTable = function(res) {
    console.log(res);
    var newHTML = $.map(res.ITEMS, function(value) {
      return (`
        <tr>
          <td>${value._id}</td>
          <td>${value.user.toString().slice(-5)}</td>
          <td>${value.sum}</td>
          <td>${value.category}</td>
          <td>${value.date}</td>
          <td>${value.comment}</td>
        </tr>
        `);
    });
    $("#main-table").html(newHTML.join(""));
  };

  // This function helps to help notification using Bootstrap Notify
  var myNotify = function(message, type) {
    $.notify({
      message: message
    }, {
      type: type,
      placement: {
        from: 'bottom'
      }
    });
  };

  // GET all entries
  $('#show-all-button').click(showALLEntries);

  // GET entry by ID
  $('#show-id-button').click(function() {
    $.ajax({
      type: 'GET',
      url: '/api/entry/' + $('#inputId')[0].value,
      success: function(data) {
        showTable(data);
      },
      error: function(err) {
        myNotify(`${err.responseText} - ${err.statusText}`, 'danger');
        console.log(err);
      }
    });
  });

  // DELETE entry by ID
  $('#delete-id-button').click(function() {
    $.ajax({
      type: 'DELETE',
      url: '/api/entry/' + $('#inputId')[0].value,
      success: function(response) {
        myNotify(`Enrtry ID: ${$('#inputId')[0].value} deleted successfuly`, 'warning');
        $('#inputId')[0].value = '';
        showALLEntries();
      },
      error: function(err) {
        myNotify(`${err.responseText} - ${err.statusText}`, 'danger');
        console.log(err);
      }
    });
  });

  // POST NEW ENTRY BUTTON TEST
  $('#post-entry-button').click(function() {

    $.ajax({
      type: 'POST',
      url: '/api/entries',
      headers: { "X-CSRF-Token": $('input[type="hidden"]')[0].value },
      dataType: "json",
      data: {
        user      : $('input[name="_userID"]')[0].value,
        date      : new Date(),
        sum       : 88.88,
        category  : "category string",
        comment   : "POST request from AJAX"
      },
      success: function(data) {
        myNotify('New entry posted successfuly!', 'success');
        showALLEntries();
        console.log(data);
      },
      error: function(err) {
        myNotify(`${err.responseText} - ${err.statusText}`, 'danger');
        console.log(err);
      }
    });
  });

});
