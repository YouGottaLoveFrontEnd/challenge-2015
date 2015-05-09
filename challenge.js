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
    var key = e.which;
    //right
    if (key == 100) {
      currentCol++;
    }
    //left
    else if (key == 97) {
      currentCol--;
    }
    //up
    else if (key == 119) {
      currentRow--;
    }
    //down
    else if (key == 115) {
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
  currentId = "#sq" + currentRow + currentCol;
  if (didStart && ($(currentId).hasClass("selected"))) {
    $(previousId).removeClass("current");
    $(currentId).addClass("failed");
    youLose();
  } else if (didStart && ($(currentId).length == 0)) {
    didEnd = true;
    youLose();
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
  didEnd = true;
  alert('you lose :(');
}

var youWin = function() {
  didEnd = true;
  alert('you win! :)');
}
