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
            return `
            <a href="" class="list-group-item entries-list animated fadeInUp" id="${value._id}">
                <div class="list-group-item-text">
                    <div class="row">
                        <div class="col-md-2">
                            <p class="list-group-item-text">
                                <span class="entry-sum">${value.sum}</span>
                                <span class="entry-currency">NZ</span>
                        </div>
                        <div class="col-md-10">
                            <p class="list-group-item-text">
                                <p class="text-muted">DATE: ${moment(value.date).format('L')}
                                <span class="label label-info entry-category-label">${value.category}</span></p>
                            </p>
                            <p class="list-group-item-text">${value.comment}</p>
                        </div>
                    </div>
                </div>
            </a>
            `;
        });
    }
    $("#main-table").html(newHTML.join(""));
  };

  // =======================================
  // ============ NEW ENTRY ZONE ===========
  // =======================================

  $('#main-form').validator().on('submit', function(e) {
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
  // ============= BUTTONS =================
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

  // RESET CATEGODY BUTTON
  $('#category-reset-button').click(function() {
      $('#category-selector')[0].value = 'All entries';
      showALLEntries();
  });

  // COPY ELEMENT ID TO THE EDIT FORM
  $(document).on('click', '.entries-list', function() {
      $('#inputId')[0].value = $(this)[0].id;
      return false;
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
              sum       : 20.1,
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

  // =======================================
  // ============= UPLOAD CSV ==============
  // =======================================

  // Parse CSV using papaparse.min.js   
  $('#upload-input').on('change', function() {
        $('#upload-input').parse({
            config: {
                header: false,
                delimiter: ',',
                complete: function(results, file) {
                    console.log("This file done:", file, results.data);
                }
            },
            complete: function() {
                console.log("All files done!");
            }
        });
    });

    $('.upload-btn').on('click', function (){ 
        $('#upload-input').click();
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');
    });

});
