jQuery(document).ready(function ($) {
    if (window.location.href.indexOf('#wpc-comment-') > 0 || window.location.href.indexOf('#wpc_unsubscribe_message') > 0) {
        var wooCoomentId = window.location.href.substring(window.location.href.lastIndexOf('-'));
        $('.woocommerce-tabs .tabs li').each(function () {
            $(this).removeClass('active');
        });
        $('.woocommerce-tabs .entry-content').each(function () {
            $(this).css('display', 'none');
        });
        $('.woocommerce-tabs .tabs .wpc_comment_tab_tab').addClass('active');
        $('.woocommerce-tabs #tab-wpc_comment_tab').css('display', 'block');
        if(window.location.href.indexOf('#wpc-comment-') > 0) {
            $('html, body').animate({
                scrollTop: $('#wpc-comment' + wooCoomentId).offset().top
            }, 100);
        }
    }
});