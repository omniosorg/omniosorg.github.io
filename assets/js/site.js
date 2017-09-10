jQuery(function() {
    var $menubutton = $('.menu-button');
    $menubutton.sideNav({
            menuWidth: 270, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function(el) {
                $menubutton.addClass('is-active');
            }, // A function to be called when sideNav is opened
            onClose: function(el) {
                $menubutton.removeClass('is-active');
            } // A function to be called when sideNav is closed
    });
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );
  $('select').material_select();  
});
