$(document).ready(function() {
  console.log('main.js is ready');

  // =======================================
  // ========== HELP METHODS ZONE ==========
  // =======================================

  // This function helps to use Bootstrap Notify
  var myNotify = function(message, type) {
    $.notify({message}, {type, placement: {from: 'bottom'}});
  };

  // This function helps to show data in the table from the API GET request
  var showTable = function(res) {
    console.log(res);
    var newHTML = '';
    if (res.ITEMS.length == 0) {
        newHTML = [];
        myNotify(`No entries was found. Try another request.`, 'warning');
    } else {
        newHTML = $.map(res.ITEMS, function(value) {
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
    }
    $("#main-table").html(newHTML.join(""));
  };

  // =======================================
  // ============ NEW ENTRY ZONE ===========
  // =======================================

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
  // ========== API REQUESTS ZONE ==========
  // =======================================

  // AJAX GET ALL ENTRIES request
  var showALLEntries = function() {
    $.ajax({
      type: 'GET',
      url: '/api/entries',
      success: function(data) {
        showTable(data)
      },
      error: function(err){
        myNotify(`${err.status} - ${err.statusText}`, 'danger');
        console.log(err);
      }
    });
  };

  // =======================================
  // ============= MAIN ZONE ===============
  // =======================================

  // SHOW ALL ENTRIES BUTTON
  $('#show-all-button').click(function() {

    var filter = null;
    if ($('#category-selector')[0].value != 'All entries') {
      filter = $('#category-selector')[0].value;
    }

    $.ajax({
      type  : 'GET',
      url   : '/api/entries/',
      data  : { category: filter },
      success: function(data) {
        showTable(data);
      },
      error: function(err) {
        myNotify(`${err.status} - ${err.statusText}`, 'danger');
        console.log(err);
      }
    });
  });

  //
  $('#category-reset-button').click(function() {
    $('#category-selector')[0].value = 'All entries';
    showALLEntries();
  });

  // GET entry by ID
  $('#show-id-button').click(function() {
    $.ajax({
      type: 'GET',
      url: '/api/entry/' + $('#inputId')[0].value,
      success: function(data) {
        showTable(data);
      },
      error: function(err) {
        myNotify(`${err.status} - ${err.statusText}`, 'danger');
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
        myNotify(`${err.status} - ${err.statusText}`, 'danger');
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
        category  : "Home",
        comment   : "POST request from AJAX"
      },
      success: function(data) {
        myNotify('New entry posted successfuly!', 'success');
        showALLEntries();
        console.log(data);
      },
      error: function(err) {
        myNotify(`${err.status} - ${err.statusText}`, 'danger');
        console.log(err);
      }
    });
  });

});
