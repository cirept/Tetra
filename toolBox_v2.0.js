// ==UserScript==
// @name My Toolbox
// @namespace www.cobaltgroup.com/
// @include http:*
// @version 2.0
// @downloadURL http://media-dmg.assets-cdk.com/teams/repository/export/460/264509aae1005845e0050568ba825/460264509aae1005845e0050568ba825.js
// @run-at document-end
// @description Makes life easier... I hope.
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.js
// @author Eric Tanaka
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant unsafeWindow
// ==/UserScript==

function checkTarget(elem) {
	if ((jQuery(elem).attr("target") === "_blank") || (jQuery(elem).attr("target") === "_new")) {
		return true;
	}
}

function addDiv(elem, width, height) {
	jQuery("<div class='imgOverlay' />").attr("style", "width: " + width + "px; height: " + height + "px;").insertBefore(jQuery(elem).css("position", "relative"));
}

function addLinkDiv(elem, width, height) {
	jQuery(elem).css("position", "relative").prepend(jQuery("<div class='linkOverlay' />").attr("style", "width: " + width + "px; height: " + height + "px;").append(jQuery(elem).attr('title')));
	// jQuery("<div class='linkOverlay' />").attr("style", "width: " + width + "px; height: " + height + "px;").prependTo(jQuery(elem).css("position", "relative"));
}

function phoneWrapper() {
	if (jQuery('body .phone-wrapper').length > 0) {
		return true;
	} else {
		return false;
	}
}

var cm = unsafeWindow.ContextManager,
	em = unsafeWindow.editMode,
	cmv = cm.getVersion(),
	csv = (cmv === 'WIP' || cmv === 'PROTO' || cmv === 'LIVE'),
	wID = cm.getWebId(),
	pw = phoneWrapper();

if (!em && csv && !pw) {

	jQuery("head").append('<style type="text/css"> .myEDOBut { font-size: 11px; top: 15%; position: relative; width: 100%; height: 35px; margin: 1px 0px 0px 10px; border-radius: 5px; border: 2px solid rgb(0,0,0);} .myEDOBut:hover { background: black !important; color: white !important; } .showNav { display: block !important; } .linkChecked { background: rgba(96, 223, 229, .75) !important; color: white !important; } .linkOverlay { position: absolute; top: 0; left: 0; z-index: 1; } .hasTitle { background: rgba(146, 232, 66, .75) !important; color: white !important; } .noTitle { background: rgba(255, 124, 216, .75) !important; color: white !important; } .emptyTitle { background: rgba(255, 124, 216, .75) !important; color: white !important; } .hasTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(146, 232, 66, 0.75) 26%, rgba(146, 232, 66, 0.75) 99%, rgba(146, 232, 66, 0.75) 100%) !important; } .noTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; } .emptyTitle.opensWindow { background: linear-gradient(to right, rgba(255, 165, 0, 0.75) 0%, rgba(255, 165, 0, 0.75) 25%, rgba(255, 124, 216, 0.75) 26%, rgba(255, 124, 216, 0.75) 100%) !important; } .imgOverlay { position: absolute; top: 0; left: 0; z-index: 1; } .hasAlt { background: rgba(146, 232, 66, .75) !important; color: white !important; } .noAlt { background: rgba(255, 124, 216, .75) !important; color: white !important; } .emptyAlt { background: rgba(255, 124, 216, .75) !important; color: white !important; } .CobaltEditableWidget:after { content: attr(data-content); position: absolute; top: 0; z-index: 100; left: 5%; background: rgba(96, 223, 229, .75); color: white; font-weight: bold; font-size: 10px; } </style>');

	var but_imageChecker = jQuery("<button class='myEDOBut' id='imageChecker' title='Image Alt Checker'>Image Alt Checker</button>"),
		but_linkChecker = jQuery("<button class='myEDOBut' id='linkChecker' title='Check Title Text'>Link Checker</button>"),
		but_widgetOutline = jQuery("<button class='myEDOBut' id='widgetOutline' title='Show Widget Outlines'>Show Widgets</button>"),
		but_showNavigation = jQuery("<button class='myEDOBut' id='showNavigation' title='Show Full Navigation'>Show Navigation</button>"),
		but_showMajor = jQuery("<button class='myEDOBut' id='showMajor' title='Show Navigation : Major Pages'>Show Major Pages</button>"),
		but_showAutofill = jQuery("<button class='myEDOBut' id='showAutofill' title='Show Autofill Tags (Only the Homepage)'>Show Autofill Tags</button>"),
		but_WPT = jQuery("<button class='myEDOBut' id='wpt' title='Queue up a Page Test'>Web Page Test</button>"),
		but_SEO = jQuery("<button class='myEDOBut' id='seo' title='Simplify My SEO Text'>SEO Simplify</button>");

	var webID = jQuery('<div title="Copy web-id" style="clear: both; background: white; cursor: pointer; padding: 5px 0;">' + wID + '</div>');
	jQuery(webID).click(function () {
		GM_setClipboard(jQuery(this).html(), 'text');
		console.log('copied webid to clipboard');
	});
	jQuery("body").append(jQuery("<div id='myToolbox' style='text-align: right; background: linear-gradient(to right, #a8e063 0%, #56ab2f 100%); position: fixed; top: 10%; width: 135px; border: 1px solid black; z-index: 100000;'/>").append("<span style='float: right; color: white;'>My Tool Box</span>").append(webID).append(but_imageChecker).append(but_linkChecker).append(but_widgetOutline).append(but_showNavigation).append(but_showMajor).append(but_showAutofill).append(but_WPT).append(but_SEO));
	jQuery("#myToolbox").children(".myEDOBut:even").css({
		"background": "linear-gradient(to left,#00d2ff 0,#3a7bd5 100%)"
	});
	jQuery("#myToolbox").children(".myEDOBut:odd").css({
		"background": "linear-gradient(to left, #4b6cb7 0px, #182848 100%)"
	});

	but_imageChecker.click(function () {
		jQuery("body img").each(function () {
			var isImageLink = true;
			var w = jQuery(this).width(),
				h = jQuery(this).height();
			addDiv(this, w, h);

			jQuery(this).click(function () {
				jQuery(this).before(jQuery("<span style='position: absolute; left: -20px; color: green;' class='linkChecked'><i class='fa fa-check-circle fa-lg'>&nbsp;</i></span>"));
			});

			if (checkTarget(this)) {
				if (isImageLink) {
					jQuery(this).find(".imgOverlay").addClass("opensWindow");
				} else {
					jQuery(this).addClass("opensWindow");
				}
			}

			if (jQuery(this).attr("alt") !== undefined) {
				if (jQuery(this).attr("alt") === '') {
					if (isImageLink) {
						jQuery(this).siblings(".imgOverlay").addClass("emptyAlt");
					} else {
						jQuery(this).addClass("emptyAlt");
					}
				} else {
					if (isImageLink) {
						jQuery(this).siblings(".imgOverlay").addClass("hasAlt");
						jQuery(this).siblings(".imgOverlay").attr("title", jQuery(this).attr("alt"));
					} else {
						jQuery(this).addClass("hasAlt");
					}
				}
			} else {
				if (isImageLink) {
					jQuery(this).siblings(".imgOverlay").addClass("noAlt");
				} else {
					jQuery(this).addClass("noAlt");
				}
			}
		});

		var jQuerya = jQuery("<input type='button' class='myButton' value='Remove' style='position: fixed; bottom: 10%; left: 95px; padding: 50px; z-index: 100000;'>").click(function () {
			jQuery("body img").removeClass("opensWindow").removeClass("emptyAlt").removeClass("hasAlt").removeClass("noAlt");
			jQuery("div.imgOverlay").remove();
			colorLegend.remove();
			jQuery(this).remove();
		});

		var colorLegend = jQuery("<div id='linkLegend' style='background: white; border: 3px solid black; height: 100px; width: 200px; position: fixed; bottom: 25%; left: 75px; z-index: 100000;' />"),
			legendTitle = jQuery("<div id='linkLegendTitle' style='text-align: center; margin: 0 auto; padding-top 5%;'>Image Checker Legend</div>"),
			jQuerynoAlt = jQuery("<div class='noAlt' style='color: black !important; line-height: 1em; font-size: 1em; width: 80%; height: 10%; margin: 10px;'>HAS NO alt text</div>"),
			jQueryhasAlt = jQuery("<div class='hasAlt'  style='color: black !important; line-height: 1em; font-size: 1em; width: 80%; height: 10%; margin: 10px;'>HAS alt text</div>");

		jQuery(colorLegend).append(legendTitle).append(jQuerynoAlt).append(jQueryhasAlt);
		jQuery("#content").append(jQuerya).append(colorLegend);
	});

	but_linkChecker.click(function () {

		jQuery("body a").each(function () {
			var isImageLink = false;
			if ((jQuery(this).has("img").length)) {
				var w = jQuery(this).has("img").width(),
					h = jQuery(this).height();
				addLinkDiv(this, w, h);
				isImageLink = true;
			}
			jQuery(this).click(function () {

				if (isImageLink) {
					jQuery(this).find(".linkOverlay").attr("class", "linkOverlay linkChecked").append(jQuery("<span style='position: absolute; left: 5px; color: white;'><i class='fa fa-check-circle fa-3x'>&nbsp;</i></span>"));
				} else {
					jQuery(this).attr("class", "linkChecked");
				}
			});
			if (checkTarget(this)) {
				if (isImageLink) {
					jQuery(this).find(".linkOverlay").addClass("opensWindow");
				} else {
					jQuery(this).addClass("opensWindow");
				}
			}
			if (jQuery(this).attr("title") !== undefined) {
				if (jQuery(this).attr("title") === '') {
					if (isImageLink) {
						jQuery(this).find(".linkOverlay").addClass("emptyTitle");
					} else {
						jQuery(this).addClass("emptyTitle");
					}
				} else {
					if (isImageLink) {
						jQuery(this).find(".linkOverlay").addClass("hasTitle");
					} else {
						jQuery(this).addClass("hasTitle");
					}
				}
			} else {
				if (isImageLink) {
					jQuery(this).find(".linkOverlay").addClass("noTitle");
				} else {
					jQuery(this).addClass("noTitle");
				}
			}
		});

		var b = jQuery("<input type='button' class='myButton' value='Remove' style='position: fixed; bottom: 10%; left: 95px; padding: 50px; z-index: 100000;'>").click(function () {
			jQuery("body a").removeClass("opensWindow").removeClass("emptyTitle").removeClass("hasTitle").removeClass("noTitle");
			jQuery("div.linkOverlay").remove();
			jQuery("div.linkChecked").remove();
			colorLegend.remove();
			jQuery(this).remove();
		});

		var colorLegend = jQuery("<div id='linkLegend' style='background: white; border: 3px solid black; height: 100px; width: 200px; position: fixed; bottom: 25%; left: 75px; z-index: 100000;' />"),
			legendTitle = jQuery("<div id='linkLegendTitle' style='text-align: center; margin: 0 auto;'>Link Checker Legend</div>"),
			noTitle = jQuery("<div class='noTitle' style='color: black !important; line-height: 1em; font-size: 1em; width: 80%; height: 10%; margin: 10px;'>HAS NO title text</div>"),
			hasTitle = jQuery("<div class='hasTitle'  style='color: black !important; line-height: 1em; font-size: 1em; width: 80%; height: 10%; margin: 10px;'>HAS title text</div>"),
			opensWindow = jQuery("<div class='opensWindow' style='color: black !important; line-height: 1em; font-size: 1em; width: 80%; height: 10%; margin: 10px; background: linear-gradient(to right, rgba(255,165,0,0.75) 0%, rgba(255,165,0,0.75) 25%, transparent 25%, transparent 100%) !important;'>OPENS IN A NEW WINDOW</div>");

		jQuery(colorLegend).append(legendTitle).append(noTitle).append(hasTitle).append(opensWindow);
		jQuery("#content").append(b).append(colorLegend);
	});

	but_widgetOutline.click(function () {
		jQuery(".masonry-brick").css("border", "1px dotted pink");
		jQuery("div[class*=colorBlock]").css("z-index", "0");
		jQuery("body .cell .CobaltEditableWidget").each(function () {
			var widgetID = jQuery(this).attr("id");
			var w = jQuery(this).width(),
				h = jQuery(this).height();
			jQuery(this).append(function () {
				jQuery(this).attr("data-content", widgetID + " :: " + w + "px X " + h + "px");
			});
		});
	});

	but_showNavigation.click(function () {

		jQuery("#pmenu ul").addClass("showNav");
		jQuery("#pmenu ul a[[href]").each(function () {
			jQuery(this).click(function () {
				jQuery(this).attr("style", "background: rgba(96,223,229,1); color: white;");
			});
		});

		var jQueryc = jQuery("<input type='button' class='myButton' value='Remove' style='position: fixed; bottom: 10%; left: 95px; padding: 50px; z-index: 100000;'>").click(function () {
			jQuery("#pmenu ul").removeClass("showNav");
			jQuery("#pmenu a").each(function () {
				jQuery(this).removeAttr("style");
			});
			jQuery(this).remove();
		});

		jQuery("#content").append(jQueryc);

	});

	but_showMajor.click(function () {

		jQuery("#pmenu a[href*=Form],#pmenu a[href*=ContactUs],#pmenu a[href=HoursAndDirections],#pmenu a[href*=VehicleSearchResults]").attr("style", "background: pink; color: white;");
		jQuery("#pmenu ul a[href]").each(function () {
			jQuery("#pmenu ul").addClass("showNav");
			jQuery(this).click(function () {
				jQuery(this).attr("style", "background: rgba(96,223,229,1); color: white;");
			});
		});

		var jQueryd = jQuery("<input type='button' class='myButton' value='Remove' style='position: fixed; bottom: 10%; left: 95px; padding: 50px; z-index: 100000;'>").click(function () {
			jQuery("#pmenu ul").removeClass("showNav");
			jQuery("#pmenu a").each(function () {
				jQuery(this).removeAttr("style");
			});
			jQuery(this).remove();
		});

		jQuery("#content").append(jQueryd);
	});

	but_showAutofill.click(function () {
		var x = "?disableAutofill=true",
			z = cm.getUrl(),
			y = jQuery(location).attr('href'),
			newTab;
		newTab = GM_openInTab(z + x, 'active');
	});

	but_WPT.click(function () {
		var testURL = "http://www.webpagetest.org/runtest.php?",
			siteURL = cm.getUrl(),
			params = {
				k: "A.1b40e6dc41916bd77b0541187ac9e74b",
				runs: "3",
				fvonly: "1",
				notify: "eric.tanaka@cdk.com"
			},
			newTab, dURL, mURL;

		// build urls
		jQuery.each(params, function (index, value) {
			console.log(index + ": " + value);
			testURL += index + "=" + value + "&";
		});
		dURL = testURL + "url=" + siteURL + "?device=immobile";
		mURL = testURL + "url=" + siteURL + "?device=mobile";

		if (confirm('----------------------------------------\nTest the Desktop and Mobile site?\n----------------------------------------') === true) {
			newTab = GM_openInTab(dURL, true);
			newTab = GM_openInTab(mURL, true);
		}
	});

	but_SEO.click(function () {
		var userInput = jQuery.trim(prompt("Enter Your SEO Text - HTML format")),
			removeBut = jQuery("<input type='button' value='REMOVE' id='removeDiv'/>"),
			inputDisplay = jQuery("<div id='inputDisplay' style='padding: 10px;'/>");

		var oems = [
			"Acura",
			"Alfa Romeo",
			"Aston Martin",
			"Audi",
			"BMW",
			"Bentley",
			"Buick",
			"Cadillac",
			"Chevrolet",
			"Chrysler",
			"Dodge",
			"FIAT",
			"Ferrari",
			"Ford",
			"Freightliner",
			"GMC",
			"Honda",
			"Hyundai",
			"Infiniti",
			"Isuzu",
			"Jaguar",
			"Jeep",
			"Kia",
			"LINCOLN",
			"Lamborghini",
			"Land Rover",
			"Lexus",
			"MINI",
			"Maserati",
			"Mazda",
			"McLaren",
			"Mercedes-Benz",
			"Mitsubishi",
			"Nissan",
			"Porsche",
			"Ram",
			"Rolls-Royce",
			"Scion",
			"Smart",
			"Subaru",
			"Tesla",
			"Toyota",
			"Volkswagen",
			"Volvo"];

		var chevrolet = [];
		var Camaro = {
			name: "Camaro",
			url: "models/chevrolet-camaro"
		};
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
		var SS = {
			name: "SS",
			url: "models/chevrolet-ss"
		};
		chevrolet.push(SS);
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

		function isUndefined(elem) {
			"use strict";
			if (jQuery(elem).attr("title") !== undefined) {
				return false;
			} else {
				return true;
			}
		}

		function titleEmpty(elem) {
			"use strict";
			if (jQuery(elem).attr("title") === "") {
				return true;
			} else {
				return false;
			}
		}

		function emptyTarget(elem) {
			"use strict";
			if ((jQuery(elem).attr("target") !== undefined) && (jQuery(elem).attr("target") === "")) {
				jQuery(elem).removeAttr("target");
			}
		}

		function isDetailsLink(elem) {
			"use strict";
			if (jQuery(elem).attr("href").indexOf("ModelDetails_D") > -1) {
				return true;
			} else {
				return false;
			}
		}

		function matchOEM(elem) {
			var value = "no match found";
			jQuery(oems).each(function (index, oem) {
				if (elem.indexOf(oem) >= 0) {
					value = oem;
				}
			});
			return value;
		}

		function getURL(make, model) {
			var modelURL = "";
			if (model.trim().indexOf(" ") >= 0) {
				var mArray = model.split(" ");
				if (model.indexOf("HD") >= 0) {
					jQuery(mArray).each(function (index, elem) {
						if (elem.indexOf("HD") >= 0) {
							model = mArray[index - 1] + mArray[index];
							mArray.splice(index, 1);
							mArray[index - 1] = model;
						}
					});
					model = mArray.join("_");
				}
			}
			switch (make) {
			case "Chevrolet":
				jQuery.each(chevrolet, function (i, elem) {
					if (model.indexOf(elem.name) >= 0) {
						modelURL = elem.url;
						return false;
					}
				});
				return modelURL;
			case "GMC":
				jQuery.each(gmc, function (i, elem) {
					if (model.indexOf(elem.name) >= 0) {
						modelURL = elem.url;
						return false;
					}
				});
				return modelURL;
			case "Cadillac":
				jQuery.each(cadillac, function (i, elem) {
					if (model.indexOf(elem.name) >= 0) {
						modelURL = elem.url;
						return false;
					}
				});
				return modelURL;
			case "Hyundai":
				jQuery.each(hyundai, function (i, elem) {
					if (model.indexOf(elem.name) >= 0) {
						modelURL = elem.url;
						return false;
					}
				});
				return modelURL;
			case "Volkswagen":
				jQuery.each(volkswagen, function (i, elem) {
					if (model.indexOf(elem.name) >= 0) {
						modelURL = elem.url;
						return false;
					}
				});
				return modelURL;
			case "Buick":
				jQuery.each(buick, function (i, elem) {
					if (model.indexOf(elem.name) >= 0) {
						modelURL = elem.url;
						return false;
					}
				});
				return modelURL;
			default:
			}
		}

		function replaceURL(elem) {
			"use strict";
			var linkURL = jQuery(elem).attr("href"),
				searchTerm = "LINKCONTEXTNAME_",
				model = linkURL.substr(linkURL.indexOf(searchTerm) + searchTerm.length, linkURL.length),
				compareThis = linkURL.substr(linkURL.indexOf(searchTerm) + searchTerm.length, linkURL.indexOf(" ")),
				make = matchOEM(compareThis);

			model = model.substr(model.indexOf(make) + make.length, model.length);
			var url = getURL(make, model);
			return url;
		}

		function removeUgly(elem) {
			var linkURL = jQuery(elem).attr("href"),
				linkPage = "%LINKPAGENAME_";
			if (linkURL.indexOf(linkPage) >= 0) {
				var newURL = linkURL.substr(linkURL.indexOf(linkPage) + linkPage.length, linkURL.length);
				jQuery(elem).attr("href", newURL);
			}
		}

		function removeUgly2(elem) {
			var linkURL = jQuery(elem).attr("href"),
				linkContext = "_LINKCONTEXTNAME_";
			if (linkURL.indexOf(linkContext) >= 0) {
				var newURL = jQuery(linkURL.split(linkContext)).get(0);
				jQuery(elem).attr("href", newURL);
			}
		}

		function changeToTextarea() {
			var divHTML = jQuery(this).html(),
				editableText = jQuery("<textarea style='width: 100%; height: 300px'/>");
			editableText.html(divHTML);
			jQuery(this).replaceWith(editableText);
			editableText.focus();
			editableText.blur(revertDiv);
		}

		function revertDiv() {
			var textareaHTML = jQuery(this).val(),
				viewableText = jQuery("<div id='inputDisplay' style='padding: 10px;'/>");
			viewableText.html(textareaHTML);
			jQuery(this).replaceWith(viewableText);
			viewableText.click(changeToTextarea);
		}

		jQuery(inputDisplay).append(userInput).prependTo(jQuery("<div id='inputContainer' style='background: white; color: black;'/>").prepend(removeBut).prependTo("div#content"));

		jQuery("#inputDisplay *").removeAttr("style");

		jQuery("#inputDisplay br").remove();

		jQuery("#inputDisplay a").each(function () {
			"use strict";

			if (isUndefined(this) || titleEmpty(this)) {
				var titleText = jQuery(this).text().toString();
				jQuery(this).attr('title', titleText.substr(0, 1).toUpperCase() + titleText.substr(1));
			}

			if (isDetailsLink(this)) {
				jQuery(this).attr("href", replaceURL(this));
			}
			emptyTarget(this);
			removeUgly(this);
			removeUgly2(this);
		});

		jQuery("#inputDisplay font").replaceWith(function () {
			"use strict";
			return jQuery(this).html();
		});

		jQuery("#inputDisplay span").replaceWith(function () {
			"use strict";
			return jQuery(this).html();
		});

		jQuery("#inputDisplay center").replaceWith(function () {
			"use strict";
			return jQuery("<p/>").append(jQuery(this).html());
		});

		jQuery("#inputDisplay :empty").remove();

		inputDisplay.click(changeToTextarea);

		jQuery(removeBut).click(function () {
			"use strict";
			jQuery("div#inputContainer").remove();
		});
	});
}
