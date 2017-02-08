// function to add attributes to button according to module specifics
function addAttributes($button, module) {
    $button.attr({
        class: 'myEDOBut',
        id: module.id,
        title: module.description
    }).text(module.name);
}

//show auto fill module
var showAutofill = {
    id: 'showAutofill',
    name: 'Show Autofill Tags',
    description: 'Show all autofill tags on the current webpage.',
    URL: '?disableAutofill=true',
    siteURL: unsafeWindow.ContextManager.getUrl(),
    pageName: unsafeWindow.ContextManager.getPageName()
};

// build html elements
var $autoFill_butt = jQuery('<button>');

// add function to the html element
$autoFill_butt.click(function () {
    GM_openInTab(showAutofill.siteURL + showAutofill.pageName + showAutofill.URL, 'active');
});

// add attributes to button object
addAttributes($autoFill_butt, showAutofill);

// Add button to toolbar panel
jQuery($toolsPanel).append($autoFill_butt);
