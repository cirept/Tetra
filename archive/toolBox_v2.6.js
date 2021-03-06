// ==UserScript==
// @name My Toolbox
// @namespace www.cobaltgroup.com/
// @include http:*
// @version 2.6
// @downloadURL http://media-dmg.assets-cdk.com/teams/repository/export/460/264509aae1005845e0050568ba825/460264509aae1005845e0050568ba825.js
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

/* TO DO - Eventually build a for loop to auto add button modules into the tool bar */
/* should make adding tools easier if implemented like this */

var cm = unsafeWindow.ContextManager,
    em = unsafeWindow.editMode,
    cmv = cm.getVersion(),
    sv = (cmv === 'WIP' || cmv === 'PROTO'), // || cmv === 'LIVE'
    wID = cm.getWebId(),
    pw = phoneWrapper();

if (!em && sv && !pw) {

    var $tbStyles = jQuery('<style>').attr({
        id: 'qa_toolbox',
        type: 'text/css'
    });

    jQuery($tbStyles)
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
        .append('.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 255, 255, 0) 26%, rgba(146, 232, 66, 0) 100%) !important; }')
        .append('.hasTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(146, 232, 66, 0.75) 26%, rgba(146, 232, 66, 0.75) 99%, rgba(146, 232, 66, 0.75) 100%) !important; }')
        .append('.noTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; }')
        .append('.emptyTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; }')
        .append('.linkChecked { background: rgba(96, 223, 229, .75) !important; color: white !important; }')
        .append('.CobaltEditableWidget:after { content: attr(data-content); position: absolute; top: 0; bottom: 0; left: 0; z-index: 100; height: 20px; margin: auto; background: rgba(96, 223, 229, .75); color: white; font-weight: bold; font-size: 10px; }')
        .append('.CobaltWidget:after { content: attr(data-content); position: absolute; top: 0; bottom: 0; left: 0; z-index: 100; height: 20px; margin: auto; background: rgba(96, 223, 229, .75); color: white; font-weight: bold; font-size: 10px; }')
        .append('.legendContent { color: black !important; line-height: 1em; font-size: 1em; height: 10%; margin: 10px; }')
        .append('.overlayDiv { position: relative; }');

    //create main buttons
    var $ic_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'imageChecker',
            title: 'Image Alt Checker'
        }).text('Image Alt Checker'),
        $lc_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'linkChecker',
            title: 'Check Title Text'
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
            title: 'Show Autofill Tags (Only the Homepage)'
        }).text('Show Autofill Tags'),
        $sc_butt = jQuery('<button>').attr({
            class: 'myEDOBut',
            id: 'spellCheck',
            title: 'Check Spelling (Only the Homepage)'
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

    //create miltstone 4 checkbox
    var $m4ModuleInput = jQuery('<div>').attr({
            id: 'm4Input'
        }).css({
            'padding': '7px 0 0 0'
        }),
        usingM4module = GM_getValue('usingM4', false), //tampermonkey (variableName, defaultValue)
        $m4Label = jQuery("<label>").attr({
            for: 'myCheckbox'
        }).text('Using m4 Modules?').css({
            display: 'inline-block',
            'vertical-align': 'super'
        }),
        $m4checkbox = jQuery('<input>').attr({
            type: 'checkbox',
            id: 'm4Checkbox',
            name: 'm4Checkbox',
            checked: usingM4module
        }).css({
            width: '20px',
            height: '20px'
        });

    //check if using milestone 4 modules
    addParameter(usingM4module);
    jQuery($m4checkbox).click(function () {
        var checked = jQuery('#m4Checkbox').attr('checked');
        GM_setValue('usingM4', checked);
        //adds relative path to current url if it doesn't exist
        addParameter(checked);
    });

    // build milestone 4 input
    $m4ModuleInput.append($m4Label).append($m4checkbox);

    //create input for email
    var dEmail = GM_getValue('email', 'your.name@cdk.com'), //tampermonkey func(variableName, defaultValue)
        $emTitle = jQuery('<div>').text('Enter your email'),
        $em = jQuery('<input>').attr({
            id: 'email',
            type: 'text',
            value: dEmail
        }).css({
            margin: '5px 0px',
            width: '85%'
        }),
        $wptInput = jQuery('<div>').attr({
            id: 'wptInput'
        }).css({
            padding: '5px'
        }),
        myOptions = {
            '_IE11': 'IE11',
            ':Chrome': 'Chrome',
            ':FireFox': 'Firefox'
        };

    //create drop down menu for WPT
    var $browserOptions = jQuery('<select>').attr({
            id: 'bSelect'
        }).css({
            margin: '5px 0',
            width: '90%'
        }),
        $browserTitle = jQuery('<div>').text('Choose a Browser');

    jQuery.each(myOptions, function (val, text) {
        $browserOptions.append(jQuery('<option></option>').val(val).html(text));
    });
    //build input panel
    jQuery($wptInput)
        .append($emTitle)
        .append($em)
        .append($browserTitle)
        .append($browserOptions);

    // ---------------------------------------- web-id panel ----------------------------------------
    var $webID = jQuery('<div>').attr({
        title: 'Copy web-id'
    }).css({
        clear: 'both',
        background: 'white',
        cursor: 'pointer',
        padding: '5px 0'
    }).text(wID);

    jQuery($webID).click(function () {
        var webID = jQuery(this).html();
        GM_setClipboard(webID, 'text');
    });

    // ---------------------------------------- image checker ----------------------------------------
    $ic_butt.click(function () {
        var $icLegend = jQuery('<div>').attr({
                id: 'linkLegend'
            }).css({
                background: 'white',
                'border': '3px solid black',
                'width': '200px',
                'position': 'fixed',
                'bottom': '25%',
                'left': '75px',
                'z-index': '100000',
                'text-align': 'center',
                'padding': '10px'
            }),
            $icLegend_title = jQuery('<div>').attr({
                id: 'linkLegendTitle'
            }).text('Image Checker Legend'),
            $icLegend_noAlt = jQuery('<div>').attr({
                class: 'legendContent noAlt'
            }).text('HAS NO alt text'),
            $isLegend_hasAlt = jQuery('<div>').attr({
                class: 'legendContent hasAlt'
            }).text('HAS alt text'),
            $ic_rf_butt = jQuery('<input>').attr({
                type: 'button',
                class: 'myButton',
                value: 'Remove'
            }).css({
                width: '90%',
                height: '50px'
            });

        // add functionality to remove features button
        $ic_rf_butt.click(removeFeatures);

        // add div overlay with image alt text to all images
        var $imgArr = jQuery("body img"),
            iaLength = $imgArr.length,
            a = 0;
        for (a; a < iaLength; a++) {
            var isImageLink = true;
            var w = jQuery($imgArr[a]).width(),
                h = jQuery($imgArr[a]).height();
            addDivOverlay($imgArr[a], w, h);

            // check alt tags
            if (jQuery($imgArr[a]).attr("alt") !== undefined) {
                if (jQuery($imgArr[a]).attr("alt") === '') {
                    if (isImageLink) {
                        jQuery($imgArr[a]).siblings(".imgOverlay").addClass("emptyAlt");
                    } else {
                        jQuery($imgArr[a]).addClass("emptyAlt");
                    }
                } else {
                    if (isImageLink) {
                        jQuery($imgArr[a]).siblings(".imgOverlay").addClass("hasAlt");
                        jQuery($imgArr[a]).siblings(".imgOverlay").attr("title", jQuery($imgArr[a]).attr("alt"));
                    } else {
                        jQuery($imgArr[a]).addClass("hasAlt");
                    }
                }
            } else {
                if (isImageLink) {
                    jQuery($imgArr[a]).siblings(".imgOverlay").addClass("noAlt");
                } else {
                    jQuery($imgArr[a]).addClass("noAlt");
                }
            }
        } // end for loop

        // build legend
        jQuery($icLegend)
            .append($icLegend_title)
            .append($icLegend_noAlt)
            .append($isLegend_hasAlt)
            .append($ic_rf_butt);

        // attach legend to body
        jQuery("#content").append($icLegend);

        // remove functionality
        function removeFeatures() {
            $imgArr = jQuery("body img"); // update img array
            iaLength = $imgArr.length; // get new length
            a = 0; // reset counter
            // remove custom classes
            for (a; a < iaLength; a++) {
                jQuery($imgArr[a])
                    .removeClass("opensWindow")
                    .removeClass("emptyAlt")
                    .removeClass("hasAlt")
                    .removeClass("noAlt")
                    .removeClass('overlayDiv');
            }
            jQuery("body").find(".imgOverlay").remove(); // remove custom divs
            $icLegend.remove(); // remove legend
            jQuery(this).remove(); // remove button
        }
        // add div overlay
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
                'line-height': height + 'px'
            }).append(imageAlt);
            jQuery($imageOverlay).insertBefore(jQuery(elem).addClass('overlayDiv'));
        }
    });

    // ---------------------------------------- link checker ----------------------------------------
    $lc_butt.click(function () {

        var $lc_checked = jQuery('<span>').css({
                position: 'absolute',
                left: '5px',
                color: 'white'
            }),
            $checkMark = jQuery('<i>').attr({
                class: 'fa fa-check-circle fa-3x'
            }),
            $lcLegend = jQuery('<div>').attr({
                id: 'linkLegend;'
            }).css({
                background: 'white',
                border: '3px solid black',
                width: '200px',
                position: 'fixed',
                bottom: '25%',
                left: '75px',
                'z-index': '10000',
                'text-align': 'center',
                padding: '10px'
            }),
            $lcLegend_title = jQuery('<div>').attr({
                id: 'linkLegendTitle'
            }).text('Link Checker Legend'),
            $lcLegend_noTitle = jQuery('<div>').attr({
                class: 'legendContent noTitle'
            }).text('HAS NO title text'),
            $lcLegend_hasTitle = jQuery('<div>').attr({
                class: 'legendContent hasTitle'
            }).text('HAS title text'),
            $lcLegend_opensWindow = jQuery('<div>').attr({
                class: 'legendContent opensWindow'
            }).text('OPENS IN A NEW WINDOW'),
            $ic_remove_butt = jQuery('<input>').attr({
                type: 'button',
                class: 'myButton',
                value: 'Remove'
            }).css({
                width: '90%',
                height: '50px'
            });

        jQuery($lc_checked).append($checkMark);
        // remove all features of link checker
        function removeLCfeatures() {
            b = 0; // reset counter
            for (b; b < laLength; b++) {
                jQuery($linkArr[b])
                    .removeClass("opensWindow")
                    .removeClass("emptyTitle")
                    .removeClass("hasTitle")
                    .removeClass("noTitle")
                    .removeClass("linkChecked")
                    .removeClass('overlayDiv');
            }
            jQuery("body").find(".linkOverlay").remove();
            $lcLegend.remove();
            jQuery(this).remove();
        }

        // add checkmark
        function bindClickAction(isImage) {
            return function () {
                if (isImage) {
                    jQuery(this).find('.linkOverlay').addClass('linkChecked').append($lc_checked);
                } else {
                    jQuery(this).addClass('linkChecked');
                }
            };
        }

        // add div overlay
        function addLinkDiv(elem, width, height) {
            var $linkOverlay = jQuery('<div>').attr({
                    class: 'linkOverlay'
                }).css({
                    width: width + 'px',
                    height: height + 'px',
                    'text-align': 'center',
                    'vertical-align': 'middle',
                    'line-height': height + 'px',
                    'z-index': '1000'
                }),
                linkTitle = jQuery(elem).attr('title');
            // adds title text to image links only
            jQuery($linkOverlay).append(linkTitle);
            jQuery(elem).addClass('overlayDiv').prepend($linkOverlay);
        }

        // check targets
        function checkTarget(elem) {
            if ((jQuery(elem).attr("target") === "_blank") || (jQuery(elem).attr("target") === "_new")) {
                return true;
            }
        }

        // add functionality to remove feature button
        jQuery($ic_remove_butt).click(removeLCfeatures);

        // build legend
        jQuery($lcLegend)
            .append($lcLegend_title)
            .append($lcLegend_noTitle)
            .append($lcLegend_hasTitle)
            .append($lcLegend_opensWindow)
            .append($ic_remove_butt);

        // add legend to body
        jQuery("#content").append($lcLegend);

        // do stuff to the links on the page
        var $linkArr = jQuery("body a"),
            laLength = $linkArr.length,
            b = 0;
        for (b; b < laLength; b++) {
            var isImageLink = false;
            // overlay div on image links
            if ((jQuery($linkArr[b]).has("img").length)) {
                var w = jQuery($linkArr[b]).has("img").width(),
                    h = jQuery($linkArr[b]).height();
                addLinkDiv($linkArr[b], w, h);
                isImageLink = true;
            }
            jQuery($linkArr[b]).click(bindClickAction(isImageLink));

            // check targets of links
            if (checkTarget($linkArr[b])) {
                if (isImageLink) {
                    jQuery($linkArr[b]).find(".linkOverlay").addClass("opensWindow");
                } else {
                    jQuery($linkArr[b]).addClass("opensWindow");
                }
            }
            // check link titles
            if (jQuery($linkArr[b]).attr("title") !== undefined) {
                if (jQuery($linkArr[b]).attr("title") === '') {
                    if (isImageLink) {
                        jQuery($linkArr[b]).find(".linkOverlay").addClass("emptyTitle");
                    } else {
                        jQuery($linkArr[b]).addClass("emptyTitle");
                    }
                } else {
                    if (isImageLink) {
                        jQuery($linkArr[b]).find(".linkOverlay").addClass("hasTitle");
                    } else {
                        jQuery($linkArr[b]).addClass("hasTitle");
                    }
                }
            } else {
                if (isImageLink) {
                    jQuery($linkArr[b]).find(".linkOverlay").addClass("noTitle");
                } else {
                    jQuery($linkArr[b]).addClass("noTitle");
                }
            }
        } // end for loop
    });

    // ---------------------------------------- Show Navigation (highlight major pages) ----------------------------------------
    $sn_butt.click(function () {
        var s = 0,
            $nav = jQuery('#pmenu'),
            $nav_tabs = jQuery($nav).find('ul'),
            $nav_tab_links = jQuery($nav_tabs).find('a[href]'),
            nlLength = $nav_tab_links.length,
            $remove_butt = jQuery('<input>').attr({
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

        // highlight all major pages
        jQuery($nav).find('a[href*=Form], a[href*=ContactUs], a[href=HoursAndDirections], a[href*=VehicleSearchResults]').css({
            background: 'pink',
            color: 'white'
        });

        //add functionality to remove button
        jQuery($remove_butt).click(function () {
            var $navMenu = jQuery('#pmenu'),
                $navMenu_items = jQuery($navMenu).find('ul'),
                $navMenu_links = jQuery($navMenu).find('a'),
                f = 0,
                nml = $navMenu_links.length;
            jQuery($navMenu_items).removeClass('showNav');
            for (f; f < nml; f++) {
                jQuery($navMenu_links[f]).removeAttr('style');
            }
            jQuery(this).remove();
        });

        // add class to show all nav items
        jQuery($nav_tabs).addClass('showNav');

        // add color
        function bindClick() {
            return function () {
                jQuery(this).css({
                    background: 'rgba(96,223,229,1)',
                    color: 'white'
                });
            };
        }
        // add click function to all links in navigation
        for (s; s < nlLength; s++) {
            jQuery($nav_tab_links[s]).click(bindClick());
        }

        jQuery('#content').append($remove_butt);
    });

    // ---------------------------------------- Show Autofill Tags ----------------------------------------
    $af_butt.click(function () {
        var x = "?disableAutofill=true",
            z = cm.getUrl(),
            newTab;
        newTab = GM_openInTab(z + x, 'active');
    });

    // ---------------------------------------- Spell Check ----------------------------------------
    $sc_butt.click(function () {
        var scSite = "https://www.w3.org/2002/01/spellchecker?",
            param = {
                uri: encodeURIComponent(cm.getUrl()),
                lang: "en_US"
            },
            newTab;
        jQuery.each(param, function (index, value) {
            scSite += index + '=' + value + "&";
        });
        // open new tab with focus
        newTab = GM_openInTab(scSite, 'insert');
    });

    // ---------------------------------------- Test WebPage ----------------------------------------
    $wpt_butt.click(function () {
        GM_setValue('email', jQuery($em).val()); // tampermonkey (variableName, value)
        var browser = jQuery('#bSelect option:selected').val(), // get value from drop down
            bName = jQuery('#bSelect option:selected').text(),
            email = GM_getValue('email'),
            siteURL = cm.getUrl(),
            testURL = "http://www.webpagetest.org/runtest.php?",
            params = {
                k: "A.1b40e6dc41916bd77b0541187ac9e74b",
                runs: "3",
                fvonly: "1",
                notify: email,
                location: "Dulles" + browser
            },
            newTab, dURL, mURL;

        // build urls
        jQuery.each(params, function (index, value) {
            testURL += index + "=" + value + "&";
        });

        dURL = testURL + "url=" + siteURL + "?device=immobile";
        mURL = testURL + "url=" + siteURL + "?device=mobile";
        if (confirm('----------------------------------------\n' +
                'Test the Desktop and Mobile site?\n' +
                '----------------------------------------\n' +
                'Browser : ' + bName + '\n' +
                'Send Results To : ' + email + '\n' +
                '----------------------------------------') === true) {
            newTab = GM_openInTab(dURL, true);
            newTab = GM_openInTab(mURL, true);
        }
    });

    // ---------------------------------------- SEO Simplify ----------------------------------------
    $seo_butt.click(function () {
        var seoSimplify = (function () {

            // ----------------------------------------
            // arrays
            // ----------------------------------------
            var oems = [
                //"Acura",
                //"Alfa Romeo",
                //"Aston Martin",
                //"Audi",
                //"BMW",
                //"Bentley",
                "Buick",
                "Cadillac",
                "Chevrolet",
                //"Chrysler",
                //"Dodge",
                //"FIAT",
                //"Ferrari",
                //"Ford",
                //"Freightliner",
                "GMC",
                //"Honda",
                "Hyundai",
                //"Infiniti",
                //"Isuzu",
                //"Jaguar",
                //"Jeep",
                //"Kia",
                //"LINCOLN",
                //"Lamborghini",
                //"Land Rover",
                //"Lexus",
                //"MINI",
                //"Maserati",
                //"Mazda",
                //"McLaren",
                //"Mercedes-Benz",
                //"Mitsubishi",
                //"Nissan",
                //"Porsche",
                //"Ram",
                //"Rolls-Royce",
                //"Scion",
                //"Smart",
                //"Subaru",
                //"Tesla",
                //"Toyota",
                //"Volvo"],
                "Volkswagen"];


            // Chevrolet
            // ----------------------------------------
            var chevrolet = [];
            var Camaro = {
                name: "Camaro",
                url: "models/chevrolet-camaro"
            };
            var SS = {
                name: "SS",
                url: "models/chevrolet-ss"
            };
            chevrolet.push(SS);
            chevrolet.push(Camaro);
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


            // vDub
            // ----------------------------------------
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

            // Cadillac
            // ----------------------------------------
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

            // Buick
            // ----------------------------------------
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

            // GMC
            // ----------------------------------------
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

            // Hyundai
            // ----------------------------------------
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

            // ----------------------------------------
            // functions
            // ----------------------------------------

            // find vehicle match and get url
            function getURL(makeModel) {
                // find correct OEM array to search through
                var mArr = makeModel.split(' ');
                var make = "no match found",
                    model = "",
                    modelURL = "",
                    len = "",
                    ar = oems,
                    oLen = oems.length,
                    i = 0,
                    x = 0;
                // build model name
                if (mArr.length >= 3) {
                    for (var b = 1; b < mArr.length; b++) {
                        model += mArr[b];
                    }
                } else {
                    model = mArr[mArr.length - 1];
                }
                // iterate through oem array to find match
                for (x; x < oLen; x++) {
                    if (mArr[0].indexOf(ar[x]) >= 0) {
                        // set make to OEM string if match is found
                        make = ar[x];
                        break;
                    }
                }

                // get model variable ready for userInput
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

            // ---------------------------------------- make these public

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

            function emptyTarget(elem) {
                if ((jQuery(elem).attr("target") !== undefined) && (jQuery(elem).attr("target") === "")) {
                    jQuery(elem).removeAttr("target");
                }
            }

            function refineURL(url) {
                // combine url refinement
                var ezURL = url.split('%'),
                    removeThese = ["LINKCONTEXTNAME", "LINKPAGENAME"],
                    nURL;
                // should result in only one object in the array
                ezURL = ezURL.filter(Boolean);
                nURL = ezURL[0].split('_');
                // remove ugly stuff
                for (var i = 0; i < nURL.length; i++) {
                    for (var j = 0; j < removeThese.length; j++) {
                        if (nURL[i] === removeThese[j]) {
                            nURL.splice(i, 1);
                        }
                    }
                }
                // return input of URL
                var len = nURL.length,
                    x = 0,
                    findThis = "ModelDetails",
                    actualURL;
                for (x; x < len; x++) {
                    if (nURL[x] === findThis) {
                        // returns the Make and Model if link is model details
                        actualURL = getURL(nURL[len - 1]);
                        return actualURL;
                    } else {
                        // return the base URL if NOT model details link
                        actualURL = nURL[0];
                        return actualURL;
                    }
                }
            }

            return {
                isUndefined: isUndefined,
                titleEmpty: titleEmpty,
                emptyTarget: emptyTarget,
                refineURL: refineURL
            };

        })();

        var userInput = jQuery.trim(prompt('Enter Your SEO Text - HTML format')),
            $removeBut = jQuery('<input>').attr({
                type: 'button',
                value: 'REMOVE',
                id: 'removeDiv'
            }),
            $inputDisplay = jQuery('<div>').attr({
                id: 'inputDisplay'
            }).css({
                padding: '10px'
            }),
            $inputContainer = jQuery('<div>').attr({
                id: 'inputContainer'
            }).css({
                background: 'white',
                color: 'black'
            });

        jQuery($inputDisplay)
            .append(userInput)
            .prependTo(jQuery($inputContainer)
                .prepend($removeBut)
                .prependTo('#content'));
        jQuery("#inputDisplay *").removeAttr("style");
        jQuery("#inputDisplay br").remove();

        // beautify text links loop
        var ar = jQuery("#inputDisplay a"),
            len = ar.length,
            i = 0;
        for (i; i < len; i++) {
            // add title attribute if link does not have one or is blank
            if (seoSimplify.isUndefined(ar[i]) || seoSimplify.titleEmpty(ar[i])) {
                var titleText = jQuery(ar[i]).text().toString().trim();
                jQuery(ar[i]).attr('title', titleText.substr(0, 1).toUpperCase() + titleText.substr(1));
            }
            // replaces ugly model details links with the shortened version
            var testURL = jQuery(ar[i]).attr('href');
            jQuery(ar[i]).attr('href', seoSimplify.refineURL(testURL));
            seoSimplify.emptyTarget(ar[i]);
        }
        //  remove font tags
        jQuery("#inputDisplay").find("font").replaceWith(function () {
            "use strict";
            return jQuery(this).html();
        });
        // remove span tags
        jQuery("#inputDisplay").find("span").replaceWith(function () {
            "use strict";
            return jQuery(this).html();
        });
        // remove center tags and replace with p tag
        jQuery("#inputDisplay").find("center").replaceWith(function () {
            "use strict";
            return jQuery("<p/>").append(jQuery(this).html());
        });
        // remove empty tags
        jQuery("#inputDisplay").find(":empty").remove();
        // convert div to text area
        function changeToTextarea() {
            var divHTML = jQuery(this).html(),
                $editableText = jQuery('<textarea>').css({
                    width: '100%',
                    height: '300px'
                });
            $editableText.html(divHTML);
            jQuery(this).replaceWith($editableText);
            $editableText.focus();
            $editableText.blur(revertDiv);
        }

        function revertDiv() {
            var textareaHTML = jQuery(this).val(),
                $viewableText = jQuery('<div>').attr({
                    id: 'inputDisplay'
                }).css({
                    padding: '10px'
                });
            $viewableText.html(textareaHTML);
            jQuery(this).replaceWith($viewableText);
            $viewableText.click(changeToTextarea);
        }

        $inputDisplay.click(changeToTextarea);
        // remove button
        jQuery($removeBut).click(function () {
            "use strict";
            jQuery("div#inputContainer").remove();
        });
    });

    // ---------------------------------------- add widget outlines ----------------------------------------
    $wo_butt.click(function () {
        jQuery(".masonry-brick").css("border", "1px dotted pink");
        jQuery("div[class*=colorBlock]").css("z-index", "-1");
        // add outline to every widget
        jQuery("body .cell .CobaltEditableWidget").each(function () {
            var widgetID = jQuery(this).attr("id");
            var w = jQuery(this).width(),
                h = jQuery(this).height();
            jQuery(this).append(function () {
                jQuery(this).attr({
                    'data-content': widgetID + ' :: ' + w + 'px X ' + h + 'px'
                });
            });
        });
        // add outline to spacers
        jQuery("body .cell .CobaltWidget").each(function () {
            var widgetID = jQuery(this).attr("id");
            var w = jQuery(this).width(),
                h = jQuery(this).height();
            jQuery(this).append(function () {
                jQuery(this).attr("data-content", widgetID + " :: " + w + "px X " + h + "px");
            });
        });
    });

    // ----------------------------------------
    // functionality of toolbox end
    // ----------------------------------------
    // build tool box and add to page
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
            'z-index': '100000'
        }),
        $tbTitle = jQuery('<div>').css({
            color: 'white',
            padding: '5px'
        }).text('QA Toolbox');

    // Build toolbox
    jQuery($tb)
        .append($tbTitle)
        .append($webID)
        .append($m4ModuleInput)
        .append($ic_butt)
        .append($lc_butt)
        .append($sn_butt)
        .append($af_butt)
        .append($sc_butt)
        .append($wpt_butt)
        .append($wptInput)
        .append($seo_butt)
        .append($wo_butt);

    // style even buttons
    jQuery($tb).children('.myEDOBut:even').css({
        background: 'linear-gradient(to left,#00d2ff 0,#3a7bd5 100%)'
    });

    // style odd buttons
    jQuery($tb).children('.myEDOBut:odd').css({
        background: 'linear-gradient(to left, #4b6cb7 0px, #182848 100%)'
    });

    // add toolbox to site
    jQuery('head').append($tbStyles);
    jQuery('body').append($tb);
}

function phoneWrapper() {
    if (jQuery('body .phone-wrapper').length > 0) {
        return true;
    } else {
        return false;
    }
}

//universal add parameter function for m4 modules
function addParameter(usingM4) {
    if (usingM4) {
        //adds relative path to current url if it doesn't exist
        if (window.location.href.indexOf('&comments=true&relative=true') === -1) {
            window.location.search += '&comments=true&relative=true';
        }
    }
}
