"use strict";
function woof_init_instock() {
    if (icheck_skin != 'none') {

        jQuery('.woof_checkbox_instock').iCheck('destroy');

        let icheck_selector = '.woof_checkbox_instock';
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

        jQuery('.woof_checkbox_instock, .woof_checkbox_instock2').on('ifChecked', function (event) {
            jQuery(this).attr("checked", true);
            woof_current_values.stock = 'instock';
            woof_ajax_page_num = 1;
            if (woof_autosubmit) {
                woof_submit_link(woof_get_submit_link());
            }
        });

        jQuery('.woof_checkbox_instock, .woof_checkbox_instock2').on('ifUnchecked', function (event) {
            jQuery(this).attr("checked", false);
            delete woof_current_values.stock;
            woof_ajax_page_num = 1;
            if (woof_autosubmit) {
                woof_submit_link(woof_get_submit_link());
            }
        });
    } else {
        jQuery('.woof_checkbox_instock').on('change', function (event) {
            if (jQuery(this).is(':checked')) {
                jQuery(this).attr("checked", true);
                woof_current_values.stock = 'instock';
                woof_ajax_page_num = 1;
                if (woof_autosubmit) {
                    woof_submit_link(woof_get_submit_link());
                }
            } else {
                jQuery(this).attr("checked", false);
                delete woof_current_values.stock;
                woof_ajax_page_num = 1;
                if (woof_autosubmit) {
                    woof_submit_link(woof_get_submit_link());
                }
            }
        });
    }


    //+++

    jQuery('.woof_checkbox_instock_as_switcher').on('change', function (event) {
        if (jQuery(this).is(':checked')) {
            jQuery(this).attr("checked", true);
            woof_current_values.stock = 'instock';
            woof_ajax_page_num = 1;
            if (woof_autosubmit) {
                woof_submit_link(woof_get_submit_link());
            }
        } else {
            jQuery(this).attr("checked", false);
            delete woof_current_values.stock;
            woof_ajax_page_num = 1;
            if (woof_autosubmit) {
                woof_submit_link(woof_get_submit_link());
            }
        }
    });
}
