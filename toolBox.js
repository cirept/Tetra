/*jslint debug: false*/
/*global jQuery, unsafeWindow, GM_setValue, GM_getValue, GM_setClipboard, GM_openInTab, window, GM_info, GM_listValues, document, console */

// 1. reorganized code - placed code in related areas
(function () {
    "use strict";
    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- Build container for toolbox ----------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------
    var QAtoolbox = {
            init: function () {
                this.createElements();
                this.toolbarStyles();
                this.buildPanel();
                this.cacheDOM();
                this.attachTools();
                this.bindEvents();
                this.showPanels();
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
                    // ----------------------------------------
                    // QA Tools Panel
                    // ----------------------------------------
                    $mainToolsContainer: jQuery('<div>').attr({
                        class: 'toolBox',
                        id: 'mainToolsContainer'
                    }),
                    $mainToolsPanel: jQuery('<div>').attr({
                        class: 'toolsPanel',
                        id: 'mainTools'
                    }),
                    $mainToolsTitle: jQuery('<div>').attr({
                        class: 'panelTitle',
                        id: 'mainToolsTitle',
                        title: 'Click to Minimize/Maximize'
                    }).text('QA Tools'),
                    // ----------------------------------------
                    // Other Tools Panel
                    // ----------------------------------------
                    $otherToolsContainer: jQuery('<div>').attr({
                        class: 'toolBox',
                        id: 'otherToolsContainer'
                    }),
                    $otherToolsPanel: jQuery('<div>').attr({
                        class: 'toolsPanel',
                        id: 'otherTools'
                    }),
                    $otherToolsTitle: jQuery('<div>').attr({
                        class: 'panelTitle',
                        id: 'otherToolsTitle',
                        title: 'Click to Minimize/Maximize'
                    }).text('Other Tools'),
                    // ----------------------------------------
                    // Toggles Panel
                    // ----------------------------------------
                    $togglesContainer: jQuery('<div>').attr({
                        class: 'toolBox',
                        id: 'togglesContainer'
                    }),
                    $togglesPanel: jQuery('<div>').attr({
                        class: 'toolsPanel',
                        id: 'toggleTools'
                    }),
                    $togglesTitle: jQuery('<div>').attr({
                        class: 'panelTitle',
                        id: 'togglesTitle',
                        title: 'Click to Minimize/Maximize'
                    }).text('Toggles'),
                    // ----------------------------------------
                    // URL Modifiers Panel
                    // ----------------------------------------
                    $urlModContainer: jQuery('<div>').attr({
                        class: 'toolBox',
                        id: 'urlModContainer'
                    }),
                    $urlModPanel: jQuery('<div>').attr({
                        class: 'toolsPanel',
                        id: 'urlModTools'
                    }),
                    $urlModTitle: jQuery('<div>').attr({
                        class: 'panelTitle',
                        id: 'urlModTitle',
                        title: 'Click to Minimize / Maximize'
                    }).text('URL Modifiers'),
                    $urlModTools: {},
                    // ----------------------------------------
                    // Toolbar Resources
                    // ----------------------------------------
                    $toolbarStyles: jQuery('<style>').attr({
                        id: 'qa_toolbox',
                        type: 'text/css'
                    }),
                    $myFont: jQuery('<link>').attr({
                        href: 'https://fonts.googleapis.com/css?family=Montserrat',
                        rel: 'stylesheet'
                    }),
                    $jQueryUI: jQuery('<link>').attr({
                        href: 'ttps://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css',
                        rel: 'stylesheet'
                    })
                };
            },
            toolbarStyles: function () {
                QAtoolbox.config.$toolbarStyles
                    // general toolbox styles
                    .append('.toolBox { text-align: center; background: linear-gradient(to left, #76b852 , #8DC26F); position: relative; border: 1px solid black; font-size: 9.5px; z-index: 100000; margin: 0 0 5px 0; }')
                    .append('#toolboxContainer { bottom: 20px; font-family: "Montserrat"; font-size: 9.5px; line-height: 20px; position: fixed; text-transform: lowercase; width: 120px; z-index: 99999999; }')
                    .append('.toolsPanel { display: none; }')
                    // panel title styles // padding: 5px;
                    .append('.panelTitle { border-bottom: 1px solid #000000; color: white; cursor: pointer; font-size: 11px; text-transform: lowercase; }')
                    // default highlight style
                    .append('#toolboxContainer .highlight { background: linear-gradient(to right, #83a4d4 , #b6fbff) !important; color: #ffffff;}')
                    // even button styles
                    .append('.evenEDObutts {background: linear-gradient(to left, #457fca , #5691c8);}')
                    // off button styles
                    .append('.oddEDObutts {background: linear-gradient(to left, #6190E8 , #A7BFE8);}')
                    // default button styles
                    .append('.myEDOBut { border: 2px solid rgb(0,0,0); border-radius: 5px; color: #ffffff !important; font-family: "Montserrat"; font-size: 11px; top: 15%; margin: 1px 0px 0px 10px; padding: 4px 0px; position: relative; text-transform: lowercase; width: 120px; }')
                    .append('.myEDOBut.notWorking { background: purple; }')
                    .append('.myEDOBut.offButt { width: 90%; height: 50px; }')
                    .append('.myEDOBut[disabled] { border: 2px outset ButtonFace; background: #ddd; background-color: #ddd; color: grey !important; cursor: default; }')
                    .append('.offButt { background: linear-gradient(to left, #085078 , #85D8CE) !important; }')
                    .append('.myEDOBut:hover { background: linear-gradient(to left, #141E30 , #243B55) !important; }')
                    // legend styles
                    .append('.legendTitle { font-weight: bold; }')
                    .append('.legendContent { padding: 5px; }')
                    .append('.legendList { list-style-type: none; margin: 10px 0px; padding: 0px; }')
                    .append('#legendContainer { font-family: "Montserrat"; font-size: 12px; position: fixed; right: 115px; bottom: 20px; width: 260px; z-index: 99999999; }')
                    .append('.legend { background: white; border: 1px solid black; display: none; text-align: center; padding: 5px; margin: 5px 0; }')
                    .append('.hint { font-size: 10px; font-style: italic; line-height: 10px; margin: 10px 0 0 0; }')
                    // toggle style
                    .append('.toggleTool { background: linear-gradient(to right, rgb(236, 233, 230) , rgb(255, 255, 255)); border-top: 1px solid #999999; cursor: pointer; } '); // end

            },
            buildPanel: function () {
                // attach title and tools panel to tool container
                jQuery(QAtoolbox.config.$mainToolsContainer).append(QAtoolbox.config.$mainToolsTitle);
                jQuery(QAtoolbox.config.$mainToolsContainer).append(QAtoolbox.config.$mainToolsPanel);
                // attach title and tools panel to other tool container
                jQuery(QAtoolbox.config.$otherToolsContainer).append(QAtoolbox.config.$otherToolsTitle);
                jQuery(QAtoolbox.config.$otherToolsContainer).append(QAtoolbox.config.$otherToolsPanel);
                // attach title and toggles panel to toggles container
                jQuery(QAtoolbox.config.$togglesContainer).append(QAtoolbox.config.$togglesTitle);
                jQuery(QAtoolbox.config.$togglesContainer).append(QAtoolbox.config.$togglesPanel);
                // attach title and URL Mod panel to URL Mod container
                jQuery(QAtoolbox.config.$urlModContainer).append(QAtoolbox.config.$urlModTitle);
                jQuery(QAtoolbox.config.$urlModContainer).append(QAtoolbox.config.$urlModPanel);
                jQuery(QAtoolbox.config.$urlModContainer).append(QAtoolbox.config.$urlModPanel);
                // attach tools panel to tool container
                jQuery(QAtoolbox.config.$toolbarContainer).append(QAtoolbox.config.$mainToolsContainer);
                jQuery(QAtoolbox.config.$toolbarContainer).append(QAtoolbox.config.$otherToolsContainer);
                jQuery(QAtoolbox.config.$toolbarContainer).append(QAtoolbox.config.$togglesContainer);
                jQuery(QAtoolbox.config.$toolbarContainer).append(QAtoolbox.config.$urlModContainer);
            },
            cacheDOM: function () {
                this.head = jQuery('head');
                this.body = jQuery('body');
                this.phoneWrapper = jQuery('body .phone-wrapper');
                this.variableList = this.programData();
            },
            attachTools: function () {
                this.head.append(QAtoolbox.config.$toolbarStyles);
                this.head.append(QAtoolbox.config.$myFont);
                this.body.before(QAtoolbox.config.$toolbarContainer);
                this.body.before(QAtoolbox.config.$legendContainer);
            },
            bindEvents: function () {
                QAtoolbox.config.$mainToolsTitle.on('click', this.toggleFeature);
                QAtoolbox.config.$mainToolsTitle.on('click', this.saveState);
                QAtoolbox.config.$otherToolsTitle.on('click', this.toggleFeature);
                QAtoolbox.config.$otherToolsTitle.on('click', this.saveState);
                QAtoolbox.config.$togglesTitle.on('click', this.toggleFeature);
                QAtoolbox.config.$togglesTitle.on('click', this.saveState);
                QAtoolbox.config.$urlModTitle.on('click', this.toggleFeature);
                QAtoolbox.config.$urlModTitle.on('click', this.saveState);
            },
            showPanels: function () {
                // loop through variable list to find the panel title
                var variables = this.variableList,
                    state = '',
                    key = '';

                for (key in variables) {
                    switch (key) {
                    case 'mainTools':
                        state = variables[key] ? 'show' : 'hide';
                        this.setState(QAtoolbox.config.$mainToolsPanel, state);
                        break;
                    case 'otherTools':
                        state = variables[key] ? 'show' : 'hide';
                        this.setState(QAtoolbox.config.$otherToolsPanel, state);
                        break;
                    case 'toggleTools':
                        state = variables[key] ? 'show' : 'hide';
                        this.setState(QAtoolbox.config.$togglesPanel, state);
                        break;
                    case 'urlModTools':
                        state = variables[key] ? 'show' : 'hide';
                        this.setState(QAtoolbox.config.$urlModPanel, state);
                        break;
                    default:
                        // no match found
                        break;
                    }
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            programData: function () {
                var allVariables = GM_listValues(),
                    length = allVariables.length,
                    a = 0,
                    varList = {},
                    key = '',
                    value = '';

                // add variables to list
                for (a; a < length; a += 1) {
                    key = allVariables[a];
                    value = GM_getValue(key, false);
                    varList[key] = value;
                }

                return varList;
            },
            toggleFeature: function (event) {
                var id = jQuery(event.target).attr('id');

                switch (id) {
                case 'mainToolsTitle':
                    return QAtoolbox.config.$mainToolsPanel.slideToggle('1000');
                case 'otherToolsTitle':
                    return QAtoolbox.config.$otherToolsPanel.slideToggle('1000');
                case 'togglesTitle':
                    return QAtoolbox.config.$togglesPanel.slideToggle('1000');
                case 'urlModTitle':
                    return QAtoolbox.config.$urlModPanel.slideToggle('1000');
                }
            },
            saveState: function (event) {
                // get current state
                var vName = jQuery(event.target).siblings('.toolsPanel').attr('id'),
                    currState = GM_getValue(vName, false);
                // sets usingM4 value
                GM_setValue(vName, !currState);
            },
            setState: function ($panel, state) {
                if (state === 'show') {
                    $panel.css({
                        display: 'block'
                    });
                } else if (state === 'hide') {
                    $panel.css({
                        display: 'none'
                    });
                }
            },
            styleTools: function () {
                QAtoolbox.config.$mainToolsPanel.children('.myEDOBut:even').addClass('evenEDObutts');
                QAtoolbox.config.$mainToolsPanel.children('.myEDOBut:odd').addClass('oddEDObutts');
                QAtoolbox.config.$otherToolsPanel.children('.myEDOBut:even').addClass('evenEDObutts');
                QAtoolbox.config.$otherToolsPanel.children('.myEDOBut:odd').addClass('oddEDObutts');
            }
        },

        /* ************************************************************************************************************************ */
        /* **************************************** PAGE INFO TOOLS **************************************** */
        /* ************************************************************************************************************************ */

        // ---------------------------------------------------------------
        // --------------------- Page Information Panel ---------------------
        // ---------------------------------------------------------------
        pageInformation = {
            init: function () {
                // initialize module
                this.createElements();
                this.buildPanel();
                this.cacheDOM();
                this.addTool();
                this.addStyles();
                this.bindEvents();
                this.displayPanel();
            },
            // ----------------------------------------
            // tier 1 functions
            // ----------------------------------------
            createElements: function () {
                // main panel container
                pageInformation.config = {
                    $pageInfoContainer: jQuery('<div>').attr({
                        class: 'toolBox',
                        id: 'pageInfoContainer'
                    }),
                    // panel title
                    $pageInfoTitle: jQuery('<div>').attr({
                        class: 'panelTitle',
                        id: 'pageInfoTitle',
                        title: 'Click to Minimize/Maximize'
                    }).text('Page Information'),
                    // tool panel
                    $pageInfo: jQuery('<div>').attr({
                        class: 'toolsPanel',
                        id: 'pageInfo'
                    })
                };
            },
            buildPanel: function () {
                // attach panel elements to container
                pageInformation.config.$pageInfo
                    .append(dealerName.init())
                    .append(webID.init())
                    .append(pageName.init());

                // attach to continer
                pageInformation.config.$pageInfoContainer
                    .append(pageInformation.config.$pageInfoTitle)
                    .append(pageInformation.config.$pageInfo);
            },
            cacheDOM: function () {
                // DOM elements
                this.$toolbarStyles = jQuery('#qa_toolbox');
                this.$toolBoxContainer = jQuery('#toolboxContainer');
                this.variableList = this.programData();
            },
            addTool: function () {
                // add to main toolbox
                this.$toolBoxContainer.append(pageInformation.config.$pageInfoContainer);
            },
            addStyles: function () {
                // apply module styles to main tool bar style tag
                this.$toolbarStyles
                    .append('.tbInfo { background: linear-gradient(to right, #ECE9E6 , #FFFFFF); color: #000000 !important; clear: both; cursor: pointer; line-height: 15px; padding: 3px 0px; text-transform: none; border-top: 1px solid #000000; border-bottom: 1px solid #000000; }')
                    .append('.tbLabel { font-weight: bold; }');
            },
            bindEvents: function () {
                // minimize
                pageInformation.config.$pageInfoTitle.on('click', this.toggleFeature);
                pageInformation.config.$pageInfoTitle.on('click', this.saveState);
                // hover effect
                pageInformation.config.$pageInfo.on('mouseover mouseleave', '.tbInfo', this.hoverEffect);
                // click
                pageInformation.config.$pageInfo.on('click', '.tbInfo', this.copyToClipboard);
            },
            displayPanel: function () {
                // loop through variable list to find the panel title
                var variables = this.variableList,
                    state = '',
                    key = '';

                for (key in variables) {
                    if (key === 'pageInfo') {
                        state = variables[key] ? 'show' : 'hide';
                        this.setState(pageInformation.config.$pageInfo, state);
                    }
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            programData: function () {
                var allVariables = GM_listValues(),
                    length = allVariables.length,
                    a = 0,
                    varList = {},
                    key = '',
                    value = '';

                // add variables to list
                for (a; a < length; a += 1) {
                    key = allVariables[a];
                    value = GM_getValue(key, false);
                    varList[key] = value;
                }
                return varList;
            },
            toggleFeature: function () {
                return pageInformation.config.$pageInfo.slideToggle('1000');
            },
            saveState: function (event) {
                // get current state
                var vName = jQuery(event.target).siblings('.toolsPanel').attr('id'),
                    currState = GM_getValue(vName, false);
                // sets usingM4 value
                GM_setValue(vName, !currState);
            },
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
            setState: function ($panel, state) {
                if (state === 'show') {
                    $panel.css({
                        display: 'block'
                    });
                } else if (state === 'hide') {
                    $panel.css({
                        display: 'none'
                    });
                }
            }
        },

        // ---------------------------------------------------------------
        // --------------------- Dealership Name ---------------------
        // ---------------------------------------------------------------
        dealerName = {
            init: function () {
                this.createElements();
                this.buildTool();
                this.cacheDOM();
                this.displayData();
                // return finished tool
                return this.returnTool();
            },
            createElements: function () {
                dealerName.config = {
                    $dealerNameContainer: jQuery('<div>').attr({
                        id: 'dealerNameContainer'
                    }),
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
                        })
                };
            },
            buildTool: function () {
                dealerName.config.$dealerNameContainer.append(dealerName.config.$dealerNameTitle);
                dealerName.config.$dealerNameContainer.append(dealerName.config.$dealerName);
            },
            cacheDOM: function () {
                this.$cm = unsafeWindow.ContextManager;
                this.dealerName = this.$cm.getDealershipName();
            },
            displayData: function () {
                dealerName.config.$dealerName.html(this.dealerName);
            },
            returnTool: function () {
                var panel = dealerName.config.$dealerNameContainer;
                return panel;
            }
        },

        // ---------------------------------------------------------------
        // --------------------- Web Id ---------------------
        // ---------------------------------------------------------------
        webID = {
            init: function () {
                this.createElements();
                this.buildTool();
                this.cacheDOM();
                this.displayData();
                // return finished tool
                return this.returnTool();
            },
            createElements: function () {
                webID.config = {
                    $webIDContainer: jQuery('<div>').attr({
                        id: 'webIDContainer'
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
                        })
                };
            },
            buildTool: function () {
                webID.config.$webIDContainer.append(webID.config.$webIDTitle);
                webID.config.$webIDContainer.append(webID.config.$webID);
            },
            cacheDOM: function () {
                this.$cm = unsafeWindow.ContextManager;
                this.webID = this.$cm.getWebId();
            },
            displayData: function () {
                webID.config.$webID.html(this.webID);
            },
            returnTool: function () {
                var panel = webID.config.$webIDContainer;
                return panel;
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
            }
        },

        // ---------------------------------------------------------------
        // --------------------- Page Name ---------------------
        // ---------------------------------------------------------------
        pageName = {
            init: function () {
                this.createElements();
                this.buildTool();
                this.cacheDOM();
                this.displayData();
                this.hide();
                // return finished tool
                return this.returnTool();
            },
            createElements: function () {
                pageName.config = {
                    $pageNameContainer: jQuery('<div>').attr({
                        id: 'pageNameContainer'
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
            buildTool: function () {
                pageName.config.$pageNameContainer.append(pageName.config.$pageNameTitle);
                pageName.config.$pageNameContainer.append(pageName.config.$pageName);
                pageName.config.$pageNameContainer.append(pageName.config.$pageLabelTitle);
                pageName.config.$pageNameContainer.append(pageName.config.$pageLabel);
            },
            cacheDOM: function () {
                this.$cm = unsafeWindow.ContextManager;
                this.pageName = this.$cm.getPageName();
                this.pageLabel = this.$cm.getPageLabel();
            },
            displayData: function () {
                pageName.config.$pageName.html(this.pageName);
                pageName.config.$pageLabel.html(this.pageLabel);
            },
            hide: function () {
                // hide pagel label elements if name
                // is same as page name
                var name = this.pageName,
                    label = this.pageLabel;
                if (name === label) {
                    pageName.config.$pageLabelTitle.hide();
                    pageName.config.$pageLabel.hide();
                }
            },
            returnTool: function () {
                var panel = pageName.config.$pageNameContainer;
                return panel;
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
            }
        },

        /* ************************************************************************************************************************ */
        /* **************************************** QA TOOLS **************************************** */
        /* ************************************************************************************************************************ */

        // ---------------------------------------------------------------
        // --------------------- QA Tools Panel ---------------------
        // ---------------------------------------------------------------
        qaTools = {
            init: function () {
                // initialize module
                this.createElements();
                this.buildPanel();
                this.cacheDOM();
                this.addTool();
                this.addStyles();
                this.bindEvents();
                this.displayPanel();
            },
            createElements: function () {
                qaTools.config = {
                    // ----------------------------------------
                    // QA Tools Panel
                    // ----------------------------------------
                    $mainToolsContainer: jQuery('<div>').attr({
                        class: 'toolBox',
                        id: 'mainToolsContainer'
                    }),
                    $mainToolsPanel: jQuery('<div>').attr({
                        class: 'toolsPanel',
                        id: 'mainTools'
                    }),
                    $mainToolsTitle: jQuery('<div>').attr({
                        class: 'panelTitle',
                        id: 'mainToolsTitle',
                        title: 'Click to Minimize/Maximize'
                    }).text('QA Tools'),
                };
            },
            buildPanel: function () {
                // attach panel elements to container
                //                qaTools.config.$pageInfo
                //                    .append(dealerName.init())
                //                    .append(webID.init())
                //                    .append(pageName.init());

                // attach to continer
                qaTools.config.$mainToolsContainer
                    .append(qaTools.config.$mainToolsTitle)
                    .append(qaTools.config.$mainToolsPanel);
            },
            cacheDOM: function () {
                // DOM elements
                this.$toolbarStyles = jQuery('#qa_toolbox');
                this.$toolBoxContainer = jQuery('#toolboxContainer');
                this.variableList = this.programData();
            },
            addTool: function () {
                // add to main toolbox
                this.$toolBoxContainer.append(qaTools.config.$mainToolsContainer);
            },
            addStyles: function () {
                // apply module styles to main tool bar style tag
                this.$toolbarStyles
                    .append('.tbInfo { background: linear-gradient(to right, #ECE9E6 , #FFFFFF); color: #000000 !important; clear: both; cursor: pointer; line-height: 15px; padding: 3px 0px; text-transform: none; border-top: 1px solid #000000; border-bottom: 1px solid #000000; }')
                    .append('.tbLabel { font-weight: bold; }');
            },
            bindEvents: function () {
                // minimize
                qaTools.config.$mainToolsTitle.on('click', this.toggleFeature);
                qaTools.config.$mainToolsTitle.on('click', this.saveState);
            },
            displayPanel: function () {
                // loop through variable list to find the panel title
                var variables = this.variableList,
                    state = '',
                    key = '';

                for (key in variables) {
                    if (key === 'mainTools') {
                        state = variables[key] ? 'show' : 'hide';
                        this.setState(qaTools.config.$mainToolsPanel, state);
                    }
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            programData: function () {
                var allVariables = GM_listValues(),
                    length = allVariables.length,
                    a = 0,
                    varList = {},
                    key = '',
                    value = '';

                // add variables to list
                for (a; a < length; a += 1) {
                    key = allVariables[a];
                    value = GM_getValue(key, false);
                    varList[key] = value;
                }
                return varList;
            },
            toggleFeature: function () {
                return qaTools.config.$mainToolsPanel.slideToggle('1000');
            },
            saveState: function (event) {
                // get current state
                var vName = jQuery(event.target).siblings('.toolsPanel').attr('id'),
                    currState = GM_getValue(vName, false);
                // sets usingM4 value
                GM_setValue(vName, !currState);
            },
            setState: function ($panel, state) {
                if (state === 'show') {
                    $panel.css({
                        display: 'block'
                    });
                } else if (state === 'hide') {
                    $panel.css({
                        display: 'none'
                    });
                }
            }
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- image checker ----------------------------------------
        // ------------------------------------------------------------------------------------------------------------------------
        imageChecker = {
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
                    $toolsPanel: jQuery('#mainTools'),
                    $legendContainer: jQuery('#legendContainer')
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
                    key = '',
                    value = '';

                // loop through Legend Content list
                for (key in $contentArray) {
                    value = $contentArray[key];
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
                    a = 0,
                    $this;

                // loop through allImages and check for alt text
                for (a; a < iaLength; a += 1) {
                    $this = this.$allImages[a];
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
                for (a; a < iaLength; a += 1) {
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
                    .append('.emptyAlt { background: rgba(255, 124, 216, .75) !important; }'); // end of addStyles
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
                    'line-height': this.heightOfImage + 'px'
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
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- link checker ----------------------------------------
        //------------------------------------------------------------------------------------------------------------------------
        linkChecker = {
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
                        'linkChecked': 'Clicked Link'
                    },
                    $offButt: jQuery('<input>').attr({
                        type: 'button',
                        class: 'myEDOBut offButt',
                        value: 'Turn Off'
                    }),
                    $hint: jQuery('<div>').attr({
                        class: 'hint'
                    }).text('ctrl+left click to open link in a new tab'),
                    $toolsPanel: jQuery('#mainTools'),
                    $legendContainer: jQuery('#legendContainer')
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
                    key = '',
                    value = '',
                    $listItem;

                // loop through Legend Content list
                for (key in $contentArray) {
                    value = $contentArray[key];
                    // build listing element
                    $listItem = jQuery('<li>').attr({
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
                    a = 0,
                    $currentLink,
                    $image,
                    isImageLink;

                // verify all links
                for (a; a < length; a += 1) {

                    $currentLink = jQuery(this.$allLinks[a]);
                    $image = $currentLink.find('img');
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
                for (i; i < length; i += 1) {
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
                    .append('.siteLink.linkChecked, .imgOverlay.linkChecked { background: linear-gradient(to left, rgba(161, 255, 206, 0.75) , rgba(250, 255, 209, 0.75)) !important; color: #909090 !important; }'); // end of addStyles
            },
            isImageLink: function ($image) {
                if ($image.length) {
                    return true;
                }
                return false;
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
                for (a; a < arrlength; a += 1) {
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
                if ((elem.indexOf('#') === 0) || (elem.indexOf('f_') === 0) || (elem.indexOf('www') >= 0) || (elem.indexOf('http') >= 0) || (elem.indexOf('//:') >= 0)) {
                    return true;
                }
                return false;

            },
            // ----------------------------------------
            // tier 5 functions
            // ----------------------------------------
            sizeToImage: function () {
                // make the div overlay the same dimensions as the image
                this.$divOverlay.css({
                    width: this.widthOfImage + 'px',
                    height: this.heightOfImage + 'px',
                    'line-height': this.heightOfImage + 'px'
                });
            },
            addContent: function () {
                this.$divOverlay.append(this.linkTitle);
            }
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- Show Navigation (highlight major pages) ----------------------------------------
        //------------------------------------------------------------------------------------------------------------------------
        showNavigation = {
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
                this.$toolsPanel = jQuery('#mainTools');
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
                    .append('.linkChecked { background: linear-gradient(to left, rgba(161, 255, 206, 0.75) , rgba(250, 255, 209, 0.75)), #ffffff !important; color: #999999 !important; }'); // end of addStyles
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
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- Spell Check ----------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------
        spellCheck = {
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
                this.$toolsPanel = jQuery('#mainTools');
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
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- Test WebPage ----------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------
        speedtestPage = {
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
                this.$toolsPanel = jQuery('#mainTools');
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

    /* ************************************************************************************************************************ */
    /* **************************************** OTHER TOOLS **************************************** */
    /* ************************************************************************************************************************ */

    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- SEO Simplify ----------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------
    var $seo_butt = jQuery('<button>').attr({
        class: 'myEDOBut',
        id: 'simpleSEO',
        title: 'Simplify My SEO Text'
    }).text('SEO Simplify');

    $seo_butt.click(function () {
        var seoSimplify = (function () {
            var oems = [
                "Buick",
                "Cadillac",
                "Chevrolet",
                "GMC",
                "Hyundai",
                "Volkswagen"
            ];
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
        jQuery("#inputDisplay *").find(":empty").remove();
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

    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- View Mobile Site ----------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------
    var viewMobile = {
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
            viewMobile.config = {
                $activateButt: jQuery('<button>').attr({
                    class: 'myEDOBut',
                    id: 'viewMobile',
                    title: 'View Mobile Site'
                }).text('View Mobile Site')
            };
        },
        cacheDOM: function () {
            this.$otherToolsPanel = jQuery('#otherTools');
            this.$cm = unsafeWindow.ContextManager;
            this.siteURL = this.$cm.getUrl();
            this.pageName = this.$cm.getPageName();
        },
        addTool: function () {
            this.$otherToolsPanel.append(viewMobile.config.$activateButt);
        },
        bindEvents: function () {
            viewMobile.config.$activateButt.on('click', this.viewMobile.bind(this));
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        viewMobile: function () {
            var auto = '?device=mobile',
                openThis = this.siteURL + this.pageName + auto;
            GM_openInTab(openThis, 'active');
        },
    };

    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- broken link checker ----------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------
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
                'otherDomain': 'Absolute URL*',
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
            $subText = jQuery('<div>').attr({
                class: 'subText hint'
            }).text('* Manually Check Link'),
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
                // attach sub text
                .append($subText)
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
            }).text('refresh page before running 404 checker again');

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
                curURL = jQuery.trim($curLink.attr('href')),
                hrefLength = curURL.length;

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
            }

            // check urls for '/'
            if (curURL.indexOf('//') === 0) {
                // check URL if it begins with /, signifying the link is a relative path URL
                curURL = curURL.slice(2, hrefLength);
            } else if (curURL.indexOf('/') === 0) {
                curURL = curURL.slice(1, hrefLength);
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

    /* ************************************************************************************************************************ */
    /* **************************************** TOGGLE TOOLS **************************************** */
    /* ************************************************************************************************************************ */

    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- next gen toggle ----------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------
    var nextGenToggle = {
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
                nextGenToggle.config = {
                    $nextGenToggleContainer: jQuery('<div>').attr({
                        id: 'nextGenToggleInput',
                        class: 'toggleTool'
                    }),
                    $nextGenToggleTitle: jQuery('<div>').css({
                            color: 'black',
                            'line-height': '15px'
                        })
                        .text('nextGen Parameters?'),
                    $nextGenToggleIcon: jQuery('<div>').attr({
                        id: 'nextGenToggleIcon'
                    }),
                    $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>')
                };
            },
            buildTool: function () {
                nextGenToggle.config.$nextGenToggleIcon
                    .append(nextGenToggle.config.$FAtoggle);
                nextGenToggle.config.$nextGenToggleContainer
                    .append(nextGenToggle.config.$nextGenToggleTitle)
                    .append(nextGenToggle.config.$nextGenToggleIcon);
            },
            setToggle: function () {
                // get value of custom variable and set toggles accordingly
                if (this.getChecked()) {
                    this.toggleOn();
                    this.applyParameters();
                } else {
                    this.toggleOff();
                    this.applyParameters();
                }
            },
            cacheDOM: function () {
                this.$toolsPanel = jQuery('#urlModTools');
            },
            addTool: function () {
                // add to main toolbox
                this.$toolsPanel.append(nextGenToggle.config.$nextGenToggleContainer);
            },
            bindEvents: function () {
                // bind FA toggle with 'flipTheSwitch' action
                nextGenToggle.config.$nextGenToggleContainer.on('click', this.flipTheSwitch.bind(this));
            },
            hideFeature: function () {
                // hides feature if viewing live site
                if (this.siteState() === 'LIVE') {
                    nextGenToggle.config.$nextGenToggleContainer.toggle();
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            getChecked: function () {
                // grabs isNextGen value
                var a = GM_getValue('isNextGen', false);
                return a;
            },
            toggleOn: function () {
                // set toggle on image
                var $toggle = nextGenToggle.config.$FAtoggle;
                $toggle.removeClass('fa-toggle-off');
                $toggle.addClass('fa-toggle-on');
            },
            applyParameters: function () {
                var hasParameters = this.hasParameters(),
                    siteState = this.siteState(),
                    isNextGen = this.getChecked(),
                    url = '',
                    newURL = '';
                // apply parameters only if DOESN'T already have parameters &&
                // site state IS NOT LIVE &&
                // toggled ON

                // view NEXTGEN site
                if ((!hasParameters) && (siteState !== 'LIVE') && (isNextGen)) {
                    // if nextgen IS NOT in the URL, add nextGen=true
                    window.location.search += '&nextGen=true';
                }

                if ((hasParameters) && (siteState !== 'LIVE') && (isNextGen)) {
                    // if the URL HAS nextGen= BUT it isn't set to true
                    url = window.location.href;

                    if (url.indexOf('nextGen=false') > 0) {
                        // nextGen false parameter detected UPDATE to true
                        newURL = url.replace('nextGen=false', 'nextGen=true');
                        window.location.href = newURL;
                    } else if (url.indexOf('nextGen=true') > 0) {
                        // if next gen = true, do nothing
                    }
                }

                // view TETRA site
                if ((hasParameters) && (siteState !== 'LIVE') && (!isNextGen)) {
                    // if parameters FOUND IN URL and NEXTGEN turned off
                    url = window.location.href;

                    if (url.indexOf('nextGen=true') > 0) {
                        // next gen parameter = TRUE
                        newURL = url.replace('nextGen=true', 'nextGen=false');
                        window.location.href = newURL;
                    } else if (url.indexOf('nextGen=false') > 0) {
                        // if next gen = FALSE, do nothing
                    }
                }

                // if URL DOES NOT HAVE PARAMETERS and toggle is turned off
                if ((!hasParameters) && (siteState !== 'LIVE') && (!isNextGen)) {
                    // if nextgen IS NOT in the URL, add nextGen=false
                    window.location.search += '&nextGen=false';
                }
            },
            toggleOff: function () {
                // set toggle off image
                var $toggle = nextGenToggle.config.$FAtoggle;
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
                if (window.location.href.indexOf('nextGen=') >= 0) {
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
                // sets isNextGen value
                GM_setValue('isNextGen', bool);
            }
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- m4 checkbox toggle ----------------------------------------
        // ------------------------------------------------------------------------------------------------------------------------
        m4Check = {
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
                        id: 'm4Input',
                        class: 'toggleTool'
                    }),
                    $m4CheckTitle: jQuery('<div>').css({
                            color: 'black',
                            'line-height': '15px'
                        })
                        .text('M4 Parameters?'),
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
                this.$toolsPanel = jQuery('#urlModTools');
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
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- Refresh Page toggle ----------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------
        refreshPage = {
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
                        id: 'refreshMe',
                        class: 'toggleTool'
                    }),
                    $refreshButt: jQuery('<button>').attr({
                        class: 'myEDOBut draggable ui-widget-content',
                        id: 'refreshPage',
                        title: 'Refresh Page from Server '
                    }).css({
                        background: 'linear-gradient(to left, #FBD3E9 , #BB377D)',
                        width: '75px',
                        position: 'fixed',
                        left: '0px',
                        top: '60px',
                        'z-index': '1000000',
                        display: 'none'
                    }).draggable({
                        containment: "body",
                        scroll: false
                    }),
                    $refresh: jQuery('<i class="fa fa-undo fa-flip-horizontal fa-3x">&nbsp;</i>').css({
                        'margin-left': '-10px'
                    }),
                    $refreshTitle: jQuery('<div>').css({
                            color: 'black',
                            'line-height': '15px'
                        })
                        .text('Refresh Button'),
                    $refreshCheckbox: jQuery('<div>').attr({
                        id: 'refreshMetoggle'
                    }),
                    $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>')
                };
            },
            cacheDOM: function () {
                this.$togglesPanel = jQuery('#toggleTools');
                this.$togglesContainer = jQuery('#togglesContainer');
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
                this.$togglesPanel.append(refreshPage.config.$refreshContainer);
                this.$togglesContainer.append(refreshPage.config.$refreshButt);
            },
            bindEvents: function () {
                refreshPage.config.$refreshButt.on('click', this.reloadPage);
                refreshPage.config.$refreshContainer.on('click', this.flipTheSwitch.bind(this));
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
                // grabs useRefreshButton value
                var a = GM_getValue('useRefreshButton', false);
                return a;
            },
            setChecked: function (bool) {
                // sets useRefreshButton value
                GM_setValue('useRefreshButton', bool);
            }
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- autofill toggle ----------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------
        autofillToggle = {
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
                autofillToggle.config = {
                    $autofillToggleContainer: jQuery('<div>').attr({
                        id: 'autofillToggleInput',
                        class: 'toggleTool'
                    }),
                    $autofillToggleTitle: jQuery('<div>').css({
                            color: 'black',
                            'line-height': '15px'
                        })
                        .text('show autofill tags?'),
                    $autofillToggleIcon: jQuery('<div>').attr({
                        id: 'autofillToggleIcon'
                    }),
                    $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>')
                };
            },
            buildTool: function () {
                autofillToggle.config.$autofillToggleIcon
                    .append(autofillToggle.config.$FAtoggle);
                autofillToggle.config.$autofillToggleContainer
                    .append(autofillToggle.config.$autofillToggleTitle)
                    .append(autofillToggle.config.$autofillToggleIcon);
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
                this.$toolsPanel = jQuery('#urlModTools');
            },
            addTool: function () {
                // add to main toolbox
                this.$toolsPanel.append(autofillToggle.config.$autofillToggleContainer);
            },
            bindEvents: function () {
                // bind FA toggle with 'flipTheSwitch' action
                autofillToggle.config.$autofillToggleContainer.on('click', this.flipTheSwitch.bind(this));
            },
            hideFeature: function () {
                // hides feature if viewing live site
                if (this.siteState() === 'LIVE') {
                    autofillToggle.config.$autofillToggleContainer.toggle();
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            getChecked: function () {
                // grabs applyAutofill value
                var a = GM_getValue('applyAutofill', false);
                return a;
            },
            toggleOn: function () {
                // set toggle on image
                var $toggle = autofillToggle.config.$FAtoggle;
                $toggle.removeClass('fa-toggle-off');
                $toggle.addClass('fa-toggle-on');
            },
            applyParameters: function () {
                var hasParameters = this.hasParameters();
                var siteState = this.siteState();
                var applyAutofill = this.getChecked();
                // apply parameters only if DOESN'T already have parameters &&
                // site state IS NOT LIVE &&
                // toggled ON
                if ((!hasParameters) && (siteState !== 'LIVE') && (applyAutofill)) {
                    window.location.search += '&disableAutofill=true';
                }
            },
            toggleOff: function () {
                // set toggle off image
                var $toggle = autofillToggle.config.$FAtoggle;
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
                if (window.location.href.indexOf('&disableAutofill=true') >= 0) {
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
                // sets applyAutofill value
                GM_setValue('applyAutofill', bool);
            }
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- force desktop site toggle ----------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------
        desktopToggle = {
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
                desktopToggle.config = {
                    $desktopToggleContainer: jQuery('<div>').attr({
                        id: 'desktopToggleInput',
                        class: 'toggleTool'
                    }),
                    $desktopToggleTitle: jQuery('<div>').css({
                            color: 'black',
                            'line-height': '15px'
                        })
                        .text('force desktop site?'),
                    $desktopToggleIcon: jQuery('<div>').attr({
                        id: 'desktopToggleIcon'
                    }),
                    $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>')
                };
            },
            buildTool: function () {
                desktopToggle.config.$desktopToggleIcon
                    .append(desktopToggle.config.$FAtoggle);
                desktopToggle.config.$desktopToggleContainer
                    .append(desktopToggle.config.$desktopToggleTitle)
                    .append(desktopToggle.config.$desktopToggleIcon);
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
                this.$toolsPanel = jQuery('#urlModTools');
            },
            addTool: function () {
                // add to main toolbox
                this.$toolsPanel.append(desktopToggle.config.$desktopToggleContainer);
            },
            bindEvents: function () {
                // bind FA toggle with 'flipTheSwitch' action
                desktopToggle.config.$desktopToggleContainer.on('click', this.flipTheSwitch.bind(this));
            },
            hideFeature: function () {
                // hides feature if viewing live site
                if (this.siteState() === 'LIVE') {
                    desktopToggle.config.$desktopToggleContainer.toggle();
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            getChecked: function () {
                // grabs isNextGen value
                var a = GM_getValue('forceDesktop', false);
                return a;
            },
            toggleOn: function () {
                // set toggle on image
                var $toggle = desktopToggle.config.$FAtoggle;
                $toggle.removeClass('fa-toggle-off');
                $toggle.addClass('fa-toggle-on');
            },
            applyParameters: function () {
                var hasParameters = this.hasParameters();
                var siteState = this.siteState();
                var forceDesktop = this.getChecked();
                // apply parameters only if DOESN'T already have parameters &&
                // site state IS NOT LIVE &&
                // toggled ON
                if ((!hasParameters) && (siteState !== 'LIVE') && (forceDesktop)) {
                    window.location.search += '&device=immobile';
                }
                if ((!hasParameters) && (siteState !== 'LIVE') && (!forceDesktop)) {

                }
            },
            toggleOff: function () {
                // set toggle off image
                var $toggle = desktopToggle.config.$FAtoggle;
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
                if (window.location.href.indexOf('&device=immobile') >= 0) {
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
                // sets forceDesktop value
                GM_setValue('forceDesktop', bool);
            }
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- hide preview toolbar toggle ----------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------
        previewToolbarToggle = {
            init: function () {
                this.createElements();
                this.buildTool();
                this.cacheDOM();
                this.setToggle();
                this.addTool();
                this.bindEvents();
                //        this.hideFeature();
            },
            // ----------------------------------------
            // tier 1 functions
            // ----------------------------------------
            createElements: function () {
                previewToolbarToggle.config = {
                    $previewToolbarToggleContainer: jQuery('<div>').attr({
                        id: 'previewToolbarToggleInput',
                        class: 'toggleTool'
                    }),
                    $previewToolbarToggleTitle: jQuery('<div>').css({
                        color: 'black',
                        'line-height': '15px'
                    }).text('hide preview toolbar?'),
                    $previewToolbarToggleIcon: jQuery('<div>').attr({
                        id: 'previewToolbarToggleIcon'
                    }),
                    $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>')
                };
            },
            buildTool: function () {
                previewToolbarToggle.config.$previewToolbarToggleIcon
                    .append(previewToolbarToggle.config.$FAtoggle);
                previewToolbarToggle.config.$previewToolbarToggleContainer
                    .append(previewToolbarToggle.config.$previewToolbarToggleTitle)
                    .append(previewToolbarToggle.config.$previewToolbarToggleIcon);
            },
            setToggle: function () {
                // get value of custom variable and set toggles accordingly
                if (this.getChecked()) {
                    this.toggleOn();
                    this.togglePreviewToolbar();
                } else {
                    this.toggleOff();
                    this.togglePreviewToolbar();
                }
            },
            cacheDOM: function () {
                this.$toolsPanel = jQuery('#toggleTools');
                this.$toolbarStyles = jQuery('#qa_toolbox');
            },
            addTool: function () {
                // add to main toolbox
                this.$toolsPanel.append(previewToolbarToggle.config.$previewToolbarToggleContainer);
            },
            bindEvents: function () {
                // bind FA toggle with 'flipTheSwitch' action
                previewToolbarToggle.config.$previewToolbarToggleContainer.on('click', this.flipTheSwitch.bind(this));
                previewToolbarToggle.config.$previewToolbarToggleContainer.on('click', '#previewToolBarFrame', this.togglePreviewToolbar);
            },
            hideFeature: function () {
                // hides feature if viewing live site
                if (this.siteState() === 'LIVE') {
                    previewToolbarToggle.config.$previewToolbarToggleContainer.toggle();
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            getChecked: function () {
                // grabs isNextGen value
                var a = GM_getValue('hidePreviewToolbar', false);
                return a;
            },
            toggleOn: function () {
                // set toggle on image
                var $toggle = previewToolbarToggle.config.$FAtoggle;
                $toggle.removeClass('fa-toggle-off');
                $toggle.addClass('fa-toggle-on');
            },
            togglePreviewToolbar: function () {
                var hidePreviewToolbar = this.getChecked();
                // apply parameters only if DOESN'T already have parameters &&
                // site state IS NOT LIVE &&
                // toggled ON
                if (hidePreviewToolbar) {
                    this.$toolbarStyles.append(' #previewToolBarFrame { display: none; }');
                    this.$toolbarStyles.append(' .preview-wrapper { display: none; }');
                } else {
                    this.$toolbarStyles.append(' #previewToolBarFrame { display: block; }');
                    this.$toolbarStyles.append(' .preview-wrapper { display: block; }');
                }
            },
            toggleOff: function () {
                // set toggle off image
                var $toggle = previewToolbarToggle.config.$FAtoggle;
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
            setChecked: function (bool) {
                // sets hidePreviewToolbar value
                GM_setValue('hidePreviewToolbar', bool);
            }
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- dynamic panel ----------------------------------------
        // ------------------------------------------------------------------------------------------------------------------------
        dynamicDisplay = {
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
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- initialize toolbox ----------------------------------------
        // ------------------------------------------------------------------------------------------------------------------------
        runProgram = {
            init: function () {
                if (!this.editMode() && this.isCDKsite() && !this.isMobile()) {
                    QAtoolbox.init(); // initialize toolbox
                    pageInformation.init(); // initialize page Information tool

                    // ----- main tools ----- //
                    imageChecker.init(); // initialize image checker tool
                    linkChecker.init(); // initialize link checker tool
                    showNavigation.init(); // initialize show navigation tool
                    spellCheck.init(); // initialize spell check tool
                    speedtestPage.init(); // initialize page test tool
                    // 404 checker button
                    jQuery('#mainTools').append($404checker_butt);

                    // ----- other tools ----- //
                    viewMobile.init(); // initialize view mobile tool
                    jQuery('#otherTools').append($seo_butt);
                    jQuery('#otherTools').append($wo_butt);

                    // ----- toggle tools ----- //
                    nextGenToggle.init(); // initialize nextGen toggle
                    m4Check.init(); // initialize milestone 4 module check box
                    refreshPage.init(); // initialize refresh page
                    autofillToggle.init(); // initialize autofill toggle
                    desktopToggle.init(); // initialize desktop toggle
                    previewToolbarToggle.init(); // initialize desktop toggle

                    dynamicDisplay.init(); // initialize display information tool

                    // style buttons in toolbox
                    QAtoolbox.styleTools();
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

})();
