var ChasingItem = function () {

	var item, parent;
	var isout = false;
	var resetTimer;
	function watchOut() {
		isout = false;
		clearTimeout(resetTimer);
		item.style.top = (Math.random() * 200) - item.offsetHeight + 'px';
		item.style.left = (Math.random() * 200) - item.offsetWidth + 'px';

		setTimeout (function () {
			if(!isout) {
				watchOut();
			}
		},100);
	}

	function mouseOut () {
		isout = true;
		resetTimer = setTimeout(resetItem, 1000);
	}

	function resetItem () {
		item.style.left = item.style.top = '0px';
	}

	function capture (_item, _parent) {
		item = document.getElementById(_item);
		parent = document.getElementById(_parent);
		var style = item.style;
		style.zIndex = 999 * 999;
		item.addEventListener('mouseover', watchOut);
		item.addEventListener('mouseout', mouseOut);
		// parent.addEventListener('mouseout', resetItem);
	}

	return {
		capture :capture
	}
}