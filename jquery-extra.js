jQuery.fn.reverse = function() {
  return this.pushStack(this.get().reverse(), arguments);
};

jQuery.fn.removeClassExcept = function (val) {
    return this.each(function (index, el) {
        var keep = val.split(" "),  // list we'd like to keep
        reAdd = [],          // ones that should be re-added if found
        $el = $(el);       // element we're working on
        // look for which we re-add (based on them already existing)
        for (var c = 0; c < keep.length; c++){
          if ($el.hasClass(keep[c])) reAdd.push(keep[c]);
        }

        // drop all, and only add those confirmed as existing
        $el
          .removeClass()               // remove existing classes
          .addClass(reAdd.join(' '));  // re-add the confirmed ones
    });
};
