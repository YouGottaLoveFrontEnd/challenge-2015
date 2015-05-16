(function ( window, document, $, undefined ) {
	
	function init() {
		setTimeout( function () {
			$('.word').has('.heart').addClass( 'pulse' );
		}, 1100);
	}

	$( document ).ready( init );
})( window, document, jQuery );