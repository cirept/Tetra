// ==UserScript==
// @name QA Toolbox - Next Gen BETA
// @namespace www.cobaltgroup.com/
// @include http:*
// @version 2.8.1 BETA
// @run-at document-end
// @description Makes life easier... I hope.
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.js
// @author Eric Tanaka
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

/*global jQuery, unsafeWindow, GM_setValue, GM_getValue, GM_setClipboard, GM_openInTab, window */

var cm = unsafeWindow.ContextManager,
    em = unsafeWindow.editMode,
    cmv = cm.getVersion(),
    sv = (cmv === 'WIP' || cmv === 'PROTO' || cmv === 'LIVE'),
    wID = cm.getWebId(),
    pn = cm.getPageName(),
    pw = ispw();

if (!em && sv && !pw) {

    var $tbs = jQuery('<style>').attr({
        id: 'qa_toolbox',
        type: 'text/css'
    });

    jQuery($tbs)
        .append('.myEDOBut { font-size: 11px; top: 15%; color: #ffffff; position: relative; width: 100%; height: 35px; margin: 1px 0px 0px -10px; border-radius: 5px; border: 2px solid rgb(0,0,0); }')
        .append('.myEDOBut:hover { background: black !important; color: white !important; }')
        .append('.showNav { display: block !important; }')
        .append('.linkOverlay { position: absolute; top: 0; left: 0; z-index: 1; }')
        .append('.imgOverlay { position: absolute; top: 0; left: 0; z-index: 1; }')
        .append('.hasTitle { background: rgba(146, 232, 66, .75) !important; color: white !important; }')
        .append('.noTitle { background: rgba(255, 124, 216, .75) !important; color: white !important; }')
        .append('.emptyTitle { background: rgba(255, 124, 216, .75) !important; color: white !important; }')
        .append('.hasAlt { background: rgba(146, 232, 66, .75) !important; }')
        .append('.noAlt { background: rgba(255, 124, 216, .75) !important; }')
        .append('.emptyAlt { background: rgba(255, 124, 216, .75) !important; }')
        .append('.brokenURL { background: rgba(255, 55, 60, .75) !important; }')
        .append('.urlIssue { -moz-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); -webkit-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); }')
        .append('.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 255, 255, 0) 26%, rgba(146, 232, 66, 0) 100%) !important; }')
        .append('.hasTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(146, 232, 66, 0.75) 26%, rgba(146, 232, 66, 0.75) 99%, rgba(146, 232, 66, 0.75) 100%) !important; }')
        .append('.noTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; }')
        .append('.emptyTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; }')
        .append('.siteLink.linkChecked { background: rgba(96, 223, 229, .75) !important; color: white !important; }')
        .append('.CobaltEditableWidget:after { content: attr(data-content); position: absolute; top: 0; bottom: 0; left: 0; z-index: 100; height: 20px; margin: auto; background: rgba(96, 223, 229, .75); color: white; font-weight: bold; font-size: 10px; }')
        .append('.CobaltWidget:after { content: attr(data-content); position: absolute; top: 0; bottom: 0; left: 0; z-index: 100; height: 20px; margin: auto; background: rgba(96, 223, 229, .75); color: white; font-weight: bold; font-size: 10px; }')
        .append('.legendContent { color: black !important; line-height: 1em; font-size: 1em; height: 10%; margin: 10px; }')
        .append('.overlayDiv { position: relative; }');

    var $ic_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'imageChecker',
            title: 'Image Alt Checker'
        }).text('Image Alt Checker'),
        $lc_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'linkChecker',
            title: 'Check Links'
        }).text('Link Checker'),
        $sn_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'showMajor',
            title: 'Show Navigation (Highlights Major Pages)'
        }).text('Show Navigation'),
        $af_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'showAutofill',
            title: 'Show Autofill Tags'
        }).text('Show Autofill Tags'),
        $sc_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'spellCheck',
            title: 'Check Spelling'
        }).text('Spellcheck Page');

    // ---------------------------------------- web-id panel ----------------------------------------
    var $wid = jQuery('<div>').attr({
        title: 'Copy web-id'
    }).css({
        background: '#ffffff',
        'border-top': '1px solid #000000',
        'border-bottom': '1px solid #000000',
        clear: 'both',
        cursor: 'pointer',
        padding: '5px 0',
        color: '#000000'
    }).text(wID).hover(function () {
        "use strict";
        jQuery(this).css({
            background: '#f4f4f4'
        });
    }, function () {
        "use strict";
        jQuery(this).css({
            'background': '#ffffff'
        });
    });

    jQuery($wid).click(function () {
        "use strict";
        var webID = jQuery(this).html();
        new GM_setClipboard(webID, 'text');
    });

    var $pn = jQuery('<div>').attr({
        title: 'Copy page name'
    }).css({
        background: '#ffffff',
        'border-bottom': '1px solid #000000',
        clear: 'both',
        cursor: 'pointer',
        padding: '5px 0',
        color: '#000000'
    }).text(pn).hover(function () {
        "use strict";
        jQuery(this).css({
            background: '#f4f4f4'
        });
    }, function () {
        "use strict";
        jQuery(this).css({
            'background': '#ffffff'
        });
    });

    jQuery($pn).click(function () {
        "use strict";
        var pi = jQuery(this).html();
        new GM_setClipboard(pi, 'text');
    });

    // ---------------------------------------- image checker ----------------------------------------
    $ic_butt.click(function () {
        var $icl = jQuery('<div>').attr({
                id: 'linkLegend'
            }).css({
                background: 'white',
                'border': '3px solid black',
                'width': '200px',
                'position': 'fixed',
                'bottom': '6%',
                'left': '6%',
                'z-index': '100000',
                'text-align': 'center',
                'padding': '10px'
            }),
            $iclt = jQuery('<div>').attr({
                id: 'linkLegendTitle'
            }).text('Image Checker Legend'),
            $iclna = jQuery('<div>').attr({
                class: 'legendContent noAlt'
            }).text('HAS NO alt text'),
            $iclha = jQuery('<div>').attr({
                class: 'legendContent hasAlt'
            }).text('HAS alt text'),
            $icrb = jQuery('<input>').attr({
                type: 'button',
                class: 'myButton',
                value: 'Remove'
            }).css({
                width: '90%',
                height: '50px'
            });

        $icrb.click(removeFeatures);

        var $ia = jQuery("body img"),
            iaLength = $ia.length,
            a = 0;
        for (a; a < iaLength; a++) {
            var isImageLink = true;
            var w = jQuery($ia[a]).width(),
                h = jQuery($ia[a]).height();
            addDivOverlay($ia[a], w, h);

            if (jQuery($ia[a]).attr("alt") !== undefined) {
                if (jQuery($ia[a]).attr("alt") === '') {
                    if (isImageLink) {
                        jQuery($ia[a])
                            .siblings(".imgOverlay")
                            .addClass("emptyAlt");
                    } else {
                        jQuery($ia[a]).addClass("emptyAlt");
                    }
                } else {
                    if (isImageLink) {
                        jQuery($ia[a])
                            .siblings(".imgOverlay")
                            .addClass("hasAlt");
                        jQuery($ia[a])
                            .siblings(".imgOverlay")
                            .attr("title", jQuery($ia[a])
                                .attr("alt"));
                    } else {
                        jQuery($ia[a]).addClass("hasAlt");
                    }
                }
            } else {
                if (isImageLink) {
                    jQuery($ia[a])
                        .siblings(".imgOverlay")
                        .addClass("noAlt");
                } else {
                    jQuery($ia[a]).addClass("noAlt");
                }
            }
        }

        jQuery($icl)
            .append($iclt)
            .append($iclna)
            .append($iclha)
            .append($icrb);

        jQuery("#content").append($icl);

        function removeFeatures() {
            $ia = jQuery("body img");
            iaLength = $ia.length;
            a = 0;
            for (a; a < iaLength; a++) {
                jQuery($ia[a])
                    .removeClass("opensWindow")
                    .removeClass("emptyAlt")
                    .removeClass("hasAlt")
                    .removeClass("noAlt")
                    .removeClass('overlayDiv');
            }
            jQuery("body").find(".imgOverlay").remove();
            $icl.remove();
            jQuery(this).remove();
        }

        function addDivOverlay(elem, width, height) {
            var $imageOverlay = jQuery('<div>').attr({
                    class: 'imgOverlay'
                }),
                imageAlt = jQuery(elem).attr('alt');
            jQuery($imageOverlay).css({
                width: width + 'px',
                height: height + 'px',
                'text-align': 'center',
                'vertical-align': 'middle',
                'line-height': height + 'px',
                color: '#000000 !important',
                'font-weight': 'bold'
            }).append(imageAlt);
            jQuery($imageOverlay)
                .insertBefore(jQuery(elem)
                    .addClass('overlayDiv'));
        }
    });

    // ---------------------------------------- link checker ----------------------------------------
    $lc_butt.click(function () {
        var $lcc = jQuery('<span>').css({
                position: 'absolute',
                left: '5px',
                color: 'white'
            }),
            $cm = jQuery('<i>').attr({
                class: 'fa fa-check-circle fa-3x'
            }),
            $lcl = jQuery('<div>').attr({
                id: 'linkLegend;'
            }).css({
                background: 'white',
                border: '3px solid black',
                width: '200px',
                position: 'fixed',
                bottom: '6%',
                left: '6%',
                'z-index': '10000',
                'text-align': 'center',
                padding: '10px'
            }),
            $lclt = jQuery('<div>').attr({
                id: 'linkLegendTitle'
            }).text('Link Checker Legend'),
            $lclnt = jQuery('<div>').attr({
                class: 'legendContent noTitle'
            }).text('HAS NO title text'),
            $lclht = jQuery('<div>').attr({
                class: 'legendContent hasTitle'
            }).text('HAS title text'),
            $lclow = jQuery('<div>').attr({
                class: 'legendContent opensWindow'
            }).text('OPENS IN A NEW WINDOW'),
            $lclbl = jQuery('<div>').attr({
                class: 'legendContent brokenURL'
            }).text('EMPTY OR UNDEFINED URL'),
            $lclui = jQuery('<div>').attr({
                class: 'legendContent urlIssue'
            }).text('VERIFY URL'),
            $icr_butt = jQuery('<input>').attr({
                type: 'button',
                class: 'myButton',
                value: 'Remove'
            }).css({
                width: '90%',
                height: '50px'
            });

        jQuery($lcc).append($cm);

        function removeLCfeatures() {
            b = 0;
            for (b; b < laLength; b++) {
                jQuery($la[b])
                    .removeClass("siteLink")
                    .removeClass("opensWindow")
                    .removeClass("emptyTitle")
                    .removeClass("hasTitle")
                    .removeClass("noTitle")
                    .removeClass("brokenURL")
                    .removeClass('urlIssue')
                    .removeClass("linkChecked")
                    .removeClass('overlayDiv');
            }
            jQuery("body").find(".linkOverlay").remove();
            $lcl.remove();
            jQuery(this).remove();
        }

        function bindClickAction(isImage) {
            return function () {
                if (isImage) {
                    jQuery(this).find('.linkOverlay')
                        .addClass('linkChecked')
                        .append($lcc);
                } else {
                    jQuery(this).addClass('linkChecked');
                }
            };
        }

        function addLinkDiv(elem, width, height) {
            var $linkOverlay = jQuery('<div>').attr({
                    class: 'siteLink linkOverlay'
                }).css({
                    width: width + 'px',
                    height: height + 'px',
                    'text-align': 'center',
                    'vertical-align': 'middle',
                    'line-height': height + 'px',
                    'z-index': '2',
                    color: '#000000 !important',
                    'font-weight': 'bold'
                }),
                linkTitle = jQuery(elem).attr('title');
            jQuery($linkOverlay).append(linkTitle);
            jQuery(elem).addClass('overlayDiv').prepend($linkOverlay);
        }

        function checkTarget(elem) {
            if ((jQuery(elem).attr("target") === "_blank") || (jQuery(elem).attr("target") === "_new")) {
                return true;
            }
        }

        function checkHref(elem) {
            if ((jQuery(elem).attr('href').indexOf('#') === 0) ||
                (jQuery(elem).attr('href').indexOf('f_') === 0) ||
                (jQuery(elem).attr('href').indexOf('www') >= 0) ||
                (jQuery(elem).attr('href').indexOf('http') >= 0)) {
                return true;
            }
        }

        jQuery($icr_butt).click(removeLCfeatures);

        jQuery($lcl)
            .append($lclt)
            .append($lclnt)
            .append($lclht)
            .append($lclow)
            .append($lclbl)
            .append($lclui)
            .append($icr_butt);

        jQuery("#content").append($lcl);

        var $la = jQuery("body a"),
            laLength = $la.length,
            b = 0;
        for (b; b < laLength; b++) {
            var isImageLink = false;
            if ((jQuery($la[b]).has("img").length)) {
                var w = jQuery($la[b]).has("img").width(),
                    h = jQuery($la[b]).height();
                addLinkDiv($la[b], w, h);
                isImageLink = true;
            }
            jQuery($la[b]).click(bindClickAction(isImageLink));
            jQuery($la[b]).addClass('siteLink');
            if (checkTarget($la[b])) {
                if (isImageLink) {
                    jQuery($la[b])
                        .find(".linkOverlay")
                        .addClass("opensWindow");
                } else {
                    jQuery($la[b]).addClass("opensWindow");
                }
            }

            if ((jQuery($la[b]).attr("href"))) {
                if (checkHref($la[b])) {
                    if (isImageLink) {
                        jQuery($la[b])
                            .find(".linkOverlay")
                            .addClass("urlIssue");
                    } else {
                        jQuery($la[b]).addClass("urlIssue");
                    }
                }
            } else {
                if (isImageLink) {
                    jQuery($la[b])
                        .find(".linkOverlay")
                        .addClass("brokenURL");
                } else {
                    jQuery($la[b]).addClass("brokenURL");
                }
            }

            if (jQuery($la[b]).attr("title") !== undefined) {
                if (jQuery($la[b]).attr("title") === '') {
                    if (isImageLink) {
                        jQuery($la[b])
                            .find(".linkOverlay")
                            .addClass("emptyTitle");
                    } else {
                        jQuery($la[b]).addClass("emptyTitle");
                    }
                } else {
                    if (isImageLink) {
                        jQuery($la[b])
                            .find(".linkOverlay")
                            .addClass("hasTitle");
                    } else {
                        jQuery($la[b]).addClass("hasTitle");
                    }
                }
            } else {
                if (isImageLink) {
                    jQuery($la[b])
                        .find(".linkOverlay")
                        .addClass("noTitle");
                } else {
                    jQuery($la[b]).addClass("noTitle");
                }
            }
        }
    });

    // ---------------------------------------- Show Navigation (highlight major pages) ----------------------------------------
    $sn_butt.click(function () {
        "use strict";
        var s = 0,
            $n = jQuery('#pmenu'),
            $nt = jQuery($n).find('ul'),
            $ntl = jQuery($nt).find('a[href]'),
            nlLength = $ntl.length,
            $r_butt = jQuery('<input>').attr({
                type: 'button',
                class: 'myButton',
                value: 'Remove'
            }).css({
                position: 'fixed',
                bottom: '10%',
                left: '95px',
                padding: '50px',
                'z-index': '100000'
            });

        jQuery($n).find('a[href*=Form], a[href*=ContactUs], a[href=HoursAndDirections], a[href*=VehicleSearchResults]').css({
            background: 'pink',
            color: 'white'
        });

        jQuery($r_butt).click(function () {
            var $nm = jQuery('#pmenu'),
                $nmi = jQuery($nm).find('ul'),
                $nml = jQuery($nm).find('a'),
                f = 0,
                nml = $nml.length;
            jQuery($nmi).removeClass('showNav');
            for (f; f < nml; f++) {
                jQuery($nml[f]).removeAttr('style');
            }
            jQuery(this).remove();
        });

        jQuery($nt).addClass('showNav');

        function bindClick() {
            return function () {
                jQuery(this).css({
                    background: 'rgba(96,223,229,1)',
                    color: 'white'
                });
            };
        }
        for (s; s < nlLength; s++) {
            jQuery($ntl[s]).click(bindClick());
        }

        jQuery('#content').append($r_butt);
    });

    // ---------------------------------------- Show Autofill Tags ----------------------------------------
    $af_butt.click(function () {
        "use strict";
        var x = "?disableAutofill=true",
            z = cm.getUrl(),
            newTab;
        newTab = new GM_openInTab(z + pn + x, 'active');
    });

    // ---------------------------------------- Spell Check ----------------------------------------
    $sc_butt.click(function () {
        "use strict";
        var scSite = "https://www.w3.org/2002/01/spellchecker?",
            param = {
                uri: encodeURIComponent(cm.getUrl() + pn),
                lang: "en_US"
            },
            newTab;
        jQuery.each(param, function (index, value) {
            scSite += index + '=' + value + "&";
        });
        newTab = new GM_openInTab(scSite, 'insert');
    });

    // ----------------------------------------

    var $tb = jQuery('<div>').attr({
            id: 'myToolbox'
        }).css({
            'text-align': 'center',
            background: 'linear-gradient(to right, #a8e063 0%, #56ab2f 100%)',
            position: 'fixed',
            top: '20%',
            right: '0%',
            width: '135px',
            border: '1px solid black',
            'font-size': '.85em',
            'z-index': '9999999'
        }),
        $tbt = jQuery('<div>').css({
            color: 'white',
            padding: '5px'
        }).text('QA Toolbox');

    $tbt.click(function () {
        $tb.toggle();
    });

    jQuery($tb)
        .append($tbt)
        .append($wid)
        .append($pn)
        .append($ic_butt)
        .append($lc_butt)
        .append($sn_butt)
        .append($af_butt)
        .append($sc_butt);

    jQuery($tb).children('.myEDOBut:even').css({
        background: 'linear-gradient(to left,#00d2ff 0,#3a7bd5 100%)'
    });

    jQuery($tb).children('.myEDOBut:odd').css({
        background: 'linear-gradient(to left, #4b6cb7 0px, #182848 100%)'
    });

    jQuery('head').append($tbs);
    jQuery('body').append($tb);
}

function ispw() {
    "use strict";
    if (jQuery('body .phone-wrapper').length > 0) {
        return true;
    } else {
        return false;
    }
}
