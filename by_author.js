"use strict";

function woof_init_author() {
    if (icheck_skin != 'none') {
        
        jQuery('.woof_checkbox_author').iCheck('destroy');

        let icheck_selector = '.woof_checkbox_author';
        let skin = jQuery(icheck_selector).parents('.woof_redraw_zone').eq(0).data('icheck-skin');
        if (skin) {
            skin = skin.split('_');
            jQuery(icheck_selector).iCheck({
                checkboxClass: 'icheckbox_' + skin[0] + '-' + skin[1]
            });
        } else {
            jQuery(icheck_selector).iCheck({
                checkboxClass: 'icheckbox_' + icheck_skin.skin + '-' + icheck_skin.color
            });
        }

        //+++

        jQuery('.woof_checkbox_author').on('ifChecked', function (event) {
            jQuery(this).attr("checked", true);

            woof_current_values.woof_author = get_current_checked(this);
            woof_ajax_page_num = 1;
            if (woof_autosubmit) {
                woof_submit_link(woof_get_submit_link());
            }
        });

        jQuery('.woof_checkbox_author').on('ifUnchecked', function (event) {
            jQuery(this).attr("checked", false);
            jQuery(this).removeAttr("checked");

            woof_current_values.woof_author = get_current_checked(this);
            woof_ajax_page_num = 1;
            if (woof_autosubmit) {
                woof_submit_link(woof_get_submit_link());
            }
        });

    } else {
        jQuery('.woof_checkbox_author').on('change', function (event) {
	    
            if (jQuery(this).is(':checked')) {
                jQuery(this).attr("checked", true);
                woof_current_values.woof_author = get_current_checked(this);
                woof_ajax_page_num = 1;
                if (woof_autosubmit) {
                    woof_submit_link(woof_get_submit_link());
                }
            } else {
                jQuery(this).attr("checked", false);
                woof_current_values.woof_author = get_current_checked(this);
                woof_ajax_page_num = 1;
                if (woof_autosubmit) {
                    woof_submit_link(woof_get_submit_link());
                }
            }
        });
    }


    function get_current_checked(_this) {
        var values = [];
        jQuery(_this).parents('.woof_authors').find('.woof_checkbox_author').each(function (i, el) {
            if (jQuery(this).attr("checked") == 'checked') {
                values.push(jQuery(this).val());
		
            }

        });

        values = values.filter((v, i, a) => a.indexOf(v) === i);
        return values.join(',');
    }

}
