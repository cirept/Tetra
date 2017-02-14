/*jslint devel: true*/
/*global jQuery,unsafeWindow,GM_setClipboard */
function dealerName() {
    "use strict";

    // ---------------------------------------------------------------
    // --------------------- Web Id ---------------------
    // ---------------------------------------------------------------
    var pageName = {
        init: function () {
            this.createElements();
            this.buildTool();
            this.cacheDOM();
            this.displayData();
            this.hide();
            this.bindEvents();
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
            pageName.config.$webIDContainer.append(pageName.config.$pageNameTitle);
            pageName.config.$webIDContainer.append(pageName.config.$pageName);
            pageName.config.$webIDContainer.append(pageName.config.$pageLabelTitle);
            pageName.config.$webIDContainer.append(pageName.config.$pageLabel);
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
                pageName.config.$pageLabelTitle.toggle();
                pageName.config.$pageLabel.toggle();
            }
        },
        bindEvents: function () {
            // hover effect
            pageName.config.$pageName.on('mouseover mouseleave', '.tbInfo', this.hoverEffect);
            // click
            pageName.config.$pageName.on('click', '.tbInfo', this.copyToClipboard);
            // hover effect
            pageName.config.$pageLabel.on('mouseover mouseleave', '.tbInfo', this.hoverEffect);
            // click
            pageName.config.$pageLabel.on('click', '.tbInfo', this.copyToClipboard);
        },
        returnTool: function () {
            var panel = pageName.config.$webIDContainer;
            console.log(panel);
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
    };

}
