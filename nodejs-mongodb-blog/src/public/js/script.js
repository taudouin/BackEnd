/* Configuration Bootstrap Tooltip BEGIN */

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

/* Configuration Bootstrap Tooltip END */

// const editCommentBtn = document.querySelector('.editCommentBtn');
// const modifyCommentBtn = document.querySelector('.modifyCommentBtn');
// const textareaCommentEdit = document.querySelector('.textareaCommentEdit');

// editCommentBtn.addEventListener('click', () => {
//   textareaCommentEdit.removeAttribute('readonly');
//   modifyCommentBtn.removeAttribute('hidden');
// });

/* Scroll to top when arrow up clicked BEGIN */

$(window).scroll(function() {
    let height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function() {
    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
});

/* Scroll to top when arrow up clicked END */

/* Close the alert message BEGIN */
setTimeout(function () {
    $('.alert').alert('close');
}, 4000);
/* Close the alert message END */

/* Show/hide password BEGIN */

// Signup => password
$(document).ready(function() {
  $("#show_hide_password_signup a").on('click', function(event) {
      event.preventDefault();
      if($('#show_hide_password_signup input').attr("type") == "text"){
          $('#show_hide_password_signup input').attr('type', 'password');
          $('#show_hide_password_signup i').addClass( "fa-eye-slash" );
          $('#show_hide_password_signup i').removeClass( "fa-eye" );
      }else if($('#show_hide_password_signup input').attr("type") == "password"){
          $('#show_hide_password_signup input').attr('type', 'text');
          $('#show_hide_password_signup i').removeClass( "fa-eye-slash" );
          $('#show_hide_password_signup i').addClass( "fa-eye" );
      }
  });
});

// Signup => confirm password
$(document).ready(function() {
  $("#show_hide_confirm_password_signup a").on('click', function(event) {
      event.preventDefault();
      if($('#show_hide_confirm_password_signup input').attr("type") == "text"){
          $('#show_hide_confirm_password_signup input').attr('type', 'password');
          $('#show_hide_confirm_password_signup i').addClass( "fa-eye-slash" );
          $('#show_hide_confirm_password_signup i').removeClass( "fa-eye" );
      }else if($('#show_hide_confirm_password_signup input').attr("type") == "password"){
          $('#show_hide_confirm_password_signup input').attr('type', 'text');
          $('#show_hide_confirm_password_signup i').removeClass( "fa-eye-slash" );
          $('#show_hide_confirm_password_signup i').addClass( "fa-eye" );
      }
  });
});

// Signin => password
$(document).ready(function() {
  $("#show_hide_password_signin a").on('click', function(event) {
      event.preventDefault();
      if($('#show_hide_password_signin input').attr("type") == "text"){
          $('#show_hide_password_signin input').attr('type', 'password');
          $('#show_hide_password_signin i').addClass( "fa-eye-slash" );
          $('#show_hide_password_signin i').removeClass( "fa-eye" );
      }else if($('#show_hide_password_signin input').attr("type") == "password"){
          $('#show_hide_password_signin input').attr('type', 'text');
          $('#show_hide_password_signin i').removeClass( "fa-eye-slash" );
          $('#show_hide_password_signin i').addClass( "fa-eye" );
      }
  });
});
// Change => actual password
$(document).ready(function() {
  $("#show_hide_password_actual_password a").on('click', function(event) {
      event.preventDefault();
      if($('#show_hide_password_actual_password input').attr("type") == "text"){
          $('#show_hide_password_actual_password input').attr('type', 'password');
          $('#show_hide_password_actual_password i').addClass( "fa-eye-slash" );
          $('#show_hide_password_actual_password i').removeClass( "fa-eye" );
      }else if($('#show_hide_password_actual_password input').attr("type") == "password"){
          $('#show_hide_password_actual_password input').attr('type', 'text');
          $('#show_hide_password_actual_password i').removeClass( "fa-eye-slash" );
          $('#show_hide_password_actual_password i').addClass( "fa-eye" );
      }
  });
});

// Change => new password
$(document).ready(function() {
  $("#show_hide_password_new_password a").on('click', function(event) {
      event.preventDefault();
      if($('#show_hide_password_new_password input').attr("type") == "text"){
          $('#show_hide_password_new_password input').attr('type', 'password');
          $('#show_hide_password_new_password i').addClass( "fa-eye-slash" );
          $('#show_hide_password_new_password i').removeClass( "fa-eye" );
      }else if($('#show_hide_password_new_password input').attr("type") == "password"){
          $('#show_hide_password_new_password input').attr('type', 'text');
          $('#show_hide_password_new_password i').removeClass( "fa-eye-slash" );
          $('#show_hide_password_new_password i').addClass( "fa-eye" );
      }
  });
});

// Change => confirm new password
$(document).ready(function() {
  $("#show_hide_password_confirm_new_password a").on('click', function(event) {
      event.preventDefault();
      if($('#show_hide_password_confirm_new_password input').attr("type") == "text"){
          $('#show_hide_password_confirm_new_password input').attr('type', 'password');
          $('#show_hide_password_confirm_new_password i').addClass( "fa-eye-slash" );
          $('#show_hide_password_confirm_new_password i').removeClass( "fa-eye" );
      }else if($('#show_hide_password_confirm_new_password input').attr("type") == "password"){
          $('#show_hide_password_confirm_new_password input').attr('type', 'text');
          $('#show_hide_password_confirm_new_password i').removeClass( "fa-eye-slash" );
          $('#show_hide_password_confirm_new_password i').addClass( "fa-eye" );
      }
  });
});

/* Show/hide password END */

/* Order tables BEGIN */

const compare = function(ids, asc){
    return function(row1, row2){
      const tdValue = function(row, ids){
        return row.children[ids].textContent;
      }
      const tri = function(v1, v2){
        if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)){
          return v1 - v2;
        }
        else {
          return v1.toString().localeCompare(v2);
        }
        return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
      };
      return tri(tdValue(asc ? row1 : row2, ids), tdValue(asc ? row2 : row1, ids));
    }
  }

  const tbody = document.querySelector('tbody');
  const thx = document.querySelectorAll('th');
  if (tbody) {
    const trxb = tbody.querySelectorAll('tr');
    thx.forEach(function(th){
      th.addEventListener('click', function(){
        let tableRow = Array.from(trxb).sort(compare(Array.from(thx).indexOf(th), this.asc = !this.asc));
        tableRow.forEach(function(tr){
          tbody.appendChild(tr)
        });
      })
    });
  }
  

  /* Order tables END */