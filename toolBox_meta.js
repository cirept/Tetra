// ==UserScript==
// @name QA Toolbox
// @namespace www.cobaltgroup.com/
// @include http:*
// @version 2.7.7
// @downloadURL https://cdn.rawgit.com/cirept/Tetra/master/toolBox_meta.js
// @run-at document-end
// @description Makes life easier... I hope.
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require https://use.fontawesome.com/3953f47d82.js
// @require https://cdn.rawgit.com/cirept/Tetra/2.7.7/toolBox.js
// @author Eric Tanaka
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_info
// @grant GM_listValues
// @noframes
// ==/UserScript==

// ----------------------------------------
// 2.7.7 updates
/* ----------------------------------------
- TOOLBAR LOOK UPDATED
---- Separated out tools into individual panel sections
---- Added minimize button for entire toolbar
---- Added collapsable panel sections (click the panel title to minimize section)
---- Added version number at the bottom to track changes
---- Legend look has been updated
---- Added UI effects
- NEW TOOLS ADDED
---- 404 Checker Button
-------- Will test all links on the page to verify that it works
---- View mobile site Button
-------- Will open a new tab with the mobile site
---- Refresh button Toggle
-------- Will refresh the site
---- Hide Preview Toolbar Toggle (nextGen Sites only)
-------- Will hide the CDK Global PCE toolbar at the top of the site
---- NextGen Parameter toggle
-------- Will force the nextGen site to show, if available.  Will cause site error if nextGen option for page is not available
---- m4 Parameters toggle
-------- Will apply "&comments=true&relative=true" to current URL
---- show autofill tags toggles
-------- Will show all autofill tags on page
---- force desktop site toggle (TETRA)
-------- Will apply "device=immobile" to force desktop site
---- Page informaiton
-------- Added more page details
---------------------------------------- */
