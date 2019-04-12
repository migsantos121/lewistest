(function() {
    var bindEvents = function() {
        $(document).on('click', '.dropdown', function(e) {
            $('.dropdown.open').not(e.currentTarget).removeClass('open')
            if ($(e.currentTarget).hasClass("disabled")) {
              return;
            }
            $(e.currentTarget).toggleClass('open')
        })

        $(document).on('click', function(e) {
            var menu = $(e.target).closest('.dropdown')
            if (menu.length < 1) {
                $('.dropdown').removeClass('open')
            }
        })
    }

    var __main = function() {
        bindEvents()
    }

    $(document).ready(function() {
        __main()
    })
}())
