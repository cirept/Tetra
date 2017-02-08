/*global jQuery, unsafeWindow, GM_setValue, GM_getValue, GM_setClipboard, GM_openInTab, window, GM_info, document */

/*

TO DO LIST:
1. re-do link checker, see if i can consolidate functions // half done
2. re-do image checker, see if i can consolidate functions // half done
3. consolidate all the toggle functions into one generic tog funtion.
11. Make SEO convertor work
---- Move vehicle arrays into separate files
-------- chev, buick, vw, hyundai, cadi
4. Look into Next GEN toolbar; caching issue with browser.
-- if viewing next gen, simply removing the URL parameter doesn't erase the next gen page from being viewed.
-- location.reload(true);  // to trigger a reload
5. MOVE ALL STYLES TO CLASS STYLES is possible
10. Combine next gen and Tetra toolbar into one
6. ADD SEO h Tag counter
7. Split up toolbox into right and left
---- right side has the tools & legend
---- left side page information

8. after code is converted to module style, update to revealing module pattern
9. Add listeners to make tool fully customizable
---- Setting Tab to turn tools on and off
---- Create settings tab

*/

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Build container for toolbox ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

var QAtoolbox = {
    init: function () {
        this.createElements();
        this.attachStyles();
        this.buildPanel();
        this.cacheDOM();
        this.attachTools();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        QAtoolbox.config = {
            $legendContainer: jQuery('<div>').attr({
                id: 'legendContainer'
            }),
            $toolbarContainer: jQuery('<div>').attr({
                id: 'toolboxContainer'
            }),
            $toolsContainer: jQuery('<div>').attr({
                class: 'toolBox',
                id: 'toolsContainer'
            }),
            $toolsPanel: jQuery('<div>').attr({
                id: 'toolsPanel'
            }),
            $toolsPanelTitle: jQuery('<div>').attr({
                class: 'panelTitle',
                id: 'toolsPanelTitle',
                title: 'Click to Minimize'
            }).text('QA Tools'),
            $otherToolsContainer: jQuery('<div>').attr({
                class: 'toolBox',
                id: 'otherToolsContainer'
            }).css({ // new
                display: 'none'
            }),
            $otherToolsPanel: jQuery('<div>').attr({
                id: 'otherToolsPanel'
            }),
            $otherToolsPanelTitle: jQuery('<div>').attr({
                class: 'panelTitle',
                id: 'otherToolsPanelTitle',
                title: 'Click to Minimize'
            }).text('Other Tools'),
            $toolbarStyles: jQuery('<style>').attr({
                id: 'qa_toolbox',
                type: 'text/css'
            })
        };
    },
    attachStyles: function () {
        QAtoolbox.config.$toolbarStyles
            // general toolbox styles
            .append('.toolBox { text-align: center; background: linear-gradient(to left, #76b852 , #8DC26F); position: relative; border: 1px solid black; font-size: 9.5px; z-index: 100000; margin: 0 0 5px 0; }')
            .append('#toolboxContainer { bottom: 20px; font-family: Montserrat; font-size: 9.5px; line-height: 20px; position: fixed; width: 120px; z-index: 99999999; }')
            // panel title styles // padding: 5px;
            .append('.panelTitle { border-bottom: 1px solid #000000; color: white; cursor: pointer; font-size: 12px; }')
            // default highlight style
            .append('#toolboxContainer .highlight { background: linear-gradient(to right, #83a4d4 , #b6fbff) !important; color: #ffffff;}')
            // even button styles
            .append('.evenEDObutts {background: linear-gradient(to left, #457fca , #5691c8);}')
            // off button styles
            .append('.oddEDObutts {background: linear-gradient(to left, #6190E8 , #A7BFE8);}')
            // default button styles
            .append('.myEDOBut { border: 2px solid rgb(0,0,0); border-radius: 5px; color: #ffffff !important; font-family: Montserrat; font-size: 11px; top: 15%; margin: 1px 0px 0px 10px; padding: 4px 0px; position: relative; text-transform: lowercase; width: 120px; }')
            .append('.myEDOBut.notWorking { background: purple; }')
            .append('.myEDOBut.offButt { width: 90%; height: 50px; }')
            .append('.myEDOBut:hover { background: linear-gradient(to left, #141E30 , #243B55); }')
            // legend styles
            .append('.legendTitle { font-weight: bold; }')
            .append('.legendContent { padding: 5px; }')
            .append('.legendList { list-style-type: none; margin: 10px 0px; padding: 0px; }')
            .append('#legendContainer { font-family: Montserrat; font-size: 12px; position: fixed; right: 115px; bottom: 20px; width: 260px; z-index: 99999999; }')
            .append('.legend { background: white; border: 1px solid black; display: none; text-align: center; padding: 5px; margin: 5px 0; }')
            .append('.hint { font-size: 10px; font-style: italic; line-height: 10px; margin: 10px 0 0 0; }')
            // end of append styles
        ; // end
    },
    buildPanel: function () {
        // attach title and tools panel to tool container
        jQuery(QAtoolbox.config.$toolsContainer).append(QAtoolbox.config.$toolsPanelTitle);
        jQuery(QAtoolbox.config.$toolsContainer).append(QAtoolbox.config.$toolsPanel);
        // attach title and tools panel to other tool container
        jQuery(QAtoolbox.config.$otherToolsContainer).append(QAtoolbox.config.$otherToolsPanelTitle);
        jQuery(QAtoolbox.config.$otherToolsContainer).append(QAtoolbox.config.$otherToolsPanel);
        // attach tools panel to tool container
        jQuery(QAtoolbox.config.$toolbarContainer).append(QAtoolbox.config.$toolsContainer);
        jQuery(QAtoolbox.config.$toolbarContainer).append(QAtoolbox.config.$otherToolsContainer);
        // attach tool container to toolbox
        //        jQuery(QAtoolbox.config.$toolbarContainer).append(QAtoolbox.config.$toolsContainer);
    },
    cacheDOM: function () {
        this.head = jQuery('head');
        this.body = jQuery('body');
        this.phoneWrapper = jQuery('body .phone-wrapper');
    },
    attachTools: function () {
        this.head.append(QAtoolbox.config.$toolbarStyles);
        this.body.before(QAtoolbox.config.$toolbarContainer);
        this.body.before(QAtoolbox.config.$legendContainer);
    },
    bindEvents: function () {
        QAtoolbox.config.$toolsPanelTitle.on('click', this.toggleFeature);
        QAtoolbox.config.$otherToolsPanelTitle.on('click', this.toggleFeature);
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    styleTools: function () {
        QAtoolbox.config.$toolsPanel.children('.myEDOBut:even').addClass('evenEDObutts');
        QAtoolbox.config.$toolsPanel.children('.myEDOBut:odd').addClass('oddEDObutts');
        QAtoolbox.config.$otherToolsPanel.children('.myEDOBut:even').addClass('evenEDObutts');
        QAtoolbox.config.$otherToolsPanel.children('.myEDOBut:odd').addClass('oddEDObutts');
    },
    toggleFeature: function (event) {
        var id = jQuery(event.target).attr('id');

        switch (id) {
        case 'toolsPanelTitle':
            return QAtoolbox.config.$toolsPanel.slideToggle('1000');
        case 'otherToolsPanelTitle':
            return QAtoolbox.config.$otherToolsPanel.slideToggle('1000');
        }
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Page Information Panel ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

var pageInformation = {
    init: function () {
        // initialize module
        this.createElements();
        this.buildPanel();
        this.cacheDOM();
        this.addTool();
        this.displayData();
        this.hide();
        this.addStyles();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        // main panel container
        pageInformation.config = {
            $pageInfoPanelContainer: jQuery('<div>').attr({
                class: 'toolBox',
                id: 'pageInfoPanelContainer'
            }),
            $pageInfoPanel: jQuery('<div>').attr({
                id: 'pageInfoPanel'
            }),
            // panel title
            $pageInfoPanelTitle: jQuery('<div>').attr({
                class: 'panelTitle',
                id: 'pageInfoPanelTitle',
                title: 'Click to Minimize'
            }).text('Page Information'),
            // dealership name title
            $dealerNameTitle: jQuery('<label>')
                .addClass('tbLabel')
                .text('Dealer Name'),
            // dealership name display
            $dealerName: jQuery('<div>')
                .addClass('tbInfo')
                .attr({
                    title: 'Copy Dealership Name',
                    id: 'dealerName'
                }),
            // web id title
            $webIDTitle: jQuery('<label>')
                .addClass('tbLabel')
                .text('Web-Id'),
            // web is display
            $webID: jQuery('<div>')
                .addClass('tbInfo')
                .attr({
                    title: 'Copy web-id',
                    id: 'webID'
                }),
            // page name title
            $pageNameTitle: jQuery('<label>')
                .addClass('tbLabel')
                .text('Page Name'),
            // pange name display
            $pageName: jQuery('<div>')
                .addClass('tbInfo')
                .attr({
                    title: 'Copy Page Name',
                    id: 'pageName'
                }),
            // page label title
            $pageLabelTitle: jQuery('<label>')
                .addClass('tbLabel')
                .text('Custom Page Name'),
            // page label display
            $pageLabel: jQuery('<div>')
                .addClass('tbInfo')
                .attr({
                    title: 'Copy Page Label',
                    id: 'pageLabel'
                })
        };
    },
    buildPanel: function () {
        // attach panel elements to container
        pageInformation.config.$pageInfoPanel
            .append(pageInformation.config.$dealerNameTitle)
            .append(pageInformation.config.$dealerName)
            .append(pageInformation.config.$webIDTitle)
            .append(pageInformation.config.$webID)
            .append(pageInformation.config.$pageNameTitle)
            .append(pageInformation.config.$pageName)
            .append(pageInformation.config.$pageLabelTitle)
            .append(pageInformation.config.$pageLabel);

        // attach to continer
        pageInformation.config.$pageInfoPanelContainer
            .append(pageInformation.config.$pageInfoPanelTitle)
            .append(pageInformation.config.$pageInfoPanel);
    },
    cacheDOM: function () {
        // page info
        this.$cm = unsafeWindow.ContextManager;
        this.dealerName = this.$cm.getDealershipName();
        this.webID = this.$cm.getWebId();
        this.pageName = this.$cm.getPageName();
        this.pageLabel = this.$cm.getPageLabel();
        // DOM elements
        this.$toolbarStyles = jQuery('#qa_toolbox');
        this.$toolBoxContainer = jQuery('#toolboxContainer');
    },
    addTool: function () {
        // add to main toolbox
        this.$toolBoxContainer.prepend(pageInformation.config.$pageInfoPanelContainer);
    },
    displayData: function () {
        // fill in page information
        pageInformation.config.$dealerName.html(this.dealerName);
        pageInformation.config.$webID.html(this.webID);
        pageInformation.config.$pageName.html(this.pageName);
        pageInformation.config.$pageLabel.html(this.pageLabel);
    },
    hide: function () {
        // hide pagel label elements if name
        // is same as page name
        var pageName = this.pageName;
        var pageLabel = this.pageLabel;
        if (pageName === pageLabel) {
            pageInformation.config.$pageLabelTitle.toggle();
            pageInformation.config.$pageLabel.toggle();
        }
    },
    addStyles: function () {
        // apply module styles to main tool bar style tag
        this.$toolbarStyles
            .append('.tbInfo { background: linear-gradient(to right, #ECE9E6 , #FFFFFF); color: #000000 !important; clear: both; cursor: pointer; line-height: 15px; padding: 3px 0px; border-top: 1px solid #000000; border-bottom: 1px solid #000000; }')
            .append('.tbLabel { font-weight: bold; }')
            .append('.myEDOBut[disabled] { border: 2px outset ButtonFace; background: #ddd; background-color: #ddd; color: grey !important; cursor: default; }');
    },
    bindEvents: function () {
        // hover
        pageInformation.config.$pageInfoPanel.on('mouseover mouseleave', '.tbInfo', this.hoverEffect);
        // click
        pageInformation.config.$pageInfoPanel.on('click', '.tbInfo', this.copyToClipboard);
        // minimize
        pageInformation.config.$pageInfoPanelTitle.on('click', this.toggleFeature);
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    hoverEffect: function (event) {
        // apply hover effects
        var element = event.currentTarget;
        jQuery(element).toggleClass('highlight');

    },
    copyToClipboard: function (event) {
        // copy page info
        var copyThisText = event.currentTarget.innerHTML;
        GM_setClipboard(copyThisText, 'text');
    },
    toggleFeature: function () {
        return pageInformation.config.$pageInfoPanel.slideToggle('1000');
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- m4 checkbox ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

var m4Check = {
    init: function () {
        this.createElements();
        this.buildTool();
        this.setToggle();
        this.cacheDOM();
        this.addTool();
        this.bindEvents();
        this.hideFeature();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        m4Check.config = {
            $m4Container: jQuery('<div>').attr({
                id: 'm4Input'
            }).css({
                background: 'linear-gradient(to right, rgb(236, 233, 230) , rgb(255, 255, 255))',
                cursor: 'pointer'
            }),
            $m4CheckTitle: jQuery('<div>').css({
                    color: 'black'
                })
                .text('Apply M4 Parameters?'),
            $m4Checkbox: jQuery('<div>').attr({
                id: 'm4toggle'
            }),
            $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>')
        };
    },
    buildTool: function () {
        m4Check.config.$m4Checkbox
            .append(m4Check.config.$FAtoggle);
        m4Check.config.$m4Container
            .append(m4Check.config.$m4CheckTitle)
            .append(m4Check.config.$m4Checkbox);
    },
    setToggle: function () {
        // get value of custom variable and set toggles accordingly
        if (this.getChecked()) {
            this.toggleOn();
            this.applyParameters();
        } else {
            this.toggleOff();
        }
    },
    cacheDOM: function () {
        this.$toolsPanel = jQuery('#toolsPanel');
    },
    addTool: function () {
        // add to main toolbox
        this.$toolsPanel.append(m4Check.config.$m4Container);
    },
    bindEvents: function () {
        // bind FA toggle with 'flipTheSwitch' action
        m4Check.config.$m4Container.on('click', this.flipTheSwitch.bind(this));
    },
    hideFeature: function () {
        // hides feature if viewing live site
        if (this.siteState() === 'LIVE') {
            m4Check.config.$m4Container.toggle();
        }
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    getChecked: function () {
        // grabs usingM4 value
        var a = GM_getValue('usingM4', false);
        return a;
    },
    toggleOn: function () {
        // set toggle on image
        var $toggle = m4Check.config.$FAtoggle;
        $toggle.removeClass('fa-toggle-off');
        $toggle.addClass('fa-toggle-on');
    },
    applyParameters: function () {
        var hasParameters = this.hasParameters();
        var siteState = this.siteState();
        var usingM4 = this.getChecked();
        // apply parameters only if DOESN'T already have parameters &&
        // site state IS NOT LIVE &&
        // toggled ON
        if ((!hasParameters) && (siteState !== 'LIVE') && (usingM4)) {
            window.location.search += '&comments=true&relative=true';
        }
    },
    toggleOff: function () {
        // set toggle off image
        var $toggle = m4Check.config.$FAtoggle;
        $toggle.removeClass('fa-toggle-on');
        $toggle.addClass('fa-toggle-off');
    },
    flipTheSwitch: function () {
        // set saved variable to opposite of current value
        this.setChecked(!this.getChecked());
        // set toggle
        this.setToggle();
    },
    // ----------------------------------------
    // tier 3 functions
    // ----------------------------------------
    hasParameters: function () {
        // determine if site URL already has custom parameters
        if (window.location.href.indexOf('&comments=true&relative=true') >= 0) {
            return true;
        } else {
            return false;
        }
    },
    siteState: function () {
        // return page variable
        return unsafeWindow.ContextManager.getVersion();
    },
    setChecked: function (bool) {
        // sets usingM4 value
        GM_setValue('usingM4', bool);
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- image checker ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
var imageChecker = {
    init: function () {
        this.createElements();
        this.buildLegend();
        this.addTool();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1
    // ----------------------------------------
    createElements: function () {
        imageChecker.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'imageChecker',
                title: 'Image Alt Checker'
            }).text('Image Alt Checker'),
            $legend: jQuery('<div>').attr({
                class: 'legend'
            }),
            $legendTitle: jQuery('<div>').attr({
                class: 'legendTitle'
            }).text('Image Checker Legend'),
            $legendList: jQuery('<ul>').attr({
                class: 'legendList'
            }),
            $legendContent: {
                'noAlt': 'No Alt Text',
                'hasAlt': 'Has Alt Text'
            },
            $offButt: jQuery('<input>').attr({
                type: 'button',
                class: 'myEDOBut offButt',
                value: 'Turn Off'
            }),
            $toolsPanel: jQuery('#toolsPanel'),
            $legendContainer: jQuery('#legendContainer'),
        };
    },
    buildLegend: function () {
        imageChecker.config.$legend
            // attach legend title
            .append(imageChecker.config.$legendTitle)
            // attach list
            .append(imageChecker.config.$legendList)
            // attach turn off button
            .append(imageChecker.config.$offButt);
        // fill list
        this.buildLegendContent();
    },
    addTool: function () {
        imageChecker.config.$toolsPanel.append(imageChecker.config.$activateButt);
        imageChecker.config.$legendContainer.append(imageChecker.config.$legend);
    },
    bindEvents: function () {
        // main button
        imageChecker.config.$activateButt.on('click', this.highlightImages.bind(this));
        imageChecker.config.$activateButt.on('click', this.showLegend);
        imageChecker.config.$activateButt.on('click', this.toggleDisable);
        // off button
        imageChecker.config.$offButt.on('click', this.removeHighlights.bind(this));
        imageChecker.config.$offButt.on('click', this.showLegend);
        imageChecker.config.$offButt.on('click', this.toggleDisable);
    },
    // ----------------------------------------
    // tier 2
    // ----------------------------------------
    buildLegendContent: function () {
        var $contentArray = imageChecker.config.$legendContent,
            key;

        // loop through Legend Content list
        for (key in $contentArray) {
            var value = $contentArray[key];
            // build listing element
            this.$listItem = jQuery('<li>').attr({
                class: 'legendContent ' + key
            }).append(value);
            // attach to legend list
            imageChecker.config.$legendList.append(this.$listItem);
        }
    },
    highlightImages: function () {
        // cache data from page
        this.cacheDOM();
        // add tool styles
        this.addStyles();

        var iaLength = this.imageArrayLength,
            a = 0;

        // loop through allImages and check for alt text
        for (a; a < iaLength; a++) {
            var $this = this.$allImages[a];
            // applies div overlay with same size as image
            this.addDivOverlay($this);
            // check for alt text
            this.checkForAltText($this);
        }
    },
    showLegend: function () {
        imageChecker.config.$legend.slideToggle('1000');
    },
    toggleDisable: function () {
        imageChecker.config.$activateButt.prop('disabled', function (index, value) {
            return !value;
        });
    },
    removeHighlights: function () {
        var iaLength = this.imageArrayLength,
            a = 0;

        // removes special overlay class on images
        for (a; a < iaLength; a++) {
            this.toggleOverlayClass(this.$allImages[a]);
        }
        // remove highlight overlay
        jQuery('.imgOverlay').remove();
    },
    // ----------------------------------------
    // tier 3
    // ----------------------------------------
    cacheDOM: function () {
        this.$allImages = jQuery('body').find('img');
        this.imageArrayLength = this.$allImages.length;
        this.$toolbarStyles = jQuery('#qa_toolbox');
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
            // image styles
            .append('.hasAlt { background: rgba(146, 232, 66, .75) !important; }')
            .append('.noAlt { background: rgba(255, 124, 216, .75) !important; }')
            .append('.emptyAlt { background: rgba(255, 124, 216, .75) !important; }')
            // end of addStyles
        ; // end
    },
    addDivOverlay: function (currentImage) {
        this.cacheDOMOverlayElements(currentImage);
        this.createOverlayElements();
        this.buildOverlayElements();
        this.attachToImage(currentImage);
    },
    checkForAltText: function (currentImage) {
        var $this = jQuery(currentImage);
        // find first case that returns true
        switch (true) {
            // if alt is undefined
        case ($this.attr('alt') === undefined):
            this.togClass($this, 'noAlt');
            break;
            // if alt is empty
        case ($this.attr('alt') === ''):
            this.togClass($this, 'emptyAlt');
            break;
            // if alt IS NOT empty
        case ($this.attr('alt') !== ''):
            this.togClass($this, 'hasAlt');
            break;
            // log the image element that breaks the program
        default:
            console.log('image checker failure');
            console.log(currentImage);
            break;
        }
    },
    // ----------------------------------------
    // tier 4
    // ----------------------------------------
    cacheDOMOverlayElements: function (currentImage) {
        this.imageAlt = jQuery(currentImage).attr('alt');
        // gets sizing of images
        this.widthOfImage = jQuery(currentImage).width();
        this.heightOfImage = jQuery(currentImage).height();
    },
    createOverlayElements: function () {
        // create div overlay
        this.$divOverlay = jQuery('<div>').attr({
            class: 'imgOverlay'
        });
    },
    buildOverlayElements: function () {
        // make the div overlay the same dimensions as the image
        this.$divOverlay.css({
            width: this.widthOfImage + 'px',
            height: this.heightOfImage + 'px',
            'line-height': this.heightOfImage + 'px',
        });
        // add image alt as text to div
        this.$divOverlay.append(this.imageAlt);
    },
    attachToImage: function (currentImage) {
        // make parent image relative positioning
        this.toggleOverlayClass(currentImage);
        // place div overlay onto image
        jQuery(currentImage).before(this.$divOverlay);
    },
    togClass: function ($obj, addClass) {
        $obj.siblings('.imgOverlay').toggleClass(addClass);
    },
    // ----------------------------------------
    // tier 5
    // ----------------------------------------
    toggleOverlayClass: function (currentImage) {
        jQuery(currentImage).toggleClass('overlaid');
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- link checker ----------------------------------------
//------------------------------------------------------------------------------------------------------------------------
var linkChecker = {
    init: function () {
        this.createElements();
        this.buildLegend();
        this.addTool();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        linkChecker.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'linkChecker',
                title: 'Check Links'
            }).text('Link Checker'),
            $legend: jQuery('<div>').attr({
                class: 'legend'
            }),
            $legendTitle: jQuery('<div>').attr({
                class: 'legendTitle'
            }).text('Link Checker Legend'),
            $legendList: jQuery('<ul>').attr({
                class: 'legendList'
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
                class: 'myEDOBut offButt',
                value: 'Turn Off'
            }),
            $hint: jQuery('<div>').attr({
                class: 'hint'
            }).text('ctrl+left click to open link in a new tab'),
            $toolsPanel: jQuery('#toolsPanel'),
            $legendContainer: jQuery('#legendContainer'),
        };
    },
    buildLegend: function () {
        linkChecker.config.$legend
            // attach legend title
            .append(linkChecker.config.$legendTitle)
            // attach list
            .append(linkChecker.config.$legendList)
            // attach turn off button
            .append(linkChecker.config.$offButt)
            // attach hint
            .append(linkChecker.config.$hint);
        // fill list
        this.buildLegendContent();
    },
    addTool: function () {
        linkChecker.config.$toolsPanel.append(linkChecker.config.$activateButt);
        linkChecker.config.$legendContainer.append(linkChecker.config.$legend);
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
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    buildLegendContent: function () {
        var $contentArray = linkChecker.config.$legendContent,
            key;

        // loop through Legend Content list
        for (key in $contentArray) {
            var value = $contentArray[key];
            // build listing element
            var $listItem = jQuery('<li>').attr({
                class: 'legendContent ' + key
            }).append(value);

            // attach to legend list
            linkChecker.config.$legendList.append($listItem);
        }
    },
    checkLinks: function () {
        // dynamic loading of cached elements
        // have to load here to compensate for lazy loaded widgets
        this.cacheDOM();
        this.addStyles();

        var length = this.linksArrayLength,
            a = 0;

        // verify all links
        for (a; a < length; a++) {

            var $currentLink = jQuery(this.$allLinks[a]),
                $image = $currentLink.find('img'),
                isImageLink = this.isImageLink($image);
            // add default class
            this.togClass($currentLink, 'siteLink');

            // if image link add div overlay
            if (isImageLink) {
                this.addDivOverlay($currentLink, $image);
            }
            this.checkTarget($currentLink, isImageLink);
            this.checkForTitleText($currentLink, isImageLink);
            this.checkURL($currentLink, isImageLink);
            // bind click event
            $currentLink.on('click', this.linkChecked($currentLink));
        }
    },
    showLegend: function () {
        linkChecker.config.$legend.slideToggle('1000');
    },
    toggleDisable: function () {
        linkChecker.config.$activateButt.prop('disabled', function (index, value) {
            return !value;
        });
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
    unbindClicks: function () {
        var i = 0,
            length = this.linksArrayLength;
        for (i; i < length; i++) {
            jQuery(this.$allLinks[i]).off('click');
        }
    },
    // ----------------------------------------
    // tier 3 functions
    // ----------------------------------------
    cacheDOM: function () {
        this.$allLinks = jQuery('body').find('a');
        this.$allImageLinks = this.$allLinks.find('img');
        this.linksArrayLength = this.$allLinks.length;
        this.imageLinksArrayLength = this.$allImageLinks.length;
        this.$toolbarStyles = jQuery('#qa_toolbox');
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
            .append('.siteLink.linkChecked, .imgOverlay.linkChecked { background: linear-gradient(to left, rgba(161, 255, 206, 0.75) , rgba(250, 255, 209, 0.75)) !important; color: #909090 !important; }')
            // end of addStyles
        ; // end
    },
    isImageLink: function ($image) {
        if ($image.length) {
            return true;
        } else {
            return false;
        }
    },
    togClass: function ($obj, addClass) {
        $obj.toggleClass(addClass);
    },
    addDivOverlay: function ($currentLink, $currentImage) {
        this.cacheDOMOverlayElements($currentLink, $currentImage);
        this.createOverlayElements();
        this.buildOverlayElements();
        this.attachToImage($currentImage);
    },
    checkTarget: function ($currentLink, isImageLink) {
        // check if link opens in a new window
        if (this.verifyTarget($currentLink)) {
            if (isImageLink) {
                this.togClass(this.$divOverlay, 'opensWindow');
            } else {
                this.togClass($currentLink, 'opensWindow');
            }
        }
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
    linkChecked: function ($currentLink) {
        return function () {
            $currentLink.toggleClass('linkChecked');
        };
    },
    removeClass: function (array, removeClass) { // toggle custom class
        var arrlength = array.length,
            a = 0;
        for (a; a < arrlength; a++) {
            var $obj = jQuery(array[a]);
            $obj.removeClass(removeClass);
        }
    },
    // ----------------------------------------
    // tier 4 functions
    // ----------------------------------------
    cacheDOMOverlayElements: function ($currentLink, $currentImage) {
        this.linkTitle = jQuery($currentLink).attr('title');
        // gets sizing of images
        this.widthOfImage = jQuery($currentImage).width();
        this.heightOfImage = jQuery($currentImage).height();
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
    attachToImage: function ($currentImage) {
        // make parent image relative positionin
        this.togClass($currentImage, 'overlaid');
        // place div overlay onto image
        jQuery($currentImage).before(this.$divOverlay);
    },
    verifyTarget: function ($currentLink) {
        if (($currentLink.attr('target') === '_blank') || ($currentLink.attr('target') === '_new')) {
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
    // ----------------------------------------
    // tier 5 functions
    // ----------------------------------------
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
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Show Navigation (highlight major pages) ----------------------------------------
//------------------------------------------------------------------------------------------------------------------------
var showNavigation = {
    init: function () {
        this.createElements();
        this.cacheDOM();
        this.buildLegend();
        this.addTool();
        this.bindEvents();
        this.addStyles();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        showNavigation.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'showNavigation',
                title: 'Show Navigation (Highlights Major Pages)'
            }).text('Show Navigation'),
            $offButt: jQuery('<input>').attr({
                type: 'button',
                class: 'myEDOBut offButt',
                value: 'Turn Off'
            }),
            $legend: jQuery('<div>').attr({
                class: 'legend'
            }),
            $legendTitle: jQuery('<div>').attr({
                class: 'legendTitle'
            }).text('Show Navigation Legend'),
            $legendList: jQuery('<ul>').attr({
                class: 'legendList'
            }),
            $legendContent: {
                'majorPage': 'Major Page',
                'linkChecked': 'Link Clicked'
            },
            $hint: jQuery('<div>').attr({
                class: 'hint'
            }).text('ctrl+left click to open link in a new tab')
        };
    },
    cacheDOM: function () {
        this.$nav = jQuery('#pmenu');
        this.$navTabs = jQuery(this.$nav).find('ul');
        this.$navTabsLinks = jQuery(this.$navTabs).find('a[href]');
        this.nlLength = this.$navTabsLinks.length;
        this.$toolbarStyles = jQuery('#qa_toolbox');
        this.$toolsPanel = jQuery('#toolsPanel');
        this.$legendContainer = jQuery('#legendContainer');
    },
    buildLegend: function () {
        showNavigation.config.$legend
            // attach legend title
            .append(showNavigation.config.$legendTitle)
            // attach list
            .append(showNavigation.config.$legendList)
            // attach turn off button
            .append(showNavigation.config.$offButt)
            // attach hint
            .append(showNavigation.config.$hint);
        // fill list
        this.buildLegendContent();
    },
    addTool: function () {
        this.$toolsPanel.append(showNavigation.config.$activateButt);
        this.$legendContainer.append(showNavigation.config.$legend);
    },
    bindEvents: function () {
        showNavigation.config.$activateButt.on('click', this.toggleFeatures.bind(this));
        showNavigation.config.$activateButt.on('click', this.toggleDisable);
        showNavigation.config.$activateButt.on('click', this.bindClicks.bind(this));
        showNavigation.config.$offButt.on('click', this.toggleFeatures.bind(this));
        showNavigation.config.$offButt.on('click', this.toggleDisable);
        showNavigation.config.$offButt.on('click', this.unbindClicks.bind(this));
    },
    addStyles: function () {
        // apply module styles to main tool bar style tag
        this.$toolbarStyles
            // styles of colored overlay placed on images
            .append('.subNav { background: linear-gradient(to left, #000000 , #434343) !important; color: #ffffff !important; }')
            .append('.majorPage { color: #ffffff !important; background: linear-gradient(to left, #ffb347 , #ffcc33) !important; }')
            .append('.showNav { display: block !important; }')
            .append('.linkChecked { background: linear-gradient(to left, rgba(161, 255, 206, 0.75) , rgba(250, 255, 209, 0.75)), #ffffff !important; color: #999999 !important; }')
            // end of addStyles
        ; // end
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    buildLegendContent: function () {
        var $contentArray = showNavigation.config.$legendContent,
            key;

        // loop through Legend Content list
        for (key in $contentArray) {
            var value = $contentArray[key];
            // build listing element
            this.$listItem = jQuery('<li>').attr({
                class: 'legendContent ' + key
            }).append(value);
            // attach to legend list
            showNavigation.config.$legendList.append(this.$listItem);
        }
    },
    toggleFeatures: function () {
        this.$navTabsLinks.toggleClass('subNav');
        this.$navTabs.find('a[href*=Form], a[href*=ContactUs], a[href=HoursAndDirections], a[href*=VehicleSearchResults]').toggleClass('majorPage');
        this.$navTabs.toggleClass('showNav');
        showNavigation.config.$legend.slideToggle('1000');
    },
    toggleDisable: function () {
        showNavigation.config.$activateButt.prop('disabled', function (index, value) {
            return !value;
        });
    },
    bindClicks: function () {
        var i = 0;
        for (i; i < this.nlLength; i++) {
            jQuery(this.$navTabsLinks[i]).on('click', this.linkChecked(this.$navTabsLinks[i]));
        }
    },
    unbindClicks: function () {
        var i = 0;
        for (i; i < this.nlLength; i++) {
            jQuery(this.$navTabsLinks[i]).off('click');
        }
        // remove link checked class
        this.$navTabs.find('.linkChecked').removeClass('linkChecked');
    },
    // ----------------------------------------
    // tier 3 functions
    // ----------------------------------------
    linkChecked: function (currentLink) {
        return function () {
            jQuery(currentLink).toggleClass('linkChecked');
        };
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Show Autofill Tags ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

var showAutofill = {
    init: function () {
        this.createElements();
        this.cacheDOM();
        this.addTool();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        showAutofill.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'showAutofill',
                title: 'Show Autofill Tags'
            }).text('Show Autofill')
        };
    },
    cacheDOM: function () {
        this.$toolsPanel = jQuery('#toolsPanel');
        this.$cm = unsafeWindow.ContextManager;
        this.siteURL = this.$cm.getUrl();
        this.pageName = this.$cm.getPageName();
    },
    addTool: function () {
        this.$toolsPanel.append(showAutofill.config.$activateButt);
    },
    bindEvents: function () {
        showAutofill.config.$activateButt.on('click', this.showAutofill.bind(this));
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    showAutofill: function () {
        var auto = '?disableAutofill=true',
            openThis = this.siteURL + this.pageName + auto;
        GM_openInTab(openThis, 'active');
    },
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Spell Check ----------------------------------------
//-------------------------------------------------------------------------------------------------------------------------

var spellCheck = {
    init: function () {
        this.createElements();
        this.cacheDOM();
        this.addTool();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        spellCheck.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'spellCheck',
                title: 'Check Spelling'
            }).text('Spellcheck Page')
        };
    },
    cacheDOM: function () {
        this.$toolsPanel = jQuery('#toolsPanel');
        this.$cm = unsafeWindow.ContextManager;
        this.siteURL = this.$cm.getUrl();
        this.pageName = this.$cm.getPageName();
    },
    addTool: function () {
        this.$toolsPanel.append(spellCheck.config.$activateButt);
    },
    bindEvents: function () {
        spellCheck.config.$activateButt.on('click', this.spellCheck.bind(this));
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    spellCheck: function () {
        var openThis = this.buildURL();
        GM_openInTab(openThis, 'active');
    },
    // ----------------------------------------
    // tier 3 functions
    // ----------------------------------------
    buildURL: function () {
        var URL = 'https://www.w3.org/2002/01/spellchecker?',
            params = {
                uri: encodeURIComponent(this.siteURL + this.pageName),
                lang: 'en_US'
            };
        jQuery.each(params, function (index, value) {
            URL += index + '=' + value + '&';
        });
        return URL;
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Test WebPage ----------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
// emials won't save if viewing sites in private browser
var speedtestPage = {
    init: function () {
        this.createElements();
        this.cacheDOM();
        this.buildOptions();
        this.buildPanel();
        this.addTool();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        speedtestPage.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'testPage',
                title: 'Queue up a Page Test'
            }).text('Web Page Test'),
            email: GM_getValue('email', 'your.name@cdk.com'),
            $emailTitle: jQuery('<div>').text('Enter your email'),
            $emailInput: jQuery('<input>').attr({
                id: 'email',
                type: 'text',
                placeholder: 'your.name@cdk.com',
                value: this.email
            }).css({
                margin: '5px 0px',
                width: '85%'
            }),
            $panelContainer: jQuery('<div>').attr({
                id: 'wptInput'
            }).css({
                background: 'white',
                'border': '1px solid black',
                display: 'none',
                'text-align': 'center',
                'padding': '5px',
                margin: '5px 0px'
            }),
            browserOptions: {
                '_IE11': 'IE11',
                ':Chrome': 'Chrome',
                ':FireFox': 'Firefox'
            },
            $browserSelect: jQuery('<select>').attr({
                id: 'bSelect'
            }).css({
                margin: '5px 0',
                width: '90%'
            }),
            $browserTitle: jQuery('<div>').text('Choose a Browser'),
            testURL: 'http://www.webpagetest.org/runtest.php?',
            $sendButt: jQuery('<input>').attr({
                type: 'button',
                class: 'myEDOBut',
                value: 'Send Test'
            }).css({
                width: '90%',
                height: '50px'
            })
        };
    },
    cacheDOM: function () {
        this.$cm = unsafeWindow.ContextManager;
        this.siteURL = this.$cm.getUrl();
        this.pageName = this.$cm.getPageName();
        this.$toolsPanel = jQuery('#toolsPanel');
    },
    buildOptions: function () {
        jQuery.each(speedtestPage.config.browserOptions, function (key, text) {
            var $listItem = jQuery('<option>').val(key).html(text);
            speedtestPage.config.$browserSelect.append($listItem);
        });
    },
    buildPanel: function () {
        speedtestPage.config.$panelContainer
            .append(speedtestPage.config.$emailTitle)
            .append(speedtestPage.config.$emailInput)
            .append(speedtestPage.config.$browserTitle)
            .append(speedtestPage.config.$browserSelect)
            .append(speedtestPage.config.$sendButt);
    },
    addTool: function () {
        this.$toolsPanel.append(speedtestPage.config.$activateButt);
        this.$toolsPanel.append(speedtestPage.config.$panelContainer);
    },
    bindEvents: function () {
        speedtestPage.config.$activateButt.on('click', this.toggleFeature);
        speedtestPage.config.$sendButt.on('click', this.storeData);
        speedtestPage.config.$sendButt.on('click', this.sendPage.bind(this));
        speedtestPage.config.$sendButt.on('click', this.toggleFeature);
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    toggleFeature: function () {
        speedtestPage.config.$panelContainer.slideToggle('1000');
    },
    storeData: function () {
        // save user input
        var userEmail = jQuery('#email').val();
        GM_setValue('email', userEmail);
    },
    sendPage: function () {
        var browser = jQuery('#bSelect option:selected').val(),
            browserName = jQuery('#bSelect option:selected').text(),
            email = GM_getValue('email'),
            params = {
                k: 'A.1b40e6dc41916bd77b0541187ac9e74b',
                runs: '3',
                fvonly: '1',
                notify: email,
                location: 'Dulles' + browser
            },
            newTab;

        // build url
        jQuery.each(params, function (index, value) {
            speedtestPage.config.testURL += index + '=' + value + '&';
        });

        var desktopURL = speedtestPage.config.testURL + 'url=' + this.siteURL + this.pageName + '?device=immobile';
        var mobileURL = speedtestPage.config.testURL + 'url=' + this.siteURL + this.pageName + '?device=mobile';

        // alert user
        if (confirm('----------------------------------------\n' +
                'Test the Desktop and Mobile site?\n' +
                '----------------------------------------\n' +
                'Browser : ' + browserName + '\n' +
                'Send Results To : ' + email + '\n' +
                '----------------------------------------') === true) {
            newTab = new GM_openInTab(desktopURL, true);
            newTab = new GM_openInTab(mobileURL, true);
        }
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- OTHER TOOLS ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Show Possible Autofill ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

var $haf_butt = jQuery('<button>').attr({
    class: 'myEDOBut notWorking',
    id: 'highlightAutofills',
    title: 'Highlight Autofills (has some bugs)'
}).text('highlight autofills');

var cm = unsafeWindow.ContextManager;

$haf_butt.click(function () {

    var $search = {
        dealername: cm.getDealershipName(),
        city: cm.getCity(),
        street: cm.getAddressLine1(),
        address2: cm.getAddressLine2(),
        collision: cm.getCollisionPhone(),
        fleet: cm.getFleetPhone(),
        new: cm.getNewPhone(),
        parts: cm.getPartsPhone(),
        primary: cm.getPrimaryPhone(),
        service: cm.getServicePhone(),
        used: cm.getUsedPhone(),
        finance: cm.getFinancePhone(),
        state: cm.getPreferredState(),
        zip: cm.getZip(),
        franchise: cm.getFranchises(),
    };


    var visibleText = jQuery('#content').find('.cell').find('.cblt-container');
    jQuery.each($search, function (key, searchText) {

        var regexp = '';

        // skip interation if value is null
        if (searchText === null) {
            console.log(key + ' value is null');
            return true;
        }

        console.log('find this : key : ' + key + ' : ' + searchText);
        console.log(jQuery.type(searchText));
        console.log('is array? : ', jQuery.isArray(searchText));

        // regex for phone numbers
        var phoneNo = /^\(?[0-9]{3}(\-|\)) ?[0-9]{3}-[0-9]{4}$/;

        // special check for the franchises object
        if (!jQuery.isArray(searchText)) {

            regexp = new RegExp(searchText, "gi");

            // check if value is a phone number
            if (searchText.match(phoneNo)) {
                var leftParen = '\u0028'; // regex match for "("
                var rightParen = '\u0029'; // regex match for ")"
                console.log('phone number found');
                console.log(leftParen);
                console.log(rightParen);
                //                var newSearchThis = searchText;

                var newText = searchText;

                console.log(regexp);
                //                jQuery(regexp).text().replace('(', leftParen);
                jQuery(regexp).text().replace('(', '\u0028');
                //                jQuery(regexp).text().replace(')', rightParen);
                jQuery(regexp).text().replace(')', '\u0029');
                console.log('replaced parenthesis :', regexp);

                console.log('checking phone number match');
                //                if (jQuery(newText).text() === jQuery(searchText).text()) {
                if (newText === searchText) {
                    console.log('phone number : it matches');
                } else {
                    console.log('phone number : it dont macth');
                }
                console.log('regex inserted into search string : ', searchText);
                //                regexp = new RegExp(searchText, "gi");

            }
            // if value is NOT a phone number
        } else {

            regexp = new RegExp(searchText, "gi");
        }

        // what is the value of the regex
        console.log('value of regex expressions : ', regexp);

        jQuery.each(visibleText, function (index, element) {

            var text = jQuery(element).children(':visible').text();
            //            var findMe = '^' + searchText + '$';
            //            var regexp = new RegExp(searchText, "gi");


            jQuery(element).children(':visible').html(function () {
                //                return jQuery(this).html().replace(regexp, '<span style="background: yellow;">' + searchText + '</span>');
                console.log(regexp);
                return jQuery(this).html().replace(regexp, '<span style="background: yellow; color: black;">' + searchText + '</span>');
            });

            if (text.indexOf(searchText) >= 0) {
                console.log('match found');
                return false;
            }
        });
    });
});

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- Refresh Page ----------------------------------------
//-------------------------------------------------------------------------------------------------------------------------

var refreshPage = {
    init: function () {
        this.createElements();
        this.cacheDOM();
        this.buildTool();
        this.addTool();
        this.bindEvents();
        this.addStyles();
        this.setToggle();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        refreshPage.config = {
            $refreshContainer: jQuery('<div>').attr({
                id: 'refreshMe'
            }).css({
                background: 'linear-gradient(to right, rgb(236, 233, 230), rgb(255, 255, 255))',
                cursor: 'pointer'
            }),
            $refreshButt: jQuery('<button>').attr({
                class: 'myEDOBut',
                id: 'refreshPage',
                title: 'Refresh Page from Server '
            }).css({
                background: 'linear-gradient(to left, #FBD3E9 , #BB377D)',
                width: '75px',
                position: 'fixed',
                left: '0px',
                top: '0px',
                'z-index': '1000000',
                display: 'none'
            }),
            $refresh: jQuery('<i class="fa fa-undo fa-flip-horizontal fa-3x">&nbsp;</i>').css({
                'margin-left': '-10px'
            }),
            $refreshTitle: jQuery('<div>').css({
                    color: 'black'
                })
                .text('Toggle Refresh Button'),
            $refreshCheckbox: jQuery('<div>').attr({
                id: 'm4toggle'
            }),
            $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>')
        };
    },
    cacheDOM: function () {
        this.$otherToolsPanel = jQuery('#otherToolsPanel');
        this.$toolbarStyles = jQuery('#qa_toolbox');
    },
    buildTool: function () {
        refreshPage.config.$refreshButt.html(refreshPage.config.$refresh);
        // add icon to mock button
        refreshPage.config.$refreshCheckbox.append(refreshPage.config.$FAtoggle);
        // add mock button to container
        refreshPage.config.$refreshContainer
            .append(refreshPage.config.$refreshTitle)
            .append(refreshPage.config.$refreshCheckbox);
    },
    addTool: function () {
        this.$otherToolsPanel.append(refreshPage.config.$refreshContainer);
        this.$otherToolsPanel.append(refreshPage.config.$refreshButt);
    },
    bindEvents: function () {
        refreshPage.config.$refreshButt.on('click', this.reloadPage);
        refreshPage.config.$refreshCheckbox.on('click', this.flipTheSwitch.bind(this));
    },
    addStyles: function () {
        this.$toolbarStyles
            .append('#refreshPage:hover { color: #ffffff !important; background: linear-gradient(to left, #f4c4f3 , #fc67fa) !important; }');
    },
    setToggle: function () {
        // get value of custom variable and set toggles accordingly
        if (this.getChecked()) {
            this.toggleOn();
            refreshPage.config.$refreshButt.show();
        } else {
            this.toggleOff();
            refreshPage.config.$refreshButt.hide();
        }
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    reloadPage: function () {
        window.location.reload(true);
    },
    flipTheSwitch: function () {
        // set saved variable to opposite of current value
        var toggle = this.getChecked();
        this.setChecked(!toggle);
        // set toggle
        this.setToggle();
    },
    toggleOn: function () {
        // set toggle on image
        var $toggle = refreshPage.config.$FAtoggle;
        $toggle.removeClass('fa-toggle-off');
        $toggle.addClass('fa-toggle-on');
    },
    toggleOff: function () {
        // set toggle off image
        var $toggle = refreshPage.config.$FAtoggle;
        $toggle.removeClass('fa-toggle-on');
        $toggle.addClass('fa-toggle-off');
    },
    // ----------------------------------------
    // tier 3 functions
    // ----------------------------------------
    getChecked: function () {
        // grabs usingM4 value
        var a = GM_getValue('useRefreshButton', false);
        return a;
    },
    setChecked: function (bool) {
        // sets useRefreshButton value
        GM_setValue('useRefreshButton', bool);
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- SEO Simplify ----------------------------------------
//-------------------------------------------------------------------------------------------------------------------------

var seoSimplify = {
    init: function () {
        this.createElements();
        this.buildElements();
        this.getData();
        this.cacheDOM();
        this.addStyles();
        this.addTool();
        this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements: function () {
        seoSimplify.config = {
            $activateButt: jQuery('<button>').attr({
                class: 'myEDOBut notWorking',
                id: 'simpleSEO',
                title: 'Simplify My SEO Text (has some bugs)'
            }).text('SEO Simplify'),
            $removeBut: jQuery('<input>').attr({
                type: 'button',
                class: 'myEDOBut',
                value: 'REMOVE',
                id: 'removeDiv'
            }),
            $seoDisplay: jQuery('<div>').attr({
                id: 'inputDisplay'
            }),
            $seoContainer: jQuery('<div>').attr({
                id: 'inputContainer'
            }).css({
                background: 'white',
                color: 'black'
            }),
            oems: ['Chevrolet', 'Buick', 'Cadillac', 'GMC', 'Hyundai', 'Volkswagen'],
            vehicles: [],
            seoText: ''
        };
    },
    buildElements: function () {
        // attach seo display and remove button to container
        seoSimplify.config.$seoContainer
            .append(seoSimplify.config.$seoDisplay)
            .append(seoSimplify.config.$removeBut);
    },
    getData: function () {
        var filePath = '';
        jQuery(seoSimplify.config.oems).each(function (index, model) {
            switch (model) {
            case 'Chevrolet':
                // vehicles/chevrolet.json
                filePath = 'https://media-dmg.assets-cdk.com/teams/repository/export/e2e/45858a25d100580860050568bfc31/e2e45858a25d100580860050568bfc31.json';
                seoSimplify.loadArray(filePath);
                break;
            case 'Buick':
                // vehicles/buick.json
                filePath = 'https://media-dmg.assets-cdk.com/teams/repository/export/e2e/3cfa0a25d100581330050568b6442/e2e3cfa0a25d100581330050568b6442.json';
                seoSimplify.loadArray(filePath);
                break;
            case 'Cadillac':
                // vehicles/cadillac.json
                filePath = 'https://media-dmg.assets-cdk.com/teams/repository/export/e2e/421a8a25d100582540050568ba825/e2e421a8a25d100582540050568ba825.json';
                seoSimplify.loadArray(filePath);
                break;
            case 'GMC':
                // vehicles/gmc.json
                filePath = 'https://media-dmg.assets-cdk.com/teams/repository/export/e2e/3a4a8a25d100584040050568b5709/e2e3a4a8a25d100584040050568b5709.json';
                seoSimplify.loadArray(filePath);
                break;
            case 'Hyundai':
                // vehicles/hyundai.json
                filePath = 'https://media-dmg.assets-cdk.com/teams/repository/export/e2e/41208a25d100584040050568b5709/e2e41208a25d100584040050568b5709.json';
                seoSimplify.loadArray(filePath);
                break;
            case 'Volkswagen':
                // vehicles/volkswagen.json
                filePath = 'https://media-dmg.assets-cdk.com/teams/repository/export/e2e/421a8a25d100584040050568b5709/e2e421a8a25d100584040050568b5709.json';
                seoSimplify.loadArray(filePath);
                break;
            }
        });
    },
    cacheDOM: function () {
        this.$otherToolsPanel = jQuery('#otherToolsPanel');
        this.$toolbarStyles = jQuery('#qa_toolbox');
        this.body = jQuery('#content');
    },
    addStyles: function () {
        // apply module styles to main tool bar style tag
        this.$toolbarStyles
            // styles of colored overlay placed on images
            .append('#inputDisplay { padding: 10px; }')
            // end of addStyles
        ; // end
    },
    addTool: function () {
        this.$otherToolsPanel.append(seoSimplify.config.$activateButt);
    },
    bindEvents: function () {
        seoSimplify.config.$activateButt.on('click', this.simplifySEO.bind(this));
        seoSimplify.config.$removeBut.on('click', this.removeDisplay.bind(this));
        // add change to text area function
        seoSimplify.config.$seoDisplay.on('click', this.changeToTextarea.bind(this));
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    loadArray: function (filePath) {
        jQuery.getJSON(filePath, function (data) {
            seoSimplify.config.vehicles.push(data);
        });
    },
    simplifySEO: function () {
        this.getInput();
        this.cleanUpTags();
        this.cleanUpLinks();
        this.attachDisplayArea();
        this.displayText();
    },
    removeDisplay: function () {
        // remove display container
        seoSimplify.config.$seoContainer.remove();
    },
    changeToTextarea: function (event) {
        var $this = jQuery(event.currentTarget);
        var input = seoSimplify.config.$seoDisplay.html(),
            $seoTextArea = jQuery('<textarea>').css({
                width: '100%',
                height: '300px'
            });
        $seoTextArea.html(input);
        jQuery($this).replaceWith($seoTextArea);
        $seoTextArea.focus();
        $seoTextArea.blur(this.revertDiv.bind(this));
    },
    // ----------------------------------------
    // tier 3 functions
    // ----------------------------------------
    getInput: function () {
        // clear data
        seoSimplify.config.seoText = '';
        //seoSimplify.config.seoText = "<div><span title='' class='f-xx-small'>&nbsp;Welcome to %DEALER_NAME%, you're one-stop-%CITY%-GM-shop! We are proud to offer our huge selection of new and used vehicles to %CITY%, %STATE% and %DEALER_GEO_ONE% Chevrolet, Buick and GMC customers.<br> Laplante Auto also has GM-certified service, <a href='%LINKPAGENAME_PartsDepartment_LINKCONTEXTNAME_%'><u title=''>parts</u></a> and <a href='%LINKPAGENAME_Accessories_LINKCONTEXTNAME_%'><u>accessories</u></a>. Don't forget our financing options. We even sell tires to help you keep up with the changing seasons. Here at %DEALER_NAME% in %CITY% we are committed to helping you find the car of your dreams and keep it running for a long time. We also serve as a great dealer alternative for %DEALER_GEO_ONE% Chevrolet, Buick and GMC shoppers.&nbsp;</span></div>";
        // prompt user for input
        seoSimplify.config.seoText = jQuery.trim(prompt('Enter Your SEO Text - HTML format'));
    },
    cleanUpTags: function () { // get rid of repeat functionality
        var input = seoSimplify.config.seoText,
            $input = jQuery(input);

        // remove all empty elements
        $input.find('*:empty').remove();
        $input.find('*').each(function (index, value) {
            if (jQuery.trim(jQuery(value).html()) === '') {
                jQuery(value).remove();
            }
        });
        // remove all style attributes
        $input.find('*').removeAttr('style');
        // remove all br elements
        $input.find('br').remove();
        // remove all font tags
        $input.find('font').replaceWith(function () {
            return jQuery(this).html();
        });
        // remove all &nbsp; with ' '
        $input.html($input.html().replace(/&nbsp;/gi, ' '));
        // remove all span tags
        $input.find('span').replaceWith(function () {
            return jQuery(this).html();
        });
        // remove all u tags
        $input.find('u').replaceWith(function () {
            return jQuery(this).html();
        });
        // remove all b tags
        $input.find('b').replaceWith(function () {
            return jQuery(this).html();
        });
        // remove all strong tags
        $input.find('strong').replaceWith(function () {
            return jQuery(this).html();
        });
        // remove all i tags
        $input.find('i').replaceWith(function () {
            return jQuery(this).html();
        });
        // replace all div tags with p tags
        $input.find('center').replaceWith(function () {
            return jQuery('<p/>').append(jQuery(this).html());
        });
        // save cleaner input
        seoSimplify.config.seoText = $input;
    },
    cleanUpLinks: function () {
        var $input = seoSimplify.config.seoText,
            allLinks = $input.find('a'),
            len = allLinks.length,
            i = 0;

        for (i; i < len; i++) {
            var $this = jQuery(allLinks[i]);
            // check if title is empty or undefined
            if (seoSimplify.isUndefined($this, 'title') || seoSimplify.isEmpty($this, 'title')) {
                // sets title to link text
                var titleText = $this.text().toString().trim();
                $this.attr('title', titleText.substr(0, 1).toUpperCase() + titleText.substr(1));
            }
            // check if href is empty or undefined
            if (seoSimplify.isUndefined($this, 'href') || seoSimplify.isEmpty($this, 'href')) {
                // sets href to # if none exists
                $this.attr('href', '#');
            }

            var linkURL = $this.attr('href');
            $this.attr('href', seoSimplify.refineURL(linkURL));
            seoSimplify.emptyTarget($this);
        }
        // save cleaner input
        seoSimplify.config.seoText = $input;
    },
    attachDisplayArea: function () {
        this.body.prepend(seoSimplify.config.$seoContainer);
    },
    displayText: function () {
        // attach input to display
        seoSimplify.config.$seoDisplay.append(seoSimplify.config.seoText);
    },
    revertDiv: function (event) {
        var $this = jQuery(event.target),
            $thisText = jQuery(event.target).text();
        var $replacementArea = jQuery('<div>').attr({
            id: 'inputDisplay'
        }).css({
            padding: '10px'
        }).text('');

        $replacementArea.html($thisText);

        jQuery($this).replaceWith($replacementArea);

        $replacementArea.click(this.changeToTextarea.bind(this));
    },
    // ----------------------------------------
    // tier 4 functions
    // ----------------------------------------
    isUndefined: function (elem, attr) {
        if (jQuery(elem).attr(attr) !== undefined) {
            return false;
        } else {
            return true;
        }
    },
    isEmpty: function (elem, attr) {
        if (jQuery(elem).attr(attr) === '') {
            return true;
        } else {
            return false;
        }
    },
    refineURL: function (url) {
        var ezURL = url.split('%'),
            removeThese = ['LINKCONTEXTNAME', 'LINKPAGENAME'],
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
            findThis = 'ModelDetails',
            actualURL;
        for (x; x < len; x++) {
            if (nURL[x] === findThis) {
                actualURL = this.getURL(nURL[len - 1]);
                return actualURL;
            } else {
                actualURL = nURL[0];
                return actualURL;
            }
        }
    },
    emptyTarget: function (elem) {
        var $this = elem;
        // if target is undefined or empty remove target attribute
        if (seoSimplify.isUndefined($this, 'target') || seoSimplify.isEmpty($this, 'target')) {
            jQuery(elem).removeAttr('target');
        }
    },
    // ----------------------------------------
    // tier 5 functions
    // ----------------------------------------
    getURL: function (vehicle) {
        var vehicleArray = vehicle.split(' ');
        var make = 'no match found',
            model = '',
            oems = seoSimplify.config.oems,
            oemsLen = oems.length,
            x = 0;
        if (vehicleArray.length >= 3) {
            for (var b = 1; b < vehicleArray.length; b++) {
                model += vehicleArray[b];
            }
        } else {
            model = vehicleArray[vehicleArray.length - 1];
        }
        for (x; x < oemsLen; x++) {
            if (vehicleArray[0].indexOf(oems[x]) >= 0) {
                make = oems[x];
                break;
            }
        }

        model = model.trim();
        make = make.toLowerCase();

        var vehiclesArr = seoSimplify.config.vehicles,
            detailsURL = '';

        // fix this if possible
        jQuery.each(vehiclesArr, function (index, oemArray) {
            jQuery.each(oemArray, function (oem, vehiclesArray) {
                if (oem === make) {
                    jQuery.each(vehiclesArray, function (index, vehicleArray) {
                        if (model === vehicleArray.name) {
                            detailsURL = vehicleArray.url;
                            return false; // break out of loop
                        }
                    });
                }
            });
        });
        return detailsURL;
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- add widget outlines ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// disable on next gen sites.  dont work
var $wo_butt = jQuery('<button>').attr({
    class: 'myEDOBut',
    id: 'widgetOutline',
    title: 'Show Widget Outlines'
}).text('Show Widgets');

$wo_butt.click(function () {
    var $toolbarStyles = jQuery('#qa_toolbox');

    $toolbarStyles
    // styles data content
        .append('.showWidgetData:after { content: attr(data-content); position: absolute; top: 0; bottom: 0; left: 0; text-align: center; z-index: 100; margin: auto; background: linear-gradient(to right, rgba(80, 201, 195, .85) , rgba(150, 222, 218, .85)); color: black; font-weight: bold; font-size: 15px; }')
        .append('.outlineWidget { border: 1px dotted pink; }')
        .append('.hideColorblock { z - index: -1 !important; }')
        // end of addStyles
    ; // end

    // made to you will be able to remove it later
    jQuery('.masonry-brick').addClass('outlineWidget');
    // made to you will be able to remove it later
    jQuery('div[class*=colorBlock]').addClass('hideColorblock');

    jQuery('body .cell .CobaltEditableWidget').each(function () {
        jQuery(this).addClass('showWidgetData');

        var widgetID = jQuery(this).attr('id');
        var w = jQuery(this).width(),
            h = jQuery(this).height();

        jQuery(this).on('click', copyWidgetID);
        jQuery(this).attr({
            title: 'Click to Copy Widget ID'
        });

        jQuery(this).append(function () {
            jQuery(this).attr({
                'data-content': widgetID + ' ::: ' + w + 'px X ' + h + 'px'
            });
        });

        // dynamically adjust the data content
        $toolbarStyles
            .append('#' + widgetID + ':after { height: ' + h + 'px; width: ' + w + 'px; }');
    });

    jQuery('body .cell .CobaltWidget').each(function () {
        jQuery(this).addClass('showWidgetData');
        var widgetID = jQuery(this).attr('id');
        var w = jQuery(this).width(),
            h = jQuery(this).height();

        jQuery(this).on('click', copyWidgetID);
        jQuery(this).attr({
            title: 'Click to Copy Widget ID'
        });

        jQuery(this).append(function () {
            jQuery(this).attr({
                'data-content': widgetID + ' :: ' + w + 'px X ' + h + 'px'
            });
        });

        // dynamically adjust the data content
        $toolbarStyles
            .append('#' + widgetID + ':after { height: ' + h + 'px; width: ' + w + 'px; }');
    });

    function copyWidgetID(event) {
        var $widget = jQuery(event.target),
            widgetID = $widget.attr('id');
        // make element blink for verification purposes
        $widget.fadeIn(300).fadeOut(300).fadeIn(300);
        GM_setClipboard(widgetID, 'text');
    }
});

// ----------------------------------------
// title text checker
// ----------------------------------------
var $titleChecker = jQuery('<button>').attr({
    class: 'myEDOBut notWorking',
    id: 'titleChecker',
    title: 'title checker',
    disabled: true
}).text('title checker');


jQuery($titleChecker).on('click', function () {

    var $toolbarStyles = jQuery('#qa_toolbox');

    $toolbarStyles
    // styles of colored overlay placed on images
        .append('.answerTypeIndicator { position: absolute; font-size: 10pt; background-color: rgba(255, 128, 0, 0.3); color: rgb(200, 0, 0); padding: 0.2em 0.5em 0.1em; border: solid rgb(200, 0, 0) 1px; fill-opacity: 0.2; display: block; z-index: -1;}')
        .append('.showing { display: block !important; }')
        // end of addStyles
    ; // end

});

jQuery($titleChecker).on('click', function () {
    // the positioning of each indicator relative its corresponding answer text
    //    var indicOffsetTop = 10;
    //    var indicOffsetLeft = 5;
    var indicOffsetTop = 0;
    var indicOffsetLeft = 0;

    // retrieve all the answer paragraphs from the DOM
    var answers = jQuery('body [title]');
    console.log(answers);
    // original
    //    var answers = document.querySelectorAll('[title]');

    // build but don't yet show the answer-type indicators

    // loop over each answer paragraph
    jQuery.each(answers, function (index, answer) {
        console.log('index : ', index);
        console.log('value : ', answer);
        // create a new div element that will contain the answer-type text
        var indic = document.createElement('div');

        // style this div so it stands out and also so that it starts out hidden
        indic.classList.add('answerTypeIndicator');

        // get the position of the original answer paragraph so that
        // the new answer-type indicator can be positioned near it
        //        var posn = answer.getBoundingClientRect();

        var obj = jQuery(answer);
        var position = obj.position();

        // slightly offset the position of the answer-type indicator relative to
        // its corresponding answer text so that both can be seen simultaneously
        indic.style.top = position.top + indicOffsetTop + 'px';
        indic.style.left = position.left + indicOffsetLeft + 'px';

        // take the value (i.e. the text) from the title attribute of the answer paragraph
        // and put it into the content of the answer-type indicator
        indic.innerHTML = answer.getAttribute('title');

        // place the new indicator into the DOM, but note that it is still hidden at this point
        document.body.appendChild(indic);
    });

    // put all the newly created answer-type indicator divs into a variable for later access
    var indics = document.querySelectorAll('.answerTypeIndicator');

    // determine what code to call when starting and stopping hovering over an answer
    // do this by adding hover listeners to each 'answer' paragraph
    jQuery.each(answers, function (answer) {
        jQuery(answer).on('mouseover', showTitleInfo);
        jQuery(answer).on('mouseout', hideTitleInfo);

        //        answer.addEventListener('mouseover', showTitleInfo);
        //        answer.addEventListener('mouseout', hideTitleInfo);
    });

    // do this when starting to hover over an answer
    function showTitleInfo() {

        // loop through each answer-style indicator div
        jQuery.each(indics, function (indic) {

            // make each indicator visible
            indic.classList.add('showing');
        });
    }

    // do this when stopping hovering over an answer
    function hideTitleInfo() {

        // loop through each answer-style indicator div
        jQuery.each(indics, function (indic) {

            // hide each indicator
            indic.classList.remove('showing');
        });
    }
});
// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- broken link checker ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// will show LIVE SITE functionality
// on proof some links may result in 404 errors.
// not sure why this is.
// change up functionality to Cache once button is clicked
// 1.  add undefined styles
// 2. add format styles
/* ----------------------------------------

to do:
1. remove all the comments
2. check with board

---------------------------------------- */

//var brokenLinkChecker = {
//    init: function () {
//        this.createElements();
//        this.buildElements();
//        this.getData();
//        this.cacheDOM();
//        this.addStyles();
//        this.addTool();
//        this.bindEvents();
//    },
//    createElemenets: function () {
//        brokenLinkChecker.config = {
//            $activateButt: jQuery('<button>').attr({
//                class: 'myEDOBut',
//                id: 'brokenLinkChecker',
//                title: 'Broken Link Checker'
//            }).text('Broken Link Checker'),
//            $legend: jQuery('<div>').attr({
//                class: 'legend'
//            }),
//            $legendTitle: jQuery('<div>').attr({
//                class: 'legendTitle'
//            }).text('404 Link Legend'),
//            $legendList: jQuery('<ul>').attr({
//                class: 'legendList'
//            }),
//            $legendContent: {
//                'otherDomain': 'Leads to other domain',
//                'framedIn': 'f_ link',
//                'brokenURL': 'Empty URL',
//                'success': 'Link is Real',
//                'error': '404 Link',
//            },
//            $offButt: jQuery('<input>').attr({
//                type: 'button',
//                class: 'myEDOBut offButt',
//                value: 'remove legend'
//            }),
//            cm: unsafeWindow.ContextManager,
//            webID: cm.getWebId(),
//            siteID: cm.getSiteId(),
//            baseURL: cm.getUrl(),
//            //            wid: z(webID),
//            $pageLinks: jQuery('a'),
//            $container: jQuery('<div>').attr({
//                id: 'checkContainer',
//            }),
//            $message: jQuery('<div>').attr({
//                id: 'checkMessage'
//            }),
//            $counter: jQuery('<div>').attr({
//                id: 'count404'
//            }),
//            $iconContainer: jQuery('<div>').attr({
//                id: 'iconContainer'
//            }),
//            $thinking: jQuery('<i id="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'),
//            $done: jQuery('<i class="fa fa-check-circle fa-3x fa-fw"></i>'),
//            $hint: jQuery('<div>').attr({
//                class: 'hint'
//            }).text('refresh page before running checker again')
//        };
//    },
//    buildElements: function () {
//        brokenLinkChecker.config.$legend
//            // attach legend title
//            .append(brokenLinkChecker.config.$legendTitle)
//            // attach list
//            .append(brokenLinkChecker.config.$legendList)
//            // attach turn off button
//            .append(brokenLinkChecker.config.$offButt);
//        // fill list
//        this.buildLegendContent();
//    },
//    buildLegendContent: function () {
//        var $contentArray = brokenLinkChecker.config.$legendContent,
//            key;
//
//        // loop through Legend Content list
//        for (key in $contentArray) {
//            var value = $contentArray[key];
//            // build listing element
//            var $listItem = jQuery('<li>').attr({
//                class: 'legendContent ' + key
//            }).append(value);
//
//            // attach to legend list
//            brokenLinkChecker.config.$legendList.append($listItem);
//        }
//    },
//    cacheDOM: function () {
//        this.$legendContainer = jQuery('#legendContainer');
//        this.$toolbarStyles = jQuery('#qa_toolbox');
//    },
//    addStyles: function () {
//        this.$toolbarStyles
//            // styles of colored overlay placed on images
//            .append('.otherDomain { background: linear-gradient(to left, #00C9FF , #92FE9D) !important; -moz-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); -webkit-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); color: #000000 !important; }')
//            .append('.framedIn { background: linear-gradient(to left, #F7971E , #FFD200) !important; color: #000000 !important; }')
//            .append('.brokenURL { background: linear-gradient(to left, #FFAFBD , #ffc3a0) !important; color: #000000 !important; }')
//            .append('.success { background: linear-gradient(to left, rgba(161, 255, 206, 0.75), rgba(250, 255, 209, 0.75)) !important; color: #000000 !important; }')
//            .append('.error { background: linear-gradient(to left, #F00000 , #DC281E) !important; color: #ffffff !important; }')
//            .append('#checkMessage { margin: 5px auto; padding: 5px; }')
//            .append('#checkContainer { text-align: center; background: white; border: 1px solid #000000; }')
//            // end of addStyles
//        ; // end
//    },
//    addTool: function () {
//        this.$legendContainer.append(brokenLinkChecker.config.$legend);
//    },
//    bindEvents: function () {
//        brokenLinkChecker.config.$activateButt.on('click', this.checkLinks);
//        brokenLinkChecker.config.$activateButt.on('click', this.toggleDisable);
//        // off button
//        brokenLinkChecker.config.$offButt.on('click', this.showLegend);
//    },
//    checkLinks: function () {
//        var wid = this.separateID(brokenLinkChecker.config.webID);
//    },
//    toggleDisable: function () {
//        brokenLinkChecker.config.$activateButt.prop('disabled', function (index, value) {
//            return !value;
//        });
//    },
//    showLegend: function () {
//        brokenLinkChecker.config.$legend.slideToggle('1000');
//    },
//    separateID: function (webID) {
//        var x = webID.split('-');
//        return x[1];
//    },
//};

// ----------------------------------------

var $404checker_butt = jQuery('<button>').attr({
    class: 'myEDOBut',
    id: '404checker',
    title: '404 Checker'
}).text('404 Checker');

$404checker_butt.on('click', function () {

    // ---------------------------------------- disable 404 button to prevent multi clicking
    toggleDisable();

    function toggleDisable() {
        $404checker_butt.prop('disabled', function (index, value) {
            return !value;
        });
    }

    // ---------------------------------------- build legend
    var $legend = jQuery('<div>').attr({
            class: 'legend'
        }),
        $legendTitle = jQuery('<div>').attr({
            class: 'legendTitle'
        }).text('404 Link Legend'),
        $legendList = jQuery('<ul>').attr({
            class: 'legendList'
        }),
        $legendContent = {
            'otherDomain': 'Leads to other domain',
            'framedIn': 'f_ link',
            'brokenURL': 'Empty URL',
            'success': 'Link is Real',
            'error': '404 Link',
        },
        $offButt = jQuery('<input>').attr({
            type: 'button',
            class: 'myEDOBut offButt',
            value: 'remove legend'
        }),
        $legendContainer = jQuery('#legendContainer'); // cache dom

    buildLegend();
    $legendContainer.append($legend);
    showLegend();

    function buildLegend() {
        $legend
        // attach legend title
            .append($legendTitle)
            // attach list
            .append($legendList)
            // attach turn off button
            .append($offButt);
        // fill list
        buildLegendContent();
    }

    // add click event to remove button
    $offButt.on('click', showLegend);

    function buildLegendContent() {
        var $contentArray = $legendContent,
            key;

        // loop through Legend Content list
        for (key in $contentArray) {
            var value = $contentArray[key];
            // build listing element
            var $listItem = jQuery('<li>').attr({
                class: 'legendContent ' + key
            }).append(value);

            // attach to legend list
            $legendList.append($listItem);
        }
    }

    function showLegend() {
        $legend.slideToggle('1000');
    }
    // ---------------------------------------- build legend end

    var $toolbarStyles = jQuery('#qa_toolbox');

    $toolbarStyles
    // styles of colored overlay placed on images

        .append('.otherDomain { background: linear-gradient(to left, #00C9FF , #92FE9D) !important; -moz-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); -webkit-box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); box-shadow: inset 0px 0px 0px 1px rgb(255, 55, 60); color: #000000 !important; }')
        .append('.framedIn { background: linear-gradient(to left, #F7971E , #FFD200) !important; color: #000000 !important; }')
        .append('.brokenURL { background: linear-gradient(to left, #FFAFBD , #ffc3a0) !important; color: #000000 !important; }')
        .append('.success { background: linear-gradient(to left, rgba(161, 255, 206, 0.75), rgba(250, 255, 209, 0.75)) !important; color: #000000 !important; }')
        .append('.error { background: linear-gradient(to left, #F00000 , #DC281E) !important; color: #ffffff !important; }')
        .append('#checkMessage { margin: 5px auto; padding: 5px; }')
        .append('#checkContainer { text-align: center; background: white; border: 1px solid #000000; }')
        // end of addStyles
    ; // end

    var cm = unsafeWindow.ContextManager,
        webID = cm.getWebId(),
        siteID = cm.getSiteId(),
        baseURL = cm.getUrl(),
        wid = z(webID),
        $pageLinks = jQuery('a'),
        $container = jQuery('<div>').attr({
            id: 'checkContainer',
        }),
        $message = jQuery('<div>').attr({
            id: 'checkMessage'
        }),
        $counter = jQuery('<div>').attr({
            id: 'count404'
        }),
        $iconContainer = jQuery('<div>').attr({
            id: 'iconContainer'
        }),
        $thinking = jQuery('<i id="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'),
        $done = jQuery('<i class="fa fa-check-circle fa-3x fa-fw"></i>'),
        $hint = jQuery('<div>').attr({
            class: 'hint'
        }).text('refresh page before running checker again');

    // attach hint
    $legend.append($hint);

    // split web-id
    function z(webID) {
        var x = webID.split('-');
        return x[1];
    }
    // ----------------------------------------
    // added to module pattern ^^^
    // ----------------------------------------


    // attach display area to tool box
    $legend.before($container);
    // show thinking icon
    jQuery(document).ajaxStart(function () {
        $message.text('checking links').append($counter);
        $message.append($iconContainer).append($thinking);
        $container.append($message);
    });

    var testComplete = 1;
    var totalTests = $pageLinks.length;
    // test each link on the page

    var j = 0;
    var pageLinksLength = $pageLinks.length;

    for (j; j < pageLinksLength; j++) {

        var curLink = $pageLinks[j],
            $curLink = jQuery(curLink),
            curURL = jQuery.trim($curLink.attr('href'));

        // skip javascript links
        if (curURL.indexOf('javascript') >= 0) {
            continue;
        }
        // test if URL is undefined
        // skip checking link if not a web link
        if (typeof curLink === 'undefined') {
            $curLink.addClass('brokenURL');
            continue;
        } // test if URL is empty
        // skip checking link if not a web link
        if (curURL === '') {
            $curLink.addClass('brokenURL');
            continue;
        }

        // test if link is a complete URL
        // eg. http://www.blahblah.com/
        // skip iteration if not correct format
        if (checkHref(curURL)) {
            $curLink.addClass('otherDomain');
            continue;
        }

        // test if link if href contains f_ or //:
        // f_ will frame in the URL which may cause viewing issues if URL is an interior page.
        // skip iteration if not correct format
        if (checkHref2(curURL)) {
            $curLink.addClass('framedIn');
            continue;
        }

        var curWindow = window.location.href;
        if (curWindow.indexOf('nextGen=true') > -1) {
            // check URL if using relative path
            // NEXT GEN SPECIFIC
            // add complete URL for testing purposes
            var findThis = '/' + siteID + '/',
                findThis2 = '/' + wid + '/',
                length = findThis.length + 1;
            if ((curURL.indexOf(findThis) >= 0) && (curURL.indexOf(findThis) < length)) {
                curURL = curURL.replace(findThis, baseURL);
            }
            if ((curURL.indexOf(findThis2) >= 0) && (curURL.indexOf(findThis2) < length)) {
                curURL = curURL.replace(findThis, baseURL);
            }
        } else {
            // check URL if it begins with /, signifying the link is a relative path URL
            // check URL if it doesn't have the normal http://www, also signifying the link is a relative path URL
            // TETRA SPECIFIC
            // add complete URL for testing purposes
            //            if ((linkURL.indexOf('/') === 0) || !checkHref(linkURL)) {
            //            if (curURL.indexOf('/') === 0) {
            //                curURL = baseURL + curURL;
            //            }
        }

        // test links
        testLink(curURL, curLink);
    }

    function testLink(linkURL, curLink) {
        var $curLink = jQuery(curLink),
            hasImage = 0,
            isImageLink = false;
        // test each link
        jQuery.ajax({
            url: linkURL, //be sure to check the right attribute
            type: 'HEAD',
            crossDomain: false,
            method: 'get',
            success: function () { //pass an anonymous callback function

                // checks to see if link is an image link
                // adds a div overlay if is an image link
                hasImage = $curLink.has('img').length;
                if (hasImage) {
                    isImageLink = true;
                }

                // if is an image link add class to div overlay
                // else add class to a tag
                if (isImageLink) {
                    var $img = $curLink.find('img'),
                        w = $img.width(),
                        h = $img.height(),
                        $linkOverlay = jQuery('<div>').attr({
                            class: 'siteLink linkOverlay'
                        }).css({
                            width: w + 'px',
                            height: h + 'px',
                            position: 'absolute',
                            'z-index': 1
                        });

                    $img.attr('style', 'position: relative;');
                    $curLink.prepend($linkOverlay);
                    success($linkOverlay, isImageLink);
                } else {
                    $curLink.addClass('success');
                    success($curLink, isImageLink);
                }
            },
            error: function () {
                //set link in red if there is any errors with link
                error($curLink, isImageLink);
            },
            statusCode: {
                404: function () {
                    $curLink.addClass('error');
                    error($curLink, isImageLink);
                }
            },
            complete: function () {
                testComplete++;
                $counter.text(testComplete + ' of ' + totalTests);
            }
        });
    }

    // fire after ALL ajax requests have been completed
    jQuery(document).ajaxStop(function () {
        $message.empty();
        $thinking.remove();
        $message.text('all links checked');
        $iconContainer.append($done);
        $message.append($iconContainer);
        $message.delay(7000).fadeOut(2000, function () {
            $container.remove();
        });
    });

    function success($this, isImageLink) {
        var curClass = '';
        if (isImageLink) {
            curClass = $this.attr('class');
        }
        $this.addClass('success');
    }

    function error($this, isImageLink) {
        var curClass = '';
        if (isImageLink) {
            curClass = $this.attr('class');
        }
        $this.addClass('error');
    }

    function checkHref(linkURL) {
        if ((linkURL.indexOf('www') > -1) || (linkURL.indexOf('http') > -1) || (linkURL.indexOf('https') > -1)) {
            return true;
        }
    }

    function checkHref2(linkURL) {

        if ((linkURL.indexOf('f_') > -1) || (linkURL.indexOf('//:') > -1)) {
            return true;
        }
    }
});

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- dynamic panel ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

var dynamicDisplay = {
    init: function () {
        this.createElements();
        this.buildPanel();
        this.cacheDOM();
        this.addTool();
        this.bindEvents();
    },
    createElements: function () {
        // main panel container
        dynamicDisplay.config = {
            $displayPanel: jQuery('<div>')
                .attr({
                    class: 'toolBox',
                    id: 'displayPanel'
                }),
            // panel title
            $displayTitle: jQuery('<div>')
                .addClass('panelTitle'),
            //.text('Placeholder Text'),
            // display area
            $displayArea: jQuery('<div>').attr({
                id: 'displayArea'
            }),
            // toolbox version
            $version: jQuery('<div>').css({
                'font-size': '12px'
            }).text('version: ' + GM_info.script.version),
            // hide toolbox button div
            $hideToolbox: jQuery('<div>').attr({
                id: 'hideToolbox',
                title: 'Click to Hide Toolbox'
            }).css({
                background: 'linear-gradient(to left, #283048 , #859398)',
                'border-bottom': '1px solid #000000',
                'border-radius': '15px',
                color: 'white',
                cursor: 'pointer',
                'font-weight': 'bold'
            }).text('Hide Toolbox'),
            // toolbox show button
            $showToolbox: jQuery('<div>').attr({
                id: 'showToolbox',
                title: 'Show Toolbox'
            }).css({
                background: 'linear-gradient(to right, #a8e063 0%, #56ab2f 100%)',
                bottom: '20px',
                'border-radius': '5px',
                color: 'white',
                cursor: 'pointer',
                display: 'none',
                padding: '5px',
                position: 'fixed',
                width: '50px',
                'z-index': '99999999'
            }),
            // font awesome icon
            $icon: jQuery('<i class="fa fa-fort-awesome fa-2x"></i>').css({
                'margin-left': '12px'
            }),
            $hide: jQuery('<div>').css({
                'font-size': '12px',
                position: 'absolute',
                right: '-25px',
                top: '-20px',
                'z-index': '1000000'
            }), // font awesome icon
            $minimizeIcon: jQuery('<span class="fa-stack fa-2x"><i class="fa fa-circle fa-stack-1x fa-inverse" style="color: #ffffff"></i><i class="fa fa-times-circle fa-stack-1x"></i></span>').attr({
                title: 'Click to Hide Toolbox',
            })
        };
    },
    buildPanel: function () {
        // attach panel elements to container
        jQuery(dynamicDisplay.config.$displayPanel)
            //.append(dynamicDisplay.config.$displayTitle)
            .append(dynamicDisplay.config.$displayArea)
            .append(dynamicDisplay.config.$version);
        //            .append(dynamicDisplay.config.$hideToolbox);
        // attach icon to minimize tab
        jQuery(dynamicDisplay.config.$showToolbox)
            .append(dynamicDisplay.config.$icon);
        // attach icon to minimize tab
        jQuery(dynamicDisplay.config.$hide)
            .append(dynamicDisplay.config.$minimizeIcon);
    },
    cacheDOM: function () {
        // page info
        this.$toolBoxContainer = jQuery('#toolboxContainer');
    },
    addTool: function () {
        // add to main toolbox
        this.$toolBoxContainer.append(dynamicDisplay.config.$displayPanel);
        this.$toolBoxContainer.before(dynamicDisplay.config.$showToolbox);

        this.$toolBoxContainer.append(dynamicDisplay.config.$hide);
    },
    bindEvents: function () {
        // click
        dynamicDisplay.config.$minimizeIcon.on('click', this.toggleTools.bind(this));
        dynamicDisplay.config.$showToolbox.on('click', this.toggleTools.bind(this));
    },
    toggleTools: function () {
        // hide / show main tool box
        this.toggleBox();
        // hide / show toggle button
        dynamicDisplay.config.$showToolbox.slideToggle('1000');
    },
    toggleBox: function () {
        this.$toolBoxContainer.slideToggle('1000');
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- initialize toolbox ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

var runProgram = {
    init: function () {
        if (!this.editMode() && this.isCDKsite() && !this.isMobile()) {
            // initialize toolbox
            QAtoolbox.init();
            // initialize page Information module
            pageInformation.init();
            // initialize milestone 4 module check box
            m4Check.init();
            // initialize image checker tool
            imageChecker.init();
            // initialize link checker tool
            linkChecker.init();
            // initialize show navigation tool
            showNavigation.init();
            // initialize show autofill tool
            showAutofill.init();
            // initialize spell check tool
            spellCheck.init();
            // initialize page test
            speedtestPage.init();

            // other tools
            // initialize refresh page
            refreshPage.init();
            // initialize SEO simplify
            seoSimplify.init();

            jQuery('#otherToolsPanel').append($haf_butt);
            jQuery('#toolsPanel').append($404checker_butt);
            jQuery('#otherToolsPanel').append($titleChecker);
            jQuery('#otherToolsPanel').append($wo_butt);

            // style buttons in toolbox
            QAtoolbox.styleTools();
            // initialize display information module
            dynamicDisplay.init();
        }
    },
    isCDKsite: function () {
        var siteState = unsafeWindow.ContextManager.getVersion();
        // determines which state of the site you are viewing (this variable should only exist on CDK sites)
        return ((siteState === 'WIP') || (siteState === 'PROTO') || (siteState === 'LIVE'));
    },
    isMobile: function () {
        var phoneWrapper = jQuery('body .phone-wrapper');
        // determines if the page being viewed is meant for mobile
        if (phoneWrapper.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    editMode: function () {
        // determines if site is in edit mode in WSM (this variable should only exist on CDK sites)
        return unsafeWindow.editMode;
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------- START TOOLBOX PROGRAM ----------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

runProgram.init();