// ==UserScript==
// @name QA Toolbox
// @namespace www.cobaltgroup.com/
// @include http:*
// @version 2.6.6
// @downloadURL http://media-dmg.assets-cdk.com/teams/repository/export/460/264509aae1005845e0050568ba825/460264509aae1005845e0050568ba825.js
// @run-at document-end
// @description Makes life easier... I hope.
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.js
// @require http://media-dmg.assets-cdk.com/teams/repository/export/460/264509aae1005845e0050568ba825/460264509aae1005845e0050568ba825.js
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
    upn = cm.getPageLabel(),
    pw = ispw();

if (!em && sv && !pw) {

    var $tbs = jQuery('<style>').attr({
        id: 'qa_toolbox',
        type: 'text/css'
    });

    jQuery($tbs)
        .append('.myEDOBut { font-size: 11px; top: 15%; position: relative; width: 100%; height: 35px; margin: 1px 0px 0px 10px; border-radius: 5px; border: 2px solid rgb(0,0,0); }')
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
        $wo_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'widgetOutline',
            title: 'Show Widget Outlines'
        }).text('Show Widgets'),
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
        }).text('Spellcheck Page'),
        $wpt_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'testPage',
            title: 'Queue up a Page Test'
        }).text('Web Page Test'),
        $seo_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'simpleSEO',
            title: 'Simplify My SEO Text'
        }).text('SEO Simplify');

    // ---------------------------------------- m4 checkbox ----------------------------------------
    var $m4mi = jQuery('<div>').attr({
            id: 'm4Input'
        }).css({
            'padding': '7px 0 0 0'
        }),
        um4m = GM_getValue('usingM4', false),
        $m4l = jQuery("<label>").attr({
            for: 'myCheckbox'
        }).text('Using m4 Modules?').css({
            display: 'inline-block',
            'vertical-align': 'super'
        }),
        $m4cb = jQuery('<input>').attr({
            type: 'checkbox',
            id: 'm4Checkbox',
            name: 'm4Checkbox',
            checked: um4m
        }).css({
            width: '20px',
            height: '20px'
        });

    if (cmv === 'LIVE') {
        jQuery($m4mi).css({
            display: 'none'
        });
    }

    ap(um4m);
    jQuery($m4cb).click(function () {
        var checked = jQuery('#m4Checkbox').attr('checked');
        GM_setValue('usingM4', checked);
        ap(checked);
    });

    $m4mi.append($m4l).append($m4cb);

    // web page test

    var e = GM_getValue('email', 'your.name@cdk.com'),
        $et = jQuery('<div>').text('Enter your email'),
        $em = jQuery('<input>').attr({
            id: 'email',
            type: 'text',
            value: e
        }).css({
            margin: '5px 0px',
            width: '85%'
        }),
        $wpti = jQuery('<div>').attr({
            id: 'wptInput'
        }).css({
            padding: '5px'
        }),
        myOptions = {
            '_IE11': 'IE11',
            ':Chrome': 'Chrome',
            ':FireFox': 'Firefox'
        };

    var $bo = jQuery('<select>').attr({
            id: 'bSelect'
        }).css({
            margin: '5px 0',
            width: '90%'
        }),
        $bt = jQuery('<div>').text('Choose a Browser');

    jQuery.each(myOptions, function (val, text) {
        "use strict";
        $bo.append(jQuery('<option></option>').val(val).html(text));
    });
    jQuery($wpti)
        .append($et)
        .append($em)
        .append($bt)
        .append($bo);

    // ---------------------------------------- web-id panel ----------------------------------------
    var $wid = jQuery('<div>').attr({
        title: 'Copy web-id'
    }).css({
        background: '#ffffff',
        'border-top': '1px solid #000000',
        'border-bottom': '1px solid #000000',
        clear: 'both',
        cursor: 'pointer',
        padding: '5px 0'
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
        padding: '5px 0'
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
                (jQuery(elem).attr('href').indexOf('http') >= 0) ||
                (jQuery(elem).attr('href').indexOf('//:') >= 0)) {
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

    // ---------------------------------------- Test WebPage ----------------------------------------
    $wpt_butt.click(function () {
        GM_setValue('email', jQuery($em).val());
        var b = jQuery('#bSelect option:selected').val(),
            bn = jQuery('#bSelect option:selected').text(),
            e = GM_getValue('email'),
            su = cm.getUrl(),
            tu = "http://www.webpagetest.org/runtest.php?",
            params = {
                k: "A.1b40e6dc41916bd77b0541187ac9e74b",
                runs: "3",
                fvonly: "1",
                notify: e,
                location: "Dulles" + b
            },
            newTab, dURL, mURL;

        jQuery.each(params, function (index, value) {
            tu += index + "=" + value + "&";
        });

        dURL = tu + "url=" + su + pn + "?device=immobile";
        mURL = tu + "url=" + su + pn + "?device=mobile";
        if (confirm('----------------------------------------\n' +
                'Test the Desktop and Mobile site?\n' +
                '----------------------------------------\n' +
                'Browser : ' + bn + '\n' +
                'Send Results To : ' + e + '\n' +
                '----------------------------------------') === true) {
            newTab = new GM_openInTab(dURL, true);
            newTab = new GM_openInTab(mURL, true);
        }
    });

    // ---------------------------------------- SEO Simplify ----------------------------------------
    $seo_butt.click(function () {
        var seoSimplify = (function () {

            var oems = [
                "Buick",
                "Cadillac",
                "Chevrolet",
                "GMC",
                "Hyundai",
                "Volkswagen"];

            var chevrolet = [];
            var Camaro = {
                name: "Camaro",
                url: "models/chevrolet-camaro"
            };
            chevrolet.push(Camaro);
            var SS = {
                name: "SS",
                url: "models/chevrolet-ss"
            };
            chevrolet.push(SS);
            var City_Express_Cargo_Van = {
                name: "City_Express_Cargo_Van",
                url: "models/chevrolet-cityexpresscargovan"
            };
            chevrolet.push(City_Express_Cargo_Van);
            var Colorado = {
                name: "Colorado",
                url: "models/chevrolet-colorado"
            };
            chevrolet.push(Colorado);
            var Corvette = {
                name: "Corvette",
                url: "models/chevrolet-corvette"
            };
            chevrolet.push(Corvette);
            var Cruze = {
                name: "Cruze",
                url: "models/chevrolet-cruze"
            };
            chevrolet.push(Cruze);
            var Cruze_Limited = {
                name: "Cruze_Limited",
                url: "models/chevrolet-cruzelimited"
            };
            chevrolet.push(Cruze_Limited);
            var Equinox = {
                name: "Equinox",
                url: "models/chevrolet-equinox"
            };
            chevrolet.push(Equinox);
            var Express_Cargo_Van = {
                name: "Express_Cargo_Van",
                url: "models/chevrolet-expresscargovan"
            };
            chevrolet.push(Express_Cargo_Van);
            var Express_Commercial_Cutaway = {
                name: "Express_Commercial_Cutaway",
                url: "models/chevrolet-expresscommercialcutaway"
            };
            chevrolet.push(Express_Commercial_Cutaway);
            var Express_Passenger = {
                name: "Express_Passenger",
                url: "models/chevrolet-expresspassenger"
            };
            chevrolet.push(Express_Passenger);
            var Impala = {
                name: "Impala",
                url: "models/chevrolet-impala"
            };
            chevrolet.push(Impala);
            var Malibu = {
                name: "Malibu",
                url: "models/chevrolet-malibu"
            };
            chevrolet.push(Malibu);
            var Malibu_Limited = {
                name: "Malibu_Limited",
                url: "models/chevrolet-malibulimited"
            };
            chevrolet.push(Malibu_Limited);
            var Silverado_1500 = {
                name: "Silverado_1500",
                url: "models/chevrolet-silverado1500"
            };
            chevrolet.push(Silverado_1500);
            var Silverado_2500HD = {
                name: "Silverado_2500HD",
                url: "models/chevrolet-silverado2500hd"
            };
            chevrolet.push(Silverado_2500HD);
            var Silverado_3500HD = {
                name: "Silverado_3500HD",
                url: "models/chevrolet-silverado3500hd"
            };
            chevrolet.push(Silverado_3500HD);
            var Sonic = {
                name: "Sonic",
                url: "models/chevrolet-sonic"
            };
            chevrolet.push(Sonic);
            var Spark = {
                name: "Spark",
                url: "models/chevrolet-spark"
            };
            chevrolet.push(Spark);
            var Suburban = {
                name: "Suburban",
                url: "models/chevrolet-suburban"
            };
            chevrolet.push(Suburban);
            var Tahoe = {
                name: "Tahoe",
                url: "models/chevrolet-tahoe"
            };
            chevrolet.push(Tahoe);
            var Traverse = {
                name: "Traverse",
                url: "models/chevrolet-traverse"
            };
            chevrolet.push(Traverse);
            var Trax = {
                name: "Trax",
                url: "models/chevrolet-trax"
            };
            chevrolet.push(Trax);
            var Volt = {
                name: "Volt",
                url: "models/chevrolet-volt"
            };
            chevrolet.push(Volt);

            var volkswagen = [];
            var Beetle_Convertible = {
                name: "Beetle_Convertible",
                url: "models/volkswagen-beetleconvertible"
            };
            volkswagen.push(Beetle_Convertible);
            var Beetle_Coupe = {
                name: "Beetle_Coupe",
                url: "models/volkswagen-beetlecoupe"
            };
            volkswagen.push(Beetle_Coupe);
            var CC = {
                name: "CC",
                url: "models/volkswagen-cc"
            };
            volkswagen.push(CC);
            var Eos = {
                name: "Eos",
                url: "models/volkswagen-eos"
            };
            volkswagen.push(Eos);
            var Golf = {
                name: "Golf",
                url: "models/volkswagen-golf"
            };
            volkswagen.push(Golf);
            var Golf_GTI = {
                name: "Golf_GTI",
                url: "models/volkswagen-golfgti"
            };
            volkswagen.push(Golf_GTI);
            var Golf_R = {
                name: "Golf_R",
                url: "models/volkswagen-golfr"
            };
            volkswagen.push(Golf_R);
            var Jetta_Sedan = {
                name: "Jetta_Sedan",
                url: "models/volkswagen-jettasedan"
            };
            volkswagen.push(Jetta_Sedan);
            var Passat = {
                name: "Passat",
                url: "models/volkswagen-passat"
            };
            volkswagen.push(Passat);
            var e_Golf = {
                name: "e_Golf",
                url: "models/volkswagen-egolf"
            };
            volkswagen.push(e_Golf);
            var Tiguan = {
                name: "Tiguan",
                url: "models/volkswagen-tiguan"
            };
            volkswagen.push(Tiguan);
            var Touareg = {
                name: "Touareg",
                url: "models/volkswagen-touareg"
            };
            volkswagen.push(Touareg);
            var Golf_SportWagen = {
                name: "Golf_SportWagen",
                url: "models/volkswagen-golfsportwagen"
            };
            volkswagen.push(Golf_SportWagen);

            var cadillac = [];
            var ATS_Coupe = {
                name: "ATS_Coupe",
                url: "models/cadillac-atscoupe"
            };
            cadillac.push(ATS_Coupe);
            var ATS_Sedan = {
                name: "ATS_Sedan",
                url: "models/cadillac-atssedan"
            };
            cadillac.push(ATS_Sedan);
            var ATS_V_Coupe = {
                name: "ATS_V_Coupe",
                url: "models/cadillac-atsvcoupe"
            };
            cadillac.push(ATS_V_Coupe);
            var ATS_V_Sedan = {
                name: "ATS_V_Sedan",
                url: "models/cadillac-atsvsedan"
            };
            cadillac.push(ATS_V_Sedan);
            var CT6_Sedan = {
                name: "CT6_Sedan",
                url: "models/cadillac-ct6sedan"
            };
            cadillac.push(CT6_Sedan);
            var CTS_Sedan = {
                name: "CTS_Sedan",
                url: "models/cadillac-ctssedan"
            };
            cadillac.push(CTS_Sedan);
            var CTS_V_Sedan = {
                name: "CTS_V_Sedan",
                url: "models/cadillac-ctsvsedan"
            };
            cadillac.push(CTS_V_Sedan);
            var ELR = {
                name: "ELR",
                url: "models/cadillac-elr"
            };
            cadillac.push(ELR);
            var Escalade = {
                name: "Escalade",
                url: "models/cadillac-escalade"
            };
            cadillac.push(Escalade);
            var Escalade_ESV = {
                name: "Escalade_ESV",
                url: "models/cadillac-escaladeesv"
            };
            cadillac.push(Escalade_ESV);
            var SRX = {
                name: "SRX",
                url: "models/cadillac-srx"
            };
            cadillac.push(SRX);
            var XTS = {
                name: "XTS",
                url: "models/cadillac-xts"
            };
            cadillac.push(XTS);

            var buick = [];
            var Cascada = {
                name: "Cascada",
                url: "models/buick-cascada"
            };
            buick.push(Cascada);
            var Enclave = {
                name: "Enclave",
                url: "models/buick-enclave"
            };
            buick.push(Enclave);
            var Encore = {
                name: "Encore",
                url: "models/buick-encore"
            };
            buick.push(Encore);
            var Envision = {
                name: "Envision",
                url: "models/buick-envision"
            };
            buick.push(Envision);
            var LaCrosse = {
                name: "LaCrosse",
                url: "models/buick-lacrosse"
            };
            buick.push(LaCrosse);
            var Regal = {
                name: "Regal",
                url: "models/buick-regal"
            };
            buick.push(Regal);
            var Verano = {
                name: "Verano",
                url: "models/buick-verano"
            };
            buick.push(Verano);

            var gmc = [];
            var Acadia = {
                name: "Acadia",
                url: "models/gmc-acadia"
            };
            gmc.push(Acadia);
            var Canyon = {
                name: "Canyon",
                url: "models/gmc-canyon"
            };
            gmc.push(Canyon);
            var Savana_Cargo_Van = {
                name: "Savana_Cargo_Van",
                url: "models/gmc-savanacargovan"
            };
            gmc.push(Savana_Cargo_Van);
            var Savana_Commercial_Cutaway = {
                name: "Savana_Commercial_Cutaway",
                url: "models/gmc-savanacommercialcutaway"
            };
            gmc.push(Savana_Commercial_Cutaway);
            var Savana_Passenger = {
                name: "Savana_Passenger",
                url: "models/gmc-savanapassenger"
            };
            gmc.push(Savana_Passenger);
            var Sierra_1500 = {
                name: "Sierra_1500",
                url: "models/gmc-sierra1500"
            };
            gmc.push(Sierra_1500);
            var Sierra_2500HD = {
                name: "Sierra_2500HD",
                url: "models/gmc-sierra2500hd"
            };
            gmc.push(Sierra_2500HD);
            var Sierra_3500HD = {
                name: "Sierra_3500HD",
                url: "models/gmc-sierra3500hd"
            };
            gmc.push(Sierra_3500HD);
            var Terrain = {
                name: "Terrain",
                url: "models/gmc-terrain"
            };
            gmc.push(Terrain);
            var Yukon = {
                name: "Yukon",
                url: "models/gmc-yukon"
            };
            gmc.push(Yukon);
            var Yukon_XL = {
                name: "Yukon_XL",
                url: "models/gmc-yukonxl"
            };
            gmc.push(Yukon_XL);

            var hyundai = [];
            var Accent = {
                name: "Accent",
                url: "models/hyundai-accent"
            };
            hyundai.push(Accent);
            var Azera = {
                name: "Azera",
                url: "models/hyundai-azera"
            };
            hyundai.push(Azera);
            var Elantra = {
                name: "Elantra",
                url: "models/hyundai-elantra"
            };
            hyundai.push(Elantra);
            var Elantra_GT = {
                name: "Elantra_GT",
                url: "models/hyundai-elantragt"
            };
            hyundai.push(Elantra_GT);
            var Genesis = {
                name: "Genesis",
                url: "models/hyundai-genesis"
            };
            hyundai.push(Genesis);
            var Genesis_Coupe = {
                name: "Genesis_Coupe",
                url: "models/hyundai-genesiscoupe"
            };
            hyundai.push(Genesis_Coupe);
            var Sonata = {
                name: "Sonata",
                url: "models/hyundai-sonata"
            };
            hyundai.push(Sonata);
            var Sonata_Hybrid = {
                name: "Sonata_Hybrid",
                url: "models/hyundai-sonatahybrid"
            };
            hyundai.push(Sonata_Hybrid);
            var Sonata_Plug_In_Hybrid = {
                name: "Sonata_Plug_In_Hybrid",
                url: "models/hyundai-sonatapluginhybrid"
            };
            hyundai.push(Sonata_Plug_In_Hybrid);
            var Veloster = {
                name: "Veloster",
                url: "models/hyundai-veloster"
            };
            hyundai.push(Veloster);
            var Santa_Fe = {
                name: "Santa_Fe",
                url: "models/hyundai-santafe"
            };
            hyundai.push(Santa_Fe);
            var Santa_Fe_Sport = {
                name: "Santa_Fe_Sport",
                url: "models/hyundai-santafesport"
            };
            hyundai.push(Santa_Fe_Sport);
            var Tucson = {
                name: "Tucson",
                url: "models/hyundai-tucson"
            };
            hyundai.push(Tucson);

            function getURL(makeModel) {
                var mArr = makeModel.split(' ');
                var make = "no match found",
                    model = "",
                    modelURL = "",
                    len = "",
                    ar = oems,
                    oLen = oems.length,
                    i = 0,
                    x = 0;
                if (mArr.length >= 3) {
                    for (var b = 1; b < mArr.length; b++) {
                        model += mArr[b];
                    }
                } else {
                    model = mArr[mArr.length - 1];
                }
                for (x; x < oLen; x++) {
                    if (mArr[0].indexOf(ar[x]) >= 0) {
                        make = ar[x];
                        break;
                    }
                }

                model = model.trim().toLowerCase();

                switch (make) {
                case "Chevrolet":
                    len = chevrolet.length;
                    i = 0;
                    for (i; i < len; i++) {
                        if (chevrolet[i].url.indexOf(model) >= 0) {
                            modelURL = chevrolet[i].url;
                            break;
                        }
                    }
                    return modelURL;
                case "GMC":
                    len = gmc.length;
                    i = 0;
                    for (i; i < len; i++) {
                        if (gmc[i].url.indexOf(model) >= 0) {
                            modelURL = gmc[i].url;
                            break;
                        }
                    }
                    return modelURL;
                case "Cadillac":
                    len = cadillac.length;
                    i = 0;
                    for (i; i < len; i++) {
                        if (cadillac[i].url.indexOf(model) >= 0) {
                            modelURL = cadillac[i].url;
                            break;
                        }
                    }
                    return modelURL;
                case "Hyundai":
                    len = hyundai.length;
                    i = 0;
                    for (i; i < len; i++) {
                        if (hyundai[i].url.indexOf(model) >= 0) {
                            modelURL = hyundai[i].url;
                            break;
                        }
                    }
                    return modelURL;
                case "Volkswagen":
                    len = volkswagen.length;
                    i = 0;
                    for (i; i < len; i++) {
                        if (volkswagen[i].url.indexOf(model) >= 0) {
                            modelURL = volkswagen[i].url;
                            break;
                        }
                    }
                    return modelURL;
                case "Buick":
                    len = buick.length;
                    i = 0;
                    for (i; i < len; i++) {
                        if (buick[i].url.indexOf(model) >= 0) {
                            modelURL = buick[i].url;
                            break;
                        }
                    }
                    return modelURL;
                default:
                }
            }

            function isUndefined(elem) {
                if (jQuery(elem).attr("title") !== undefined) {
                    return false;
                } else {
                    return true;
                }
            }

            function titleEmpty(elem) {
                if (jQuery(elem).attr("title") === "") {
                    return true;
                } else {
                    return false;
                }
            }

            function isURLUndefined(elem) {
                if (jQuery(elem).attr("href") !== undefined) {
                    return false;
                } else {
                    return true;
                }
            }

            function isURLEmpty(elem) {
                if (jQuery(elem).attr("href") === "") {
                    return true;
                } else {
                    return false;
                }
            }

            function emptyTarget(elem) {
                if ((jQuery(elem).attr("target") !== undefined) ||
                    (jQuery(elem).attr("target") === "")) {
                    jQuery(elem).removeAttr("target");
                }
            }

            function refineURL(url) {
                var ezURL = url.split('%'),
                    removeThese = ["LINKCONTEXTNAME", "LINKPAGENAME"],
                    nURL;
                ezURL = ezURL.filter(Boolean);
                nURL = ezURL[0].split('_');
                for (var i = 0; i < nURL.length; i++) {
                    for (var j = 0; j < removeThese.length; j++) {
                        if (nURL[i] === removeThese[j]) {
                            nURL.splice(i, 1);
                        }
                    }
                }
                var len = nURL.length,
                    x = 0,
                    findThis = "ModelDetails",
                    actualURL;
                for (x; x < len; x++) {
                    if (nURL[x] === findThis) {
                        actualURL = getURL(nURL[len - 1]);
                        return actualURL;
                    } else {
                        actualURL = nURL[0];
                        return actualURL;
                    }
                }
            }

            return {
                isUndefined: isUndefined,
                titleEmpty: titleEmpty,
                isURLUndefined: isURLUndefined,
                isURLEmpty: isURLEmpty,
                emptyTarget: emptyTarget,
                refineURL: refineURL
            };

        })();

        var ui = jQuery.trim(prompt('Enter Your SEO Text - HTML format')),
            $removeBut = jQuery('<input>').attr({
                type: 'button',
                value: 'REMOVE',
                id: 'removeDiv'
            }),
            $id = jQuery('<div>').attr({
                id: 'inputDisplay'
            }).css({
                padding: '10px'
            }),
            $ic = jQuery('<div>').attr({
                id: 'inputContainer'
            }).css({
                background: 'white',
                color: 'black'
            });

        jQuery($id)
            .append(ui)
            .prependTo(jQuery($ic)
                .prepend($removeBut)
                .prependTo('#content'));

        jQuery("#inputDisplay *").removeAttr("style");
        jQuery("#inputDisplay br").remove();
        jQuery("#inputDisplay").find("font").replaceWith(function () {
            return jQuery(this).html();
        });
        jQuery("#inputDisplay").find("span").replaceWith(function () {
            return jQuery(this).html();
        });
        jQuery("#inputDisplay").find("u").replaceWith(function () {
            return jQuery(this).html();
        });
        jQuery("#inputDisplay").find("center").replaceWith(function () {
            return jQuery("<p/>").append(jQuery(this).html());
        });
        jQuery("#inputDisplay").find(":empty").remove();

        var ar = jQuery("#inputDisplay a"),
            len = ar.length,
            i = 0;
        for (i; i < len; i++) {
            if (seoSimplify.isUndefined(ar[i]) || seoSimplify.titleEmpty(ar[i])) {
                var titleText = jQuery(ar[i]).text().toString().trim();
                jQuery(ar[i]).attr('title', titleText.substr(0, 1).toUpperCase() + titleText.substr(1));
            }

            if (seoSimplify.isURLUndefined(ar[i]) || seoSimplify.isURLEmpty(ar[i])) {
                jQuery(ar[i]).attr('href', '#');
            }

            var tu = jQuery(ar[i]).attr('href');
            jQuery(ar[i]).attr('href', seoSimplify.refineURL(tu));
            seoSimplify.emptyTarget(ar[i]);
        }

        function changeToTextarea() {
            var divHTML = jQuery(this).html(),
                $et = jQuery('<textarea>').css({
                    width: '100%',
                    height: '300px'
                });
            $et.html(divHTML);
            jQuery(this).replaceWith($et);
            $et.focus();
            $et.blur(revertDiv);
        }

        function revertDiv() {
            var textareaHTML = jQuery(this).val(),
                $vt = jQuery('<div>').attr({
                    id: 'inputDisplay'
                }).css({
                    padding: '10px'
                });
            $vt.html(textareaHTML);
            jQuery(this).replaceWith($vt);
            $vt.click(changeToTextarea);
        }

        $id.click(changeToTextarea);

        jQuery($removeBut).click(function () {
            jQuery("#inputContainer").remove();
        });
    });

    // ---------------------------------------- add widget outlines ----------------------------------------
    $wo_butt.click(function () {
        "use strict";
        jQuery(".masonry-brick").css({
            border: '1px dotted pink'
        });
        jQuery("div[class*=colorBlock]").css({
            'z - index': '-1'
        });

        jQuery('body .cell .CobaltEditableWidget').each(function () {
            var widgetID = jQuery(this).attr('id');
            var w = jQuery(this).width(),
                h = jQuery(this).height();
            jQuery(this).append(function () {
                jQuery(this).attr({
                    'data-content': widgetID + ' :: ' + w + 'px X ' + h + 'px'
                });
            });
        });

        jQuery("body .cell .CobaltWidget").each(function () {
            var widgetID = jQuery(this).attr('id');
            var w = jQuery(this).width(),
                h = jQuery(this).height();
            jQuery(this).append(function () {
                jQuery(this).attr({
                    'data-content': widgetID + " :: " + w + "px X " + h + "px"
                });
            });
        });
    });

    var $tb = jQuery('<div>').attr({
            id: 'myToolbox'
        }).css({
            'text-align': 'center',
            background: 'linear-gradient(to right, #a8e063 0%, #56ab2f 100%)',
            position: 'fixed',
            top: '10%',
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
        .append($m4mi)
        .append($ic_butt)
        .append($lc_butt)
        .append($sn_butt)
        .append($af_butt)
        .append($sc_butt)
        .append($wpt_butt)
        .append($wpti)
        .append($seo_butt)
        .append($wo_butt);

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

function ap(usingM4) {
    "use strict";
    if ((usingM4) && (cmv !== 'LIVE')) {
        if (window.location.href.indexOf('&comments=true&relative=true') === -1) {
            window.location.search += '&comments=true&relative=true';
        }
    }
}
