var Spark = function () {

	var elem = document.createElement('div');
	var style = elem.style;
	var parent;

	function set () {
		style.display = 'none';
		elem.className = 'fire-spark';
		style.opacity = Math.random();
		style.width = style.height = Math.floor(Math.random() * 10) + 'px';
		style.top = (parent.height() -8)+'px';
		style.left = Math.floor(Math.random() * parent.width()) + 'px';
		style.display = 'block';
	}

	function move() {
		style = elem.style;
		var dir = Math.floor(Math.random() * 3) -1;
		style.left = ((Math.floor(Math.random() * 150)) * dir) + parseInt(style.left) + 'px';
		style.opacity = Math.random();
		style.top = parseInt(style.top) - Math.floor(Math.random() * 150) + 'px';
		style.WebkitTransform = 'skew('+Math.floor(Math.random() * 30)+'deg)';

		if(parseInt(style.top) <= 0) {
			set();
		}
		setTimeout(move, 1000);
	}

	function add(_parent) {
		parent = $(_parent);
		set();
		parent.append(elem);
		move();
	};

	return {
		add: add
	};
};