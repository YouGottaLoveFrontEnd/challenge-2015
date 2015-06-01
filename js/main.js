$(document).ready(function() {

    init();





});

var init = function() {
    var toggleLinks = new ToggleLinks();
    toggleLinks.autoPlay();
};


var ToggleLinks = function() {
    var links = $('a.link');

    function toggle() {
        $.each(links, function(index, val) {
            var delay = index * 300;
            setTimeout(function() {
                $(val).toggleClass('active');
            }, delay);
        });
    }

    $('#toggle-sequence').click(function(event) {
        event.preventDefault();
        toggle();
    });

    function autoPlay() {
        setTimeout(function() {
            toggle(); 
        }, 1000);
        setTimeout(function() {
            toggle(); 
        }, 3500);        
    }

    return {
        toggle: toggle,
        autoPlay: autoPlay
    }

};
