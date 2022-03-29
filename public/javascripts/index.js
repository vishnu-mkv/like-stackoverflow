$(document).ready(function() {

    $('.review-link-toggle').on('click', function(e) {
        $(e.target).parent().find('form').toggleClass('hidden');
        $(e.target).parent().parent().find('.review').toggleClass('hidden');
    })

    $('#menu-icon').on('click', (e) => {
        $('.nav-right').toggleClass('nav-active')
    });
    
    let ansField = $('#ans-field'),
    imgField = $('#file-field'),
    orText = $('#or-text');

    ansField.on('keyup', function(e) {
        if($(e.target).val() === '') {
            imgField.removeClass('hidden');
            orText.removeClass('hidden');
            return;
        }
        imgField.addClass('hidden');
        orText.addClass('hidden');
    });

    $('input[name=answerFile]').change(function(ev) {
 
        if(imgField[0].files.length === 0) {
            ansField.removeClass('hidden');
            orText.removeClass('hidden');
            return;
        }
        ansField.addClass('hidden');
        orText.addClass('hidden');
    });
})