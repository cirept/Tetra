/*global jQuery */

var linkChecker = {
    init: function () {
        this.createElements();
        this.cacheDOM();
        this.buildLegend();
        this.addTool();
        this.bindEvents();
        this.addStyles();
    },
    // main functions
    createElements: function () {
        linkChecker.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'linkChecker',
                title: 'Check Links'
            }).text('Link Checker'),
            $legend: jQuery('<div>').attr({
                class: 'legend'
            }).css({
                background: 'white',
                'border': '1px solid black',
                display: 'none',
                'text-align': 'center',
                'padding': '5px',
                margin: '5px 0px'
            }),
            $legendTitle: jQuery('<div>').attr({
                class: 'legendTitle'
            }).text('Link Checker Legend'),
            $legendList: jQuery('<ul>').attr({
                class: 'legendList'
            }).css({
                'list-style-type': 'none',
                margin: '10px 0px',
                padding: '0'
            }),
            $legendContent: {
                'noTitle': 'No Title Text',
                'hasTitle': 'Has Title Text',
                'opensWindow': 'Opens In A New Window',
                'brokenURL': 'Empty URL',
                'urlIssue': 'Double Check URL',
                'linkChecked': 'Clicked Link',
            },
            $offButt: jQuery('<input>').attr({
                type: 'button',
                class: 'myButton',
                value: 'Turn Off'
            }).css({
                width: '90%',
                height: '50px'
            })
        };
    },
    cacheDOM: function () {
        this.$allLinks = jQuery('body').find('a');
        this.$allImageLinks = this.$allLinks.find('img');
        this.linksArrayLength = this.$allLinks.length;
        this.imageLinksArrayLength = this.$allImageLinks.length;
        this.$toolbarStyles = jQuery('#qa_toolbox');
        this.$toolsPanel = jQuery('#toolsPanel');
    },
    buildLegend: function () {
        linkChecker.config.$legend
            // attach legend title
            .append(linkChecker.config.$legendTitle)
            // attach list
            .append(linkChecker.config.$legendList)
            // attach turn off button
            .append(linkChecker.config.$offButt);
        // fill list
        this.buildLegendContent();
    },
    addTool: function () {
        this.$toolsPanel.append(linkChecker.config.$activateButt);
        this.$toolsPanel.append(linkChecker.config.$legend);
    },
    bindEvents: function () {
        // main button
        linkChecker.config.$activateButt.on('click', this.checkLinks.bind(this));
        linkChecker.config.$activateButt.on('click', this.showLegend);
        linkChecker.config.$activateButt.on('click', this.toggleDisable);
        // off button
        linkChecker.config.$offButt.on('click', this.removeHighlights.bind(this));
        linkChecker.config.$offButt.on('click', this.showLegend);
        linkChecker.config.$offButt.on('click', this.toggleDisable);
        linkChecker.config.$offButt.on('click', this.unbindClicks.bind(this));
    },
    addStyles: function () {
        // apply module styles to main tool bar style tag
        this.$toolbarStyles
            // styles of colored overlay placed on images
            .append('.imageCheckerOverlay { color: #000000 !important; font-weight: bold; text-align: center; vertical-align: middle; }')
            // allow proper displaying of color overlay on images
            .append('.overlaid { position: relative; }')
            // image overlay styles
            .append('.imgOverlay { color: black; font-size: 15px; font-weight: bold; text-align: center; position: absolute; top: 0; left: 0; z-index: 1; }')
            // link styles
            .append('.noTitle { background: rgba(255, 124, 216, .75) !important; }')
            .append('.hasTitle { background: rgba(146, 232, 66, .75) !important; }')
            .append('.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 255, 255, 0) 26%, rgba(146, 232, 66, 0) 100%) !important; }')
            .append('.hasTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(146, 232, 66, 0.75) 26%, rgba(146, 232, 66, 0.75) 99%, rgba(146, 232, 66, 0.75) 100%) !important; }')
            .append('.noTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; }')
            .append('.emptyTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; }')
            .append('.brokenURL { background: rgba(255, 55, 60, .75) !important; }')
            .append('.urlIssue { -moz-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); -webkit-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); }')
            .append('.siteLink.linkChecked { background: linear-gradient(to left, rgba(161, 255, 206, 0.75) , rgba(250, 255, 209, 0.75)) !important; color: #999999 !important; }')
            // end of addStyles
        ; // end
    },
    // secondary functions
    cacheLegendContentElement: function (addClass) {
        // instantiate li element
        //        this.$listItem = jQuery('<li>').attr({
        //            class: 'legendContent ' + addClass
        //        });
        var $listItem = jQuery('<li>').attr({
            class: 'legendContent ' + addClass
        });
        return $listItem;
    },
    buildLegendContent: function () {
        var key;

        // loop through Legend Content list
        for (key in linkChecker.config.$legendContent) {
            var value = linkChecker.config.$legendContent[key],
                $listItem = this.cacheLegendContentElement(value);
            // attach to legend list
            linkChecker.config.$legendList.append($listItem);
        }
    },
    checkLinks: function () {
        var length = this.linksArrayLength,
            a = 0;

        // loop through allImages and check for title text
        for (a; a < length; a++) {
            var $currentLink = jQuery(this.$allLinks[a]),
                $image = $currentLink.find('img'),
                isImageLink = this.isImageLink($image);
            // add default class
            this.togClass($currentLink, 'siteLink');
            // determines if link is an image link
            if (isImageLink) {
                this.addDivOverlay($currentLink, $image);
                // adds class to div overlay
                if (this.checkTarget($currentLink)) {
                    this.togClass(this.$divOverlay, 'opensWindow');
                }
            }
            // check if link opens in a new window
            if (this.checkTarget($currentLink)) {
                this.togClass($currentLink, 'opensWindow');
            }
            // check for title text
            this.checkForTitleText($currentLink, isImageLink);
            this.checkURL($currentLink, isImageLink);

            // bind click event
            $currentLink.on('click', this.linkChecked($currentLink, isImageLink));
        }
    },
    unbindClicks: function () {
        var i = 0,
            length = this.linksArrayLength;
        for (i; i < length; i++) {
            jQuery(this.$allLinks[i]).off('click');
        }
    },
    linkChecked: function ($currentLink) {
        return function () {
            $currentLink.toggleClass('linkChecked');
        };
    },
    isImageLink: function ($image) {
        // console.log('is there an image : ', $image);
        if ($image.length) {
            return true;
        } else {
            return false;
        }
    },
    cacheDOMOverlayElements: function ($currentLink, $currentImage) {
        this.linkTitle = jQuery($currentLink).attr('title');
        // gets sizing of images
        this.widthOfImage = jQuery($currentImage).width();
        this.heightOfImage = jQuery($currentImage).height();
    },
    addDivOverlay: function ($currentLink, $currentImage) {
        this.cacheDOMOverlayElements($currentLink, $currentImage);
        this.createOverlayElements();
        this.buildOverlayElements();
        this.attachToImage($currentImage);
    },
    checkForTitleText: function ($currentLink, isImageLink) {
        // find first case that returns true
        switch (true) {
            // undefined title or empty title
        case ($currentLink.attr('title') === undefined || $currentLink.attr('title') === ''):
            if (isImageLink) {
                this.togClass(this.$divOverlay, 'noTitle');
            } else {
                this.togClass($currentLink, 'noTitle');
            }
            break;
            // has title
        case ($currentLink.attr('title') !== ''):
            if (isImageLink) {
                this.togClass(this.$divOverlay, 'hasTitle');
            } else {
                this.togClass($currentLink, 'hasTitle');
            }
            break;
            // log the image element that breaks the program
        default:
            console.log('title checker failure');
            console.log($currentLink);
            break;
        }
    },
    checkURL: function ($currentLink, isImageLink) {
        var href = $currentLink.attr('href');
        switch (true) {
            // no href
        case (href === undefined):
            if (isImageLink) {
                this.togClass(this.$divOverlay, 'brokenURL');
            } else {
                this.togClass($currentLink, 'brokenURL');
            }
            break;
            // empty href
        case (href === ''):
            if (isImageLink) {
                this.togClass(this.$divOverlay, 'brokenURL');
            } else {
                this.togClass($currentLink, 'brokenURL');
            }
            break;
            // url issue
        case (this.checkHref(href)):
            if (isImageLink) {
                this.togClass(this.$divOverlay, 'urlIssue');
            } else {
                this.togClass($currentLink, 'urlIssue');
            }
            break;
            // url is good to go
        default:
            break;
        }
    },
    checkTarget: function ($currentLink) {
        if (($currentLink.attr("target") === "_blank") || ($currentLink.attr("target") === "_new")) {
            return true;
        }
    },
    // checks URL if its 'special'
    checkHref: function (elem) {
        if ((elem.indexOf('#') === 0) ||
            (elem.indexOf('f_') === 0) ||
            (elem.indexOf('www') >= 0) ||
            (elem.indexOf('http') >= 0) ||
            (elem.indexOf('//:') >= 0)) {
            return true;
        } else {
            return false;
        }
    },
    removeClass: function (array, removeClass) { // toggle custom class
        var arrlength = array.length,
            a = 0;
        for (a; a < arrlength; a++) {
            var $obj = jQuery(array[a]);
            $obj.removeClass(removeClass);
        }
    },
    removeHighlights: function () {
        var key;
        // removes special overlay class on images
        for (key in linkChecker.config.$legendContent) {
            this.removeClass(this.$allLinks, key);
        }
        // remove div overlay
        jQuery('.imgOverlay').remove();
        // remove overlaid class
        this.removeClass(this.$allImageLinks, 'overlaid');
        // turn off custom link class
        this.removeClass(this.$allLinks, 'siteLink');
    },
    createOverlayElements: function () {
        // create div overlay
        this.$divOverlay = jQuery('<div>').attr({
            class: 'imgOverlay'
        });
        this.$linkCheckmark = jQuery('<span>').css({
            position: 'absolute',
            left: '5px',
            color: 'white'
        });
        this.$checkmark = jQuery('<i>').attr({
            class: 'fa fa-check-circle fa-3x'
        });
    },
    buildOverlayElements: function () {
        this.sizeToImage();
        this.addContent();
        this.$divOverlay.on('click', this.linkChecked(this.$divOverlay));
    },
    sizeToImage: function () {
        // make the div overlay the same dimensions as the image
        this.$divOverlay.css({
            width: this.widthOfImage + 'px',
            height: this.heightOfImage + 'px',
            'line-height': this.heightOfImage + 'px',
        });
    },
    addContent: function () {
        this.$divOverlay.append(this.linkTitle);
    },
    attachToImage: function ($currentImage) {
        // make parent image relative positionin
        this.togClass($currentImage, 'overlaid');
        // place div overlay onto image
        jQuery($currentImage).before(this.$divOverlay);
    },
    showLegend: function () {
        linkChecker.config.$legend.slideToggle('1000');
    },
    toggleDisable: function () {
        linkChecker.config.$activateButt.prop('disabled', function (index, value) {
            return !value;
        });
    },
    togClass: function ($obj, addClass) {
        $obj.toggleClass(addClass);
    }

};
