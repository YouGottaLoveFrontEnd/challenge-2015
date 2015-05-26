'use strict';

$(document).ready(function() {

  var previousId, currentId, currentRow, currentCol, numLeft = 20,
    fadeOutIndex = 0;
  var didStart = false,
    didEnd = false,
    canRestart = true;

  $('.row-lost').children().hide();
  $('.row-won').children().hide();

  //.addClass('current');

  $('.square').click(function() {
    if (!didStart) {
      currentId = $(this).attr('id');
      currentRow = currentId.charAt(2);
      currentCol = currentId.charAt(3);
      previousId = currentId;
      addToChosen();
    }
  });

  $('.square').hover(function() {
      if (!didStart) {
        $(this).addClass('selected');
      }
    },
    function() {
      if (!didStart) {
        $(this).removeClass('selected');
      }
    }
  );

  $(window).keydown(function(e) {
    if (didStart) {
      var key = e.keyCode;
      //right
      if (key == 39) {
        currentCol++;
      }
      //left
      else if (key == 37) {
        currentCol--;
      }
      //up
      else if (key == 38) {
        currentRow--;
      }
      //down
      else if (key == 40) {
        currentRow++;
      } else {
        return;
      }
      if (!didEnd) {
        window.setTimeout(addToChosen(), 1000);
      }
    }
  });

  var addToChosen = function() {
    previousId = currentId;
    currentId = '#sq' + currentRow + currentCol;
    if (didStart && ($(currentId).hasClass('selected'))) {
      didEnd = true;
      $(previousId).removeClass('current');
      $(currentId).addClass('failed');
      window.setTimeout(youLose, 1000);
    } else if (didStart && ($(currentId).length === 0)) {
      didEnd = true;
      window.setTimeout(youLose, 1000);
    } else {
      didStart = true;
      $(previousId).removeClass('current');
      $(currentId).addClass('selected').addClass('current');
      numLeft--;
    }
    if (numLeft === 0) {
      didEnd = true;
      $(currentId).addClass('victory');
      window.setTimeout(youWin, 1000);
    }
  }

  var youLose = function() {
    canRestart = false;
    $('.logo-background').fadeOut();
    fadeOutElements('.row3');
    fadeOutElements('.row2');
    fadeOutElements('.row1');
    fadeInElements('.row-lost');
    window.setTimeout(allowRestart, 3600);
  };

  var youWin = function() {
    canRestart = false;
    $('.logo-lose').fadeOut();
    $('.logo-background').fadeOut();
    fadeOutElements('.row3');
    fadeOutElements('.row2');
    fadeOutElements('.row1');
    fadeInElements('.row-won');
    window.setTimeout(allowRestart, 3600);
  }

  var fadeOutElements = function(specificClass) {
    $(specificClass).children().reverse().each(function() {
      $(this).delay(100 * fadeOutIndex).fadeOut(100);
      fadeOutIndex++;
    });
  }


  var fadeInElements = function(specificClass) {
    $(specificClass).children().each(function() {
      $(this).delay(100 * fadeOutIndex).fadeIn(100);
      fadeOutIndex++;
    });
  }

  var allowRestart = function() {
    canRestart = true;
  }

  var restart = function() {

    if (canRestart === true) {
      numLeft = 20, fadeOutIndex = 0, didStart = false, didEnd = false;
      $('.row-lost').children().hide();
      $('.row-won').children().hide();
      $('.row1').children().show();
      $('.row2').children().show();
      $('.row3').children().show();
      $('.logo-lose').fadeIn();
      $('.logo-background').fadeIn();
      $('.square').removeClassExcept('square');
      $('.row-won').children().addClass('selected');
    }
  }

  $('.restart').click(function() {
    restart();
  });
});
