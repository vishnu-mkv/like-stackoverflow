$(document).ready(function() {

    $('.review-link-toggle').on('click', function(e) {
        $(e.target).parent().find('form').toggleClass('hidden');
        $(e.target).parent().parent().find('.review').toggleClass('hidden');
    })
})