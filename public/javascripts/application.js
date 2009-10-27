//ISO8601/RFC3339 Date parser
//from: http://blog.dansnetwork.com/2008/11/01/javascript-iso8601rfc3339-date-parser/
Date.prototype.setISO8601 = function(dString) {

    var regexp = /(\d\d\d\d)(\-)?(\d\d)(\-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+\-])(\d\d)(:)?(\d\d))/;

    if (dString.toString().match(new RegExp(regexp))) {
        var d = dString.match(new RegExp(regexp));
        var offset = 0;

        this.setUTCDate(1);
        this.setUTCFullYear(parseInt(d[1], 10));
        this.setUTCMonth(parseInt(d[3], 10) - 1);
        this.setUTCDate(parseInt(d[5], 10));
        this.setUTCHours(parseInt(d[7], 10));
        this.setUTCMinutes(parseInt(d[9], 10));
        this.setUTCSeconds(parseInt(d[11], 10));
        if (d[12]) {
        	this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
        }
        else {
        this.setUTCMilliseconds(0);
        }
        if (d[13] !== 'Z') {
            offset = (d[15] * 60) + parseInt(d[17], 10);
            offset *= ((d[14] === '-') ? -1: 1);
            this.setTime(this.getTime() - offset * 60 * 1000);
        }
    }
    else {
        this.setTime(Date.parse(dString));
    }
    return this;
};

// var today = new Date();  
// today.setISO8601('2008-12-19T16:39:57.67Z');

//from http://blog.stevenlevithan.com/archives/date-time-format
/*
 * Date Format 1.2.2
 * (c) 2007-2008 Steven Levithan <stevenlevithan.com>
 * MIT license
 * Includes enhancements by Scott Trenda <scott.trenda.net> and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
function dateFormat() {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[\-+]\d{4})?)\b/g,
		timezoneClip = /[^\-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) { val = "0" + val; }
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length === 1 && (typeof date === "string" || date instanceof String) && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date();
		if (isNaN(date)) { throw new SyntaxError("invalid date"); }

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) === "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	prefix = utc ? "getUTC" : "get",
			d = date[prefix + "Date"](),
			D = date[prefix + "Day"](),
			m = date[prefix + "Month"](),
			y = date[prefix + "FullYear"](),
			H = date[prefix + "Hours"](),
			M = date[prefix + "Minutes"](),
			s = date[prefix + "Seconds"](),
			L = date[prefix + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM Z",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	shortTimeZone:  "h:MM tt Z",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

function convert(value) {
	var hours = parseInt(value, 10);
   	value -= parseInt(value, 10);
	value *= 60;
	var mins = parseInt(value, 10);
   	value -= parseInt(value, 10);
	value *= 60;
	var secs = parseInt(value, 10);
	var display_hours = hours;
	// handle GMT case (00:00)
	if (hours === 0) {
		display_hours = "00";
	} else if (hours > 0) {
		// add a plus sign and perhaps an extra 0
		display_hours = (hours < 10) ? "+0"+hours : "+"+hours;
	} else {
		// add an extra 0 if needed 
		display_hours = (hours > -10) ? "-0"+Math.abs(hours) : hours;
	}

	mins = (mins < 10) ? "0"+mins : mins;
	return display_hours+":"+mins;
}

// script by Josh Fraser (http://www.onlineaspect.com)
// returns the user's timezone offset in the format: -12:00,0    (hours adj from utc, daylight savings in effect = 1)
function getTimeZoneOffset() {
	var rightNow = new Date();
	var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
	var june1 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st
	var temp = jan1.toGMTString();
	var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	temp = june1.toGMTString();
	var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
	var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
	var dst;
	if (std_time_offset === daylight_time_offset) {
		dst = "0"; // daylight savings time is NOT observed
	} else {
		// positive is southern, negative is northern hemisphere
		var hemisphere = std_time_offset - daylight_time_offset;
		if (hemisphere >= 0) {
			std_time_offset = daylight_time_offset; }
		dst = "1"; // daylight savings time is observed
	}
	var i;

	// check just to avoid error messages
	return convert(std_time_offset)+","+dst;
}

function clearErrorAndMessagesFields() {
    $('#errorsList').html('<li style="display:none"></li>');
    $('#messagesList').html('<li style="display:none"></li>');
}

function clearModalErrorAndMessagesFields() {
    $('#modalErrorsList').html('<li style="display:none"></li>');
    $('#modalMessagesList').html('<li style="display:none"></li>');
}

function highlightErrors(errors, fieldNamesToHighlight, errorsListDomSelector) {
    if (errors && errors.length > 0){
        delay=500;

        clearErrorAndMessagesFields();

    	for(var i in errors){
    		$(errorsListDomSelector).append('<li>' + errors[i] + '</li>');
        }

    	keyupfunc = function() { $(this).css({'background' : 'white'}); };

        if (fieldNamesToHighlight.length > 0){
        	for(var x in fieldNamesToHighlight){
        		$('#' + fieldNamesToHighlight[x]).css({'background' : 'red'});
        		$('#' + fieldNamesToHighlight[x]).keyup(keyupfunc);
        	}
        }
    }
}

function highlightErrorFields(errors, fieldNamesToHighlight) {
	highlightErrors(errors, fieldNamesToHighlight, '#errorsList');
}

function highlightErrorFieldsBasedOnJsonResponse(response) {
	return highlightErrorFields(response.errors, response.fieldNamesToHighlight);
}

function addMessage(message) {
	$('#messagesList').append('<li>' + message + '</li>');
}

function displayMessages(messages) {
	for(var i in messages){
		addMessage(messages[i]);
    }
}

function makeAjaxFormWithSimpleErrorHandling(formSelector, submitMessage) {
	$(formSelector).ajaxForm({
		dataType: 'json',
		beforeSubmit: function() {
            $.blockUI({ message: '<h1><img src="/images/busy.gif" style="margin-right:15px" />' + submitMessage + '</h1>' }); 
        },
 		success: function(data){ 
            $.unblockUI(); 
            if(data.success){
                if(data.nextUrl){
                    window.setTimeout('window.location="' + data.nextUrl + '"; ',data.nextUrlDelay);
                }
                else{
                    clearErrorAndMessagesFields(data);
                    displayMessages(data.messages);
                }
            }
            else{
                highlightErrorFieldsBasedOnJsonResponse(data);
            }
        }
	});
}

function makeFormsAsynchronous() {
	$('form.asynchronous').each(function(index, domElement) { 
    	formId = domElement.id;
    	submitMessage = $('form.#' + formId + ' span.#submitMessage').text();
    	makeAjaxFormWithSimpleErrorHandling('#' + formId, submitMessage);
	});
}

function checkCapabilities() {
	if(! $.cookies.test()){                                                                                                               
		$.blockUI({ message: '<p class="modalmessage">This site requires cookies be enabled in your browser. </p><p class="modalmessage">  Please enable them and reload this page.</p>' });
	}
}
    
$(document).ready(function(){
    //structure the html like this:
    //
    //<span class="dateToLocalize">
    //	<span class="dateIsoDate" style="display:none">2009-09-18T11:30:00-05:00</span>
    //	<span class="dateFormat" style="display:none">h:MM tt <'span class'='"timezone"'>Z<'/span'></span>
    //	<span class="date">Saturday, Sept 22nd, 2009</span>
    //</span>
    //
    // format = the format that the dateformat function above uses.
	$('.dateToLocalize > .date').each(function() {
	    d = new Date().setISO8601($(this).parent().find('.dateIsoDate').text());
	    format = $(this).parent().find('.dateFormat').text();
	    formattedDateHtml = d.format(format);
	    $(this).html(formattedDateHtml);
	});
	
	checkCapabilities();
	makeFormsAsynchronous();
	$.blockUI.defaults.css = {};
});
