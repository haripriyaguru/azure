jQuery(document).ready(function ($) {
    var wpc_home_url = $('#wpc_home_url').val();
    var wpc_plugin_dir_url = $('#wpc_plugin_dir_url').val();
    var wpc_name;
    var wpc_email;
    var wpc_comment;
    var wpc_captcha;
    var wpc_comment_post_ID;
    var wpc_comment_parent;
    var wpc_form;
    var wpc_submitID;
    var wpc_comments_offset;
    var wpc_new_comment_id;
    var wpc_loading_image;
    var wpc_comment_text_before_editting;
    $(".wpc_comment").autoGrow();

    $(document).on('click', '#wpc_openModalFormAction', function () {
        $('#wpc_openModalFormAction').css('opacity', '0');
        $('#wpc_openModalFormAction').css('pointer-events', 'none');
    });

    $(document).on('click', '#wpc_openModalFormAction .close', function () {
        $('#wpc_openModalFormAction').css('opacity', '0');
        $('#wpc_openModalFormAction').css('pointer-events', 'none');
    });

    wpc_loading_image = "<img width='64' height='64' src='" + wpc_home_url + '/' + wpc_plugin_dir_url + "/files/img/loader/ajax-loader-200x200.gif' />";
    wpc_comments_offset = $('#wpc_comments_offset');
    wpc_comments_offset.val('1');

    $(document).on('focus', '.wpc_comment', function () {
        var uniqueID = getUniqueID($(this));
        $('#wpc-form-footer-' + uniqueID).slideDown(700);
    });


    $(document).on('click', '.wpc-reply-link', function () {
        var uniqueID = getUniqueID($(this));
        $('#wpc-secondary-forms-wrapper-' + uniqueID).slideToggle(700);
    });

    $(document).on('click', '.wpc-share-link', function () {
        var uniqueID = getUniqueID($(this));
        $('#share_buttons_box-' + uniqueID).slideToggle(1000);
    });

    $(document).on('click', '.wpc_captcha_refresh_img', function () {
        var uniqueID = getUniqueID($(this));
        var wpc_commpost_ID = $('#wpc_comment_post_ID-' + uniqueID).val();
        var wpc_commparent = $('#wpc_comment_parent-' + uniqueID).val();
        $("#wpc_captcha_img-" + uniqueID).attr("src", wpc_home_url + "/" + wpc_plugin_dir_url + "/captcha/captcha.php?comm_id=" + wpc_commpost_ID + '-' + wpc_commparent + '&r=' + Math.random());
    });

    $(document).on('click', '.wpc_comm_submit', function () {
        wpc_submitID = $(this).attr('id');
        var uniqueID = wpc_submitID.substring(wpc_submitID.lastIndexOf('-') + 1);
        wpc_name = $('#wpc_name-' + uniqueID).val();
        wpc_email = $('#wpc_email-' + uniqueID).val();
        wpc_comment = $('textarea#wpc_comment-' + uniqueID).val();
        wpc_captcha = $('#wpc_captcha-' + uniqueID).val();
        wpc_comment_post_ID = $('#wpc_comment_post_ID-' + uniqueID).val();
        wpc_comment_parent = $('#wpc_comment_parent-' + uniqueID).val();
        wpc_form = $('#wpc_comm_form-' + uniqueID);

        var depth = '';
        if (isMainFormSubmit(wpc_submitID, wpc_comment_post_ID)) {
            depth = 1;
        } else {
            depth = getCommentDepth($(this).parents('.wpc-comment'));
        }

        var submit = true;
        // evaluate the form using generic validaing
        if (!woodiscuzValidator.checkAll(wpc_form)) {
            submit = false;
            $('#wpc_captcha-' + uniqueID).val('');
            $("#wpc_captcha_img-" + uniqueID).attr("src", wpc_home_url + "/" + wpc_plugin_dir_url + "/captcha/captcha.php?comm_id=" + wpc_comment_post_ID + '-' + wpc_comment_parent + '&r=' + Math.random());
        } else {
            $('#wpc_openModalFormAction .close').css('display', 'none');
            $('#wpc_openModalFormAction').css('opacity', '1');
            $('#wpc_openModalFormAction').css('pointer-events', 'auto');
            $('#wpc_openModalFormAction > #wpc_response_info').html(wpc_loading_image);
        }

        var notification_type = '';
        var notification_type_radio = $("input[name='wpc_notification_new_reply-" + uniqueID + "']:checked").length ? $("input[name='wpc_notification_new_reply-" + uniqueID + "']:checked").val() : '';

        if (notification_type_radio.length) {
            if (notification_type_radio == 'wpc_notification_new_reply') {
                notification_type = 'reply';
            }
        }

        if (submit) {
            $.ajax({
                type: 'POST',
                url: wpc_ajax_obj.url,
                data: {
                    name: wpc_name,
                    email: wpc_email,
                    comment: wpc_comment,
                    captcha: wpc_captcha,
                    comment_depth: depth,
                    comment_post_ID: wpc_comment_post_ID,
                    comment_parent: wpc_comment_parent,
                    notification_type: notification_type,
                    action: 'wpc_comms_via_ajax'
                }
            }).done(function (response) {
                $("#wpc_captcha_img-" + uniqueID).attr("src", wpc_home_url + "/" + wpc_plugin_dir_url + "/captcha/captcha.php?comm_id=" + wpc_comment_post_ID + '-' + wpc_comment_parent + '&r=' + Math.random());
                var obj = $.parseJSON(response);
                wpc_new_comment_id = parseInt(obj.wpc_new_comment_id);
                if (obj.code === -1) {
                    $('#wpc_response_info').html(obj.message);
                } else if (obj.code === -2) {
                    var html = "<a href='#close' title='Close' class='close'>&nbsp;</a>";
                    $('#wpc_response_info').html(html + obj.message);
                    $('#wpc_openModalFormAction .close').css('display', 'block');
                    $('#wpc_comment-' + uniqueID).val('');
                    $('.wpc_comm_form textarea').css('height', '46px');

                    if (wpc_submitID === 'wpc_comm-' + wpc_comment_post_ID + '_0') {
                        $('#wpc-form-footer-' + uniqueID).slideToggle(700);
                    } else {
                        $('#wpc-secondary-forms-wrapper-' + uniqueID).slideToggle(700);
                    }
                    $.cookie('wpc_author_name', wpc_name);
                    $.cookie('wpc_author_email', wpc_email);
                    $.cookie('wpc_poster', wpc_email, 60 * 60 * 24 * 365 * 10);

                } else {
                    $('#wpc_comment-' + uniqueID).val('');
                    $('.wpc_comm_form textarea').css('height', '46px');

                    if (wpc_submitID === 'wpc_comm-' + wpc_comment_post_ID + '_0') {
                        $('.wpc-thread-wrapper').prepend(obj.message);
                        $('#wpc-form-footer-' + uniqueID).slideToggle(700);
                    } else {
                        $('#wpc-secondary-forms-wrapper-' + uniqueID).slideToggle(700);

                        if (obj.is_in_same_container == 1) {
                            $('#wpc-secondary-forms-wrapper-' + uniqueID).after(obj.message);
                        } else {
                            $('#wpc-secondary-forms-wrapper-' + uniqueID).after(obj.message.replace('wpc-reply', 'wpc-reply wpc-no-left-margin'));
                        }
                    }
                    $('#wpc_openModalFormAction').css('opacity', '0');
                    $('#wpc_openModalFormAction').css('pointer-events', 'none');
                    if (wpc_name !== '' && wpc_email !== '') {
                        $.cookie('wpc_author_name', wpc_name);
                        $.cookie('wpc_author_email', wpc_email);
                        $('#woopcomm .wpc_name').val(wpc_name);
                        $('#woopcomm .wpc_email').val(wpc_email);
                    }

                    $.cookie('wpc_poster', wpc_email, 60 * 60 * 24 * 365 * 10);

                    if (wpc_new_comment_id !== -1) {
                        notify_on_new_comment(wpc_comment_post_ID, wpc_new_comment_id, wpc_email);
                    }
                }
                $('#wpc_captcha-' + uniqueID).val('');
                $('.wpc_tooltipster').tooltipster({offsetY: 2,multiple:true});
                $('.wpc_comm_form input').css('box-shadow', '0 0 4px -2px #d4d0ba');
                $('.wpc_comm_form textarea').css('box-shadow', '0 0 4px -2px #d4d0ba');


                // call redirection if comment added successfully
                if ((obj.code == 1 || obj.code == -2) && $('form.wpc_main_form').hasClass('wpc-no-comments')) {
                    $.ajax({
                        type: 'POST',
                        url: wpc_ajax_obj.url,
                        data: {
                            wpc_new_comment_id: wpc_new_comment_id,
                            action: 'woodiscuz_comment_redirect'
                        }
                    }).done(function (redirectResponse) {
                        try {
                            var redirectObj = $.parseJSON(redirectResponse);
                            if (redirectObj.code == 1) {
                                setTimeout(function () {
                                    window.location.href = redirectObj.redirect_to;
                                }, 5000)
                            }
                        } catch (e) {

                        }
                    });
                }
            });
        }
        else {
            return false;
        }
    });



    $(document).on('click', '.wpc_vote', function () {
        var uniqueID = getUniqueID($(this));
        var commentID = getCommentID(uniqueID);
        var voteType;

        $('#wpc_openModalFormAction > #wpc_response_info').html(wpc_loading_image);
        $('#wpc_openModalFormAction .close').css('display', 'block');
        $('#wpc_openModalFormAction').css('opacity', '1');
        $('#wpc_openModalFormAction').css('pointer-events', 'auto');
        if ($(this).hasClass('wpc-up')) {
            voteType = 1;
        } else {
            voteType = -1;
        }

        $.ajax({
            dateType: 'json',
            type: 'POST',
            url: wpc_ajax_obj.url,
            data: {
                comment_ID: commentID,
                vote_type: voteType,
                action: 'wpc_vote_via_ajax'
            }
        }).done(function (response) {
            var obj = $.parseJSON(response);

            if (obj.code !== -1) {
                $('#vote-count-' + uniqueID).text(parseInt($('#vote-count-' + uniqueID).text()) + voteType);
                $('#wpc_openModalFormAction').css('opacity', '0');
                $('#wpc_openModalFormAction').css('pointer-events', 'none');
            } else {
                var html = "<a href='#close' title='Close' class='close'>&nbsp;</a>";
                $('#wpc_response_info').html(html + obj.message);
                $('#wpc_openModalFormAction .close').css('display', 'block');
            }
        });
    });

    $(document).on('click', '.wpc-load-more-submit', function () {
        $('#wpc_openModalFormAction > #wpc_response_info').html(wpc_loading_image);
        $('#wpc_openModalFormAction .close').css('display', 'none');
        $('#wpc_openModalFormAction').css('opacity', '1');
        $('#wpc_openModalFormAction').css('pointer-events', 'auto');

        var wpc_comments_offset_value = wpc_comments_offset.val();
        var wpc_post_id = getPostID($(this).attr('id'));
        var wpc_parent_comments_count = parseInt($('#wpc_parent_comments_count').val());
        var wpc_parent_per_page = parseInt($('#wpc_parent_per_page').val());

        wpc_comments_offset_value = parseInt(wpc_comments_offset_value);
        wpc_comments_offset_value++;

        $.ajax({
            type: 'POST',
            url: wpc_ajax_obj.url,
            data: {
                comments_offset: wpc_comments_offset_value,
                wpc_post_id: wpc_post_id,
                action: 'wpc_load_more_comments'
            }
        }).done(function (response) {
            wpc_comments_offset.val(wpc_comments_offset_value);
            if (wpc_parent_comments_count <= (wpc_comments_offset_value * wpc_parent_per_page)) {
                $('.wpc-load-more-submit-wrap').remove();
            }
            $('.wpc-thread-wrapper').html(response);
            $('#wpc_openModalFormAction').css('opacity', '0');
            $('#wpc_openModalFormAction').css('pointer-events', 'none');
            $('.wpc_tooltipster').tooltipster({offsetY: 2});
        });
    });

    function getUniqueID(field) {
        var fieldID = field.attr('id');
        var uniqueID = fieldID.substring(fieldID.lastIndexOf('-') + 1);
        return uniqueID;
    }

    function getPostID(uniqueID) {
        var postID = uniqueID.substring(uniqueID.lastIndexOf('-') + 1);
        postID = postID.substring(0, postID.lastIndexOf('_'));
        return postID;
    }

    function getCommentID(uniqueID) {
        var commentID = uniqueID.substring(uniqueID.indexOf('_') + 1);
        return commentID;
    }

    function notify_on_new_comment(post_id, comment_id, email) {
        $.ajax({
            type: 'POST',
            url: wpc_ajax_obj.url,
            data: {
                wpc_post_id: post_id,
                wpc_comment_id: comment_id,
                wpc_email: email,
                action: 'wpc_check_notification_type'
            }
        });
    }


    $(document).on('click', '.wpc_editable_comment', function () {
        var uniqueID = getUniqueID($(this));
        var commentID = getCommentID(uniqueID);

        $.ajax({
            type: 'POST',
            url: wpc_ajax_obj.url,
            data: {
                comment_id: commentID,
                action: 'wpc_get_editable_comment_content'
            }
        }).done(function (response) {
            try {
                var obj = $.parseJSON(response);
                if (obj.code == 1) {
                    wpc_comment_text_before_editting = obj.message;
                    var editableTextarea = '<textarea required="required" name="wpc_comment" class="wpc_comment wpc_field_input wpc_edit_comment" id="wpc_edit_comment-' + uniqueID + '" style="min-height: 2em;">' + obj.message + '</textarea>';
                    $('#wpc-comm-' + uniqueID + ' > .wpc-comment-right .wpc-comment-text').replaceWith(editableTextarea);
                    document.getElementById('wpc_edit_comment-' + uniqueID).trigger('focus');
                    $('#wpc_save_edited_comment-' + uniqueID).show();
                    editableTextarea = '';
                    $('#wpc_editable_comment-' + uniqueID).hide();
                    $('#wpc_cancel_edit-' + uniqueID).show();
                } else {
                    var html = "<a href='#close' title='Close' class='close'>&nbsp;</a>";
                    $('#wpc_openModalFormAction').css('opacity', '1');
                    $('#wpc_openModalFormAction').css('pointer-events', 'auto');
                    $('#wpc_openModalFormAction .close').css('display', 'block');
                    $('#wpc_openModalFormAction > #wpc_response_info').html(html + obj.phrase_message);
                }
            } catch (e) {
                console.log(e);
            }
        });
    });

    $(document).on('click', '.wpc_save_edited_comment', function () {
        var uniqueID = getUniqueID($(this));
        var commentID = getCommentID(uniqueID);
        var editableTextarea = $('#wpc-comm-' + uniqueID + ' textarea#wpc_edit_comment-' + uniqueID);
        var commentContent = editableTextarea.val();
        var submit = true;
        if ($.trim(commentContent).length <= 0) {
            submit = false;
        }

        if (submit) {
            $('#wpc_openModalFormAction .close').css('display', 'none');
            $('#wpc_openModalFormAction').css('opacity', '1');
            $('#wpc_openModalFormAction').css('pointer-events', 'auto');
            $('#wpc_openModalFormAction > #wpc_response_info').html(wpc_loading_image);

            $.ajax({
                type: 'POST',
                url: wpc_ajax_obj.url,
                data: {
                    comment_id: commentID,
                    comment_content: commentContent,
                    action: 'wpc_save_edited_comment'
                }
            }).done(function (response) {
                try {
                    var obj = $.parseJSON(response);
                    if (obj.code == 1) {
                        $('#wpc_openModalFormAction').css('opacity', '0');
                        $('#wpc_openModalFormAction').css('pointer-events', 'none');
                        wpc_cancel_or_save(uniqueID, obj.message);
                    } else {
                        var html = "<a href='#close' title='Close' class='close'>&nbsp;</a>";
                        $('#wpc_openModalFormAction').css('opacity', '1');
                        $('#wpc_openModalFormAction').css('pointer-events', 'auto');
                        $('#wpc_openModalFormAction .close').css('display', 'block');
                        $('#wpc_openModalFormAction > #wpc_response_info').html(html + obj.phrase_message);
                    }
                    editableTextarea = '';
                    commentContent = '';
                } catch (e) {
                    console.log(e);
                }
            });
        }
    });

    $(document).on('click', '.wpc_cancel_edit', function () {
        var uniqueID = getUniqueID($(this));
        wpc_cancel_or_save(uniqueID, wpc_comment_text_before_editting);
    });

    function wpc_cancel_or_save(uniqueID, content) {
        $('#wpc_editable_comment-' + uniqueID).show();
        $('#wpc_cancel_edit-' + uniqueID).hide();
        $('#wpc_save_edited_comment-' + uniqueID).hide();
        var commentContentWrapper = '<div class="wpc-comment-text">' + nl2br(content) + '</div>';
        $('#wpc-comm-' + uniqueID + ' #wpc_edit_comment-' + uniqueID).replaceWith(commentContentWrapper);
    }

    function nl2br(str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br/>' : '<br>';
        var string = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        return string.replace('<br><br>', '<br/>');
    }

    function getCommentDepth(field) {
        var fieldClasses = field.attr('class');
        var classesArray = fieldClasses.split(' ');
        var depth = '';
        $.each(classesArray, function (index, value) {
            ;
            if ('wpc_comment_level' === getParentDepth(value, false)) {
                depth = getParentDepth(value, true);
            }
        });
        return parseInt(depth) + 1;
    }

    function getParentDepth(depthValue, isNumberPart) {
        var depth = '';
        if (isNumberPart) {
            depth = depthValue.substring(depthValue.indexOf('-') + 1);
        } else {
            depth = depthValue.substring(0, depthValue.indexOf('-'));
        }
        return depth;
    }

    function isMainFormSubmit(wpc_submitID, wpc_comment_post_ID) {
        return wpc_submitID === 'wpc_comm-' + wpc_comment_post_ID + '_0';
    }
    $('.wpc_tooltipster').tooltipster({offsetY: 2});
});