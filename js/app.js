"use strict";

(function($, window, undefined) {

	  /********************************/
	 /*          Caching             */
	/********************************/

	var currentClass = '.logoCurrentPos',
	 	switchedClass = 'tile-switched',
		secretClass = '.secret',
		secretRevealClass = 'secret--reveal',
		mainRowClass = '.mainrow',
		mainContainerId = '#mainLogoGameContainer',
	  oldHTML = $(mainRowClass).html(),
		secretOldHTML = $(secretClass).html();

	  /********************************/
	 /*          Constants           */
	/********************************/

	var KEYS = {
		38: 'up',
		40: 'down',
		37: 'left',
		39: 'right'
	};


	/* You */
	/*.tile__pos1, .tile__pos2, .tile__pos3
	/* Gotta */
	/*.tile__pos6, .tile__pos7, .tile__pos8, .tile__pos9, .tile__pos10
	/* Love */
	// .tile__pos11, .tile__pos12, .tile__pos14, .tile__pos15
	/* Front */
	/*.tile__pos16, .tile__pos17, .tile__pos18, .tile__pos19, .tile__pos20
	/* end */
	/*.tile__pos23, .tile__pos24, .tile__pos25  */

	var VALUES_EXPECTED = {
		1: "y",
		2: "o",
		3: "u",
		6: "g",
		7: "o",
		8: "t",
		9: "t",
		10: "a",
		11: "l",
		12: "o",
		14: "v",
		15: "e",
		16: "f",
		17: "r",
		18: "o",
		19: "n",
		20: "t",
		23: "e",
		24: "n",
		25: "d"
	}


	  /********************************/
	 /*      Helper Functions        */
	/********************************/

	function getUp() {
		var current = $(currentClass);
		var index = current.index();
		var parentIndex = current.parent().index();
		return current.parents(mainContainerId).children().children(':nth-child('+parentIndex+')').children().eq(index).attr('class') || false;
	}

	function getDown() {
		var current = $(currentClass);
		var index = current.index();
		var parentIndex = current.parent().index();
		return current.parents(mainContainerId).children().children().eq(parentIndex+1).children().eq(index).attr('class') || false;
	}

	function getRight() {
		return $(currentClass).next().attr('class') || false;
	}

	function getLeft() {
		return $(currentClass).prev().attr('class') || false;
	}

	function switchWith(elClass) {
		var current = $(currentClass);
		var currentHTML = current.eq(1).html();
		var els = $("[class='"+elClass+"']");
		if (els.length > 1) {
			if (!els.eq(1).hasClass(switchedClass)) {
				current.addClass(switchedClass);
				current.removeClass(currentClass.slice(1));
				$.each(els,function(i,val) {
					var $this = $(this);
					var elHTML = $this.html();
					if (i == 1 ) {
						current.eq(1).html(elHTML);
						$this.html(currentHTML);
					}
					$this.addClass(currentClass.slice(1));
				})
			}
		} else {
			var elHTML = els.html();
			if (!els.hasClass(switchedClass)) {
				// switch html
				current.addClass(switchedClass).removeClass(currentClass.slice(1)).html(elHTML);
				els.html(currentHTML).addClass(currentClass.slice(1));
			}
		}

		if (checkSuccess()) {
			$(secretClass).addClass(secretRevealClass).html('Secret Revealed!<br> YGLF &#9829;');
		}
	}

	function checkSuccess() {
		var length_expected = 0;
		var arr = $.map(VALUES_EXPECTED, function(value, key) {
			length_expected++;
			return $('.tile__pos'+key).eq(1).html() == value;
		});
		return $.grep(arr, function(item, index) {return item == true}).length == length_expected;
	}

	  /********************************/
	 /*          Window Ready        */
	/********************************/

	$(function() {
		// reset scrolling if the page was scrolled unintentionally
		$(window).scrollTop(0);

		  /********************************/
		 /*       Event Listeners        */
		/********************************/

		$('#resetButton').on('click', function() {
			$(mainRowClass).html(oldHTML);
			$(secretClass).removeClass(secretRevealClass).html(secretOldHTML);
		});

		$(window).on('keydown', function(e) {
			var key = KEYS[e.keyCode];
			if (typeof key == "string") {
				e.preventDefault();
				switch (key) {
					case "down":
						var getDownVal = getDown();
						if (getDownVal) {
							switchWith(getDownVal);
						}
						break;
					case "up":
						var getUpVal = getUp();
						if (getUpVal) {
							switchWith(getUpVal);
						}
						break;
					case "left":
						var getLeftVal = getLeft();
						if (getLeftVal) {
							switchWith(getLeftVal);
						}
						break;
					case "right":
						var getRightVal = getRight();
						if (getRightVal) {
							switchWith(getRightVal);
						}
						break;
					default:
						throw new Error('not a valid key!');
				}
			}
		});// end of on keydown

	});// end of window ready

})(jQuery, window);

/*

6  7  2  3  4
11 12 13 8  5
16 17 __ 9  10
21 18 19 14 15
22 23 24 25 20

6,7,2 => you
11,12,13,8,5 => gotta
16,17,9,10 => love
21,18,19,14,15 => front
24,25,20 => end

*/
