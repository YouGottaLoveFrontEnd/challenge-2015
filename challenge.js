var previousId, currentId, currentRow, currentCol, numLeft = 20;
var didStart = false,
  didEnd = false;

//.addClass("current");

$(".square").click(function() {
  if (!didStart) {
    currentId = $(this).attr('id'),
      currentRow = currentId.charAt(2),
      currentCol = currentId.charAt(3);
    previousId = currentId;
    addToChosen();
  }
});

$(".square").hover(function() {
    if (!didStart) {
      $(this).addClass("selected");
    }
  },
  function() {
    if (!didStart) {
      $(this).removeClass("selected");
    }
  }
);

$(window).keypress(function(e) {
  if (didStart) {
    var code = e.charCode || e.keyCode;
    var key = String.fromCharCode(code);
    //alert(key);
    //right
    if (key == 's') {
      currentRow++;
    }
    //left
    else if (key == 'w') {
      currentRow--;
    }
    //up
    else if (key == 'a') {
      currentCol--;
    }
    //down
    else if (key == 'd') {
      currentCol++;
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
  currentId = "#sq" + currentRow + currentCol;
  if (didStart && ($(currentId).hasClass("selected"))) {
    didEnd = true;
    $(previousId).removeClass("current");
    $(currentId).addClass("failed");
    window.setTimeout(youLose, 1000);
  } else if (didStart && ($(currentId).length == 0)) {
    didEnd = true;
    window.setTimeout(youLose, 1000);
  } else {
    didStart = true;
    $(previousId).removeClass("current");
    $(currentId).addClass("selected").addClass("current");
    numLeft--;
  }
  if (numLeft == 0) {
    didEnd = true;
    $(currentId).addClass("victory");
    window.setTimeout(youWin, 1000);
  }

}

var youLose = function() {
  alert('you lose :(');
}

var youWin = function() {
  alert('you win! :)');
}
