;(function(window) {

	// Parallax slider
	skrollr.init({
		forceHeight: false,
		smoothScrolling: false
	});

	// Real shadow
	realshadow(document.getElementsByTagName('h1'), {type: 'text', color: '100,100,100', length: 6});
	realshadow(document.getElementsByClassName('item-pen'), {type: 'drop', color: '0,0,0', length: 7, inverse: true});
	realshadow(document.getElementsByClassName('item-brush-white'), {type: 'drop', color: '100,100,100', length: 7, inverse: true});
	realshadow(document.getElementsByClassName('item-mouse'), {type: 'drop', color: '50,50,50', length: 7, inverse: true});
	realshadow(document.getElementsByClassName('item-css'), {type: 'drop', length: 4});
	realshadow(document.getElementsByClassName('item-html'), {type: 'drop', length: 3});
	realshadow(document.getElementsByClassName('item-js'), {type: 'drop', length: 4});
	realshadow(document.getElementsByClassName('item-drupal'), {type: 'drop', length: 6});
	realshadow(document.getElementsByClassName('logo'), {type: 'drop', length: 3});
	realshadow(document.getElementsByClassName('credit-box'), {type: 'drop', length: 3});

	// Blur background Effect on mouse movemenet
	var $blur_layer, $image_layer, blur_fade, blur_throttle, center_x, center_y, fade_length, max_blur, max_x, max_y, max_z, min_opacity, mouse_move_handler, perspective, transform, win_h, win_w;
	transform = function(element, transform) {
		element.style.webkitTransform = transform;
		return element.style.transform = transform;
	};
	blur_fade = function(element, blur, fade) {
		return element.setAttribute('style', '-webkit-filter: blur(' + blur + '); filter: blur(' + blur + '); opacity: ' + fade + ';');
	};
	win_w = window.innerWidth;
	win_h = window.innerHeight;
	center_x = win_w / 2;
	center_y = win_h / 2;
	max_x = win_w * 0.04;
	max_y = win_h * 0.04;
	max_z = 30;
	perspective = 1200;
	max_blur = 300;
	min_opacity = 0.75;
	blur_throttle = 8;
	fade_length = 1 - min_opacity;
	$image_layer = document.getElementById('background-image-layer');
	$blur_layer = document.getElementById('scene-blur-layer');

	mouse_move_handler = function(mouse_x, mouse_y, ratio_x, ratio_y) {
		var blur_px, fade_i, transform_val;
		transform_val = 'perspective(' + perspective + ') translate3d(' + (max_x * ratio_x) + 'px, ' + (max_y * ratio_y) + 'px, ' + (max_x * ratio_x) + 'px)';
		transform($image_layer, transform_val);
		blur_px = (Math.abs(mouse_x - center_x) / center_x * blur_throttle) + 'px';
		fade_i = 1 - (fade_length * (Math.abs(mouse_x - center_x) / center_x));
		return blur_fade($blur_layer, blur_px, fade_i);
	};

	document.addEventListener('mousemove', (function(event) {
		var mouse_x, mouse_y, ratio_x, ratio_y;
		if (window.event) {
			event = window.event;
		}
		mouse_x = event.clientX;
		mouse_y = event.clientY;
		ratio_x = 1 - (mouse_x / center_x);
		ratio_y = 1 - (mouse_y / center_y);
		mouse_move_handler(mouse_x, mouse_y, ratio_x, ratio_y);
	}), false);


	// Tilt background Effect on mouse movemenet
	// from https://gist.github.com/desandro/1866474
	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	// get unprefixed rAF and cAF, if present
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	// loop through vendor prefixes and get prefixed rAF and cAF
	var prefix;
	for( var i = 0; i < prefixes.length; i++ ) {
		if ( requestAnimationFrame && cancelAnimationFrame ) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
		cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
		window[ prefix + 'CancelRequestAnimationFrame' ];
	}

	// fallback to setTimeout and clearTimeout if either request/cancel is not supported
	if ( !requestAnimationFrame || !cancelAnimationFrame ) {
		requestAnimationFrame = function( callback, element ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() {
				callback( currTime + timeToCall );
			}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function( id ) {
			window.clearTimeout( id );
		};
	}

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// from http://www.quirksmode.org/js/events_properties.html#position
	function getMousePos(e) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
		}
		return {
			x : posx,
			y : posy
		}
	}

	// from http://www.sberry.me/articles/javascript-event-throttling-debouncing
	function throttle(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	}

	/***************************************************************************/

	/**
	 * TiltFx fn
	 */
	function TiltFx(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
		this._initEvents();
	}

	/**
	 * TiltFx options.
	 */
	TiltFx.prototype.options = {
		// number of extra image elements (div with background-image) to add to the DOM - min:1, max:5 (for a higher number, it's recommended to remove the transitions of .tilt__front in the stylesheet.
		extraImgs : 2,
		// the opacity value for all the image elements.
		opacity : 0.7,
		// by default the first layer does not move.
		bgfixed : true,
		// image element's movement configuration
		movement : {
			perspective : 1000, // perspective value
			translateX : -10, // a relative movement of -10px to 10px on the x-axis (setting a negative value reverses the direction)
			translateY : -10, // a relative movement of -10px to 10px on the y-axis
			translateZ : 20, // a relative movement of -20px to 20px on the z-axis (perspective value must be set). Also, this specific translation is done when the mouse moves vertically.
			rotateX : 2, // a relative rotation of -2deg to 2deg on the x-axis (perspective value must be set)
			rotateY : 2, // a relative rotation of -2deg to 2deg on the y-axis (perspective value must be set)
			rotateZ : 0 // z-axis rotation; by default there's no rotation on the z-axis (perspective value must be set)
		}
	}

	/**
	 * Initialize: build the necessary structure for the image elements and replace it with the HTML img element.
	 */
	TiltFx.prototype._init = function() {
		this.tiltWrapper = document.createElement('div');
		this.tiltWrapper.className = 'tilt';

		// main image element.
		this.tiltImgBack = document.createElement('div');
		this.tiltImgBack.className = 'tilt__back';
		this.tiltImgBack.style.backgroundImage = 'url(' + this.el.src + ')';
		this.tiltWrapper.appendChild(this.tiltImgBack);

		// image elements limit.
		if( this.options.extraImgs < 1 ) {
			this.options.extraImgs = 1;
		}
		else if( this.options.extraImgs > 5 ) {
			this.options.extraImgs = 5;
		}

		if( !this.options.movement.perspective ) {
			this.options.movement.perspective = 0;
		}

		// add the extra image elements.
		this.imgElems = [];
		for(var i = 0; i < this.options.extraImgs; ++i) {
			var el = document.createElement('div');
			el.className = 'tilt__front';
			el.style.backgroundImage = 'url(' + this.el.src + ')';
			el.style.opacity = this.options.opacity;
			this.tiltWrapper.appendChild(el);
			this.imgElems.push(el);
		}

		if( !this.options.bgfixed ) {
			this.imgElems.push(this.tiltImgBack);
			++this.options.extraImgs;
		}

		// add it to the DOM and remove original img element.
		this.el.parentNode.insertBefore(this.tiltWrapper, this.el);
		this.el.parentNode.removeChild(this.el);

		// tiltWrapper properties: width/height/left/top
		this.view = { width : this.tiltWrapper.offsetWidth, height : this.tiltWrapper.offsetHeight };
	};

	/**
	 * Initialize the events on the main wrapper.
	 */
	TiltFx.prototype._initEvents = function() {
		var self = this,
			moveOpts = self.options.movement;

		// mousemove event..
		this.tiltWrapper.addEventListener('mousemove', function(ev) {
			requestAnimationFrame(function() {
				// mouse position relative to the document.
				var mousepos = getMousePos(ev),
				// document scrolls.
					docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop},
					bounds = self.tiltWrapper.getBoundingClientRect(),
				// mouse position relative to the main element (tiltWrapper).
					relmousepos = {
						x : mousepos.x - bounds.left - docScrolls.left,
						y : mousepos.y - bounds.top - docScrolls.top
					};

				// configure the movement for each image element.
				for(var i = 0, len = self.imgElems.length; i < len; ++i) {
					var el = self.imgElems[i],
						rotX = moveOpts.rotateX ? 2 * ((i+1)*moveOpts.rotateX/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.rotateX/self.options.extraImgs) : 0,
						rotY = moveOpts.rotateY ? 2 * ((i+1)*moveOpts.rotateY/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.rotateY/self.options.extraImgs) : 0,
						rotZ = moveOpts.rotateZ ? 2 * ((i+1)*moveOpts.rotateZ/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.rotateZ/self.options.extraImgs) : 0,
						transX = moveOpts.translateX ? 2 * ((i+1)*moveOpts.translateX/self.options.extraImgs) / self.view.width * relmousepos.x - ((i+1)*moveOpts.translateX/self.options.extraImgs) : 0,
						transY = moveOpts.translateY ? 2 * ((i+1)*moveOpts.translateY/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.translateY/self.options.extraImgs) : 0,
						transZ = moveOpts.translateZ ? 2 * ((i+1)*moveOpts.translateZ/self.options.extraImgs) / self.view.height * relmousepos.y - ((i+1)*moveOpts.translateZ/self.options.extraImgs) : 0;

					el.style.WebkitTransform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
					el.style.transform = 'perspective(' + moveOpts.perspective + 'px) translate3d(' + transX + 'px,' + transY + 'px,' + transZ + 'px) rotate3d(1,0,0,' + rotX + 'deg) rotate3d(0,1,0,' + rotY + 'deg) rotate3d(0,0,1,' + rotZ + 'deg)';
				}
			});
		});

		// reset all when mouse leaves the main wrapper.
		this.tiltWrapper.addEventListener('mouseleave', function(ev) {
			setTimeout(function() {
				for(var i = 0, len = self.imgElems.length; i < len; ++i) {
					var el = self.imgElems[i];
					el.style.WebkitTransform = 'perspective(' + moveOpts.perspective + 'px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
					el.style.transform = 'perspective(' + moveOpts.perspective + 'px) translate3d(0,0,0) rotate3d(1,1,1,0deg)';
				}
			}, 60);

		});

		// window resize
		window.addEventListener('resize', throttle(function(ev) {
			// recalculate tiltWrapper properties: width/height/left/top
			self.view = { width : self.tiltWrapper.offsetWidth, height : self.tiltWrapper.offsetHeight };
		}, 50));
	};

	function init() {
		// search for imgs with the class "tilt-effect"
		[].slice.call(document.querySelectorAll('img.tilt-effect')).forEach(function(img) {
			new TiltFx(img, JSON.parse(img.getAttribute('data-tilt-options')));
		});
	}

	init();

	window.TiltFx = TiltFx;

})(window);