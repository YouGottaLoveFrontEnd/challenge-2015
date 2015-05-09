var currentId, currentRow, currentCol, numLeft = 20;
var didStart = false;


$(".square").click(function() {
  if(!didStart){
  currentId = $(this).attr('id'),
    currentRow = currentId.charAt(2),
    currentCol = currentId.charAt(3);
  addToChosen();
  }
});

$(".square").hover(function() {
  if(!didStart){
    $(this).addClass("selected");
  }
},
function() {
  if(!didStart){
    $(this).removeClass("selected");
  }
}
);

$(window).keypress(function(e) {
  if(didStart){
    var key = e.which;
    //right
    if(key == 100){
      currentCol++;
    }
    //left
    else if(key == 97){
      currentCol--;
    }
    //up
    else if(key == 119){
      currentRow--;
    }
    //down
    else if(key == 115){
      currentRow++;
    }
    else{
      return;
    }

    window.setTimeout(addToChosen(), 1000);
  }
});

var addToChosen = function() {
  var squareId = "#sq" + currentRow + currentCol;
  if (didStart && ($(squareId).hasClass("selected"))) {
    $(squareId).addClass("failed");
    youLose();
  }
  else if (didStart && ($(squareId).length == 0)){
    youLose();
  } else {
    didStart = true;
    $(squareId).addClass("selected");
    numLeft--;
  }
  if(numLeft == 0){
    $(squareId).addClass("victory");
    window.setTimeout(youWin, 1000);
  }

}

var youLose = function() {
  alert('you lose :(');
}

var youWin = function() {
  alert('you win! :)');
}
