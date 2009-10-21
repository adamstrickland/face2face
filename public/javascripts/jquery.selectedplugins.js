/* 
<script src="/scripts/jquery.bgiframe.js" type="text/javascript"></script>
<script src="/scripts/jquery.dimensions.js" type="text/javascript"></script>
<script src="/scripts/jquery.tooltip.js" type="text/javascript"></script>
<script src="/scripts/jquery.blockui.js" type="text/javascript"></script>
<script src="/scripts/jquery.form.js" type="text/javascript"></script>
<script src="/scripts/jquery.nyroModal-1.4.2.js" type="text/javascript"></script> 
*/


/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-06-20 03:23:36 +0200 (Mi, 20 Jun 2007) $
 * $Rev: 2110 $
 *
 * Version 2.1
 */

(function($){

/**
 * The bgiframe is chainable and applies the iframe hack to get 
 * around zIndex issues in IE6. It will only apply itself in IE 
 * and adds a class to the iframe called 'bgiframe'. The iframe
 * is appeneded as the first child of the matched element(s) 
 * with a tabIndex and zIndex of -1.
 * 
 * By default the plugin will take borders, sized with pixel units,
 * into account. If a different unit is used for the border's width,
 * then you will need to use the top and left settings as explained below.
 *
 * NOTICE: This plugin has been reported to cause perfromance problems
 * when used on elements that change properties (like width, height and
 * opacity) a lot in IE6. Most of these problems have been caused by 
 * the expressions used to calculate the elements width, height and 
 * borders. Some have reported it is due to the opacity filter. All 
 * these settings can be changed if needed as explained below.
 *
 * @example $('div').bgiframe();
 * @before <div><p>Paragraph</p></div>
 * @result <div><iframe class="bgiframe".../><p>Paragraph</p></div>
 *
 * @param Map settings Optional settings to configure the iframe.
 * @option String|Number top The iframe must be offset to the top
 * 		by the width of the top border. This should be a negative 
 *      number representing the border-top-width. If a number is 
 * 		is used here, pixels will be assumed. Otherwise, be sure
 *		to specify a unit. An expression could also be used. 
 * 		By default the value is "auto" which will use an expression 
 * 		to get the border-top-width if it is in pixels.
 * @option String|Number left The iframe must be offset to the left
 * 		by the width of the left border. This should be a negative 
 *      number representing the border-left-width. If a number is 
 * 		is used here, pixels will be assumed. Otherwise, be sure
 *		to specify a unit. An expression could also be used. 
 * 		By default the value is "auto" which will use an expression 
 * 		to get the border-left-width if it is in pixels.
 * @option String|Number width This is the width of the iframe. If
 *		a number is used here, pixels will be assume. Otherwise, be sure
 * 		to specify a unit. An experssion could also be used.
 *		By default the value is "auto" which will use an experssion
 * 		to get the offsetWidth.
 * @option String|Number height This is the height of the iframe. If
 *		a number is used here, pixels will be assume. Otherwise, be sure
 * 		to specify a unit. An experssion could also be used.
 *		By default the value is "auto" which will use an experssion
 * 		to get the offsetHeight.
 * @option Boolean opacity This is a boolean representing whether or not
 * 		to use opacity. If set to true, the opacity of 0 is applied. If
 *		set to false, the opacity filter is not applied. Default: true.
 * @option String src This setting is provided so that one could change 
 *		the src of the iframe to whatever they need.
 *		Default: "javascript:false;"
 *
 * @name bgiframe
 * @type jQuery
 * @cat Plugins/bgiframe
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
$.fn.bgIframe = $.fn.bgiframe = function(s) {
	// This is only for IE6
	if ( $.browser.msie && parseInt($.browser.version) <= 6 ) {
		s = $.extend({
			top     : 'auto', // auto == .currentStyle.borderTopWidth
			left    : 'auto', // auto == .currentStyle.borderLeftWidth
			width   : 'auto', // auto == offsetWidth
			height  : 'auto', // auto == offsetHeight
			opacity : true,
			src     : 'javascript:false;'
		}, s || {});
		var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
		    html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
		               'style="display:block;position:absolute;z-index:-1;'+
			               (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
					       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
					       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
					       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
					       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
					'"/>';
		return this.each(function() {
			if ( $('> iframe.bgiframe', this).length == 0 )
				this.insertBefore( document.createElement(html), this.firstChild );
		});
	}
	return this;
};

// Add browser.version if it doesn't exist
if (!$.browser.version)
	$.browser.version = navigator.userAgent.toLowerCase().match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)[1];

})(jQuery);


/* Copyright (c) 2007 Paul Bakaus (paul.bakaus@googlemail.com) and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-06-22 04:38:37 +0200 (Fr, 22 Jun 2007) $
 * $Rev: 2141 $
 *
 * Version: 1.0b2
 */

(function($){

// store a copy of the core height and width methods
var height = $.fn.height,
    width  = $.fn.width;

$.fn.extend({
	/**
	 * If used on document, returns the document's height (innerHeight)
	 * If used on window, returns the viewport's (window) height
	 * See core docs on height() to see what happens when used on an element.
	 *
	 * @example $("#testdiv").height()
	 * @result 200
	 *
	 * @example $(document).height()
	 * @result 800
	 *
	 * @example $(window).height()
	 * @result 400
	 *
	 * @name height
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	height: function() {
		if ( this[0] == window )
			return self.innerHeight ||
				$.boxModel && document.documentElement.clientHeight || 
				document.body.clientHeight;
		
		if ( this[0] == document )
			return Math.max( document.body.scrollHeight, document.body.offsetHeight );
		
		return height.apply(this, arguments);
	},
	
	/**
	 * If used on document, returns the document's width (innerWidth)
	 * If used on window, returns the viewport's (window) width
	 * See core docs on height() to see what happens when used on an element.
	 *
	 * @example $("#testdiv").width()
	 * @result 200
	 *
	 * @example $(document).width()
	 * @result 800
	 *
	 * @example $(window).width()
	 * @result 400
	 *
	 * @name width
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	width: function() {
		if ( this[0] == window )
			return self.innerWidth ||
				$.boxModel && document.documentElement.clientWidth ||
				document.body.clientWidth;

		if ( this[0] == document )
			return Math.max( document.body.scrollWidth, document.body.offsetWidth );

		return width.apply(this, arguments);
	},
	
	/**
	 * Returns the inner height value (without border) for the first matched element.
	 * If used on document, returns the document's height (innerHeight)
	 * If used on window, returns the viewport's (window) height
	 *
	 * @example $("#testdiv").innerHeight()
	 * @result 800
	 *
	 * @name innerHeight
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	innerHeight: function() {
		return this[0] == window || this[0] == document ?
			this.height() :
			this.is(':visible') ?
				this[0].offsetHeight - num(this, 'borderTopWidth') - num(this, 'borderBottomWidth') :
				this.height() + num(this, 'paddingTop') + num(this, 'paddingBottom');
	},
	
	/**
	 * Returns the inner width value (without border) for the first matched element.
	 * If used on document, returns the document's Width (innerWidth)
	 * If used on window, returns the viewport's (window) width
	 *
	 * @example $("#testdiv").innerWidth()
	 * @result 1000
	 *
	 * @name innerWidth
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	innerWidth: function() {
		return this[0] == window || this[0] == document ?
			this.width() :
			this.is(':visible') ?
				this[0].offsetWidth - num(this, 'borderLeftWidth') - num(this, 'borderRightWidth') :
				this.width() + num(this, 'paddingLeft') + num(this, 'paddingRight');
	},
	
	/**
	 * Returns the outer height value (including border) for the first matched element.
	 * Cannot be used on document or window.
	 *
	 * @example $("#testdiv").outerHeight()
	 * @result 1000
	 *
	 * @name outerHeight
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	outerHeight: function() {
		return this[0] == window || this[0] == document ?
			this.height() :
			this.is(':visible') ?
				this[0].offsetHeight :
				this.height() + num(this,'borderTopWidth') + num(this, 'borderBottomWidth') + num(this, 'paddingTop') + num(this, 'paddingBottom');
	},
	
	/**
	 * Returns the outer width value (including border) for the first matched element.
	 * Cannot be used on document or window.
	 *
	 * @example $("#testdiv").outerHeight()
	 * @result 1000
	 *
	 * @name outerHeight
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	outerWidth: function() {
		return this[0] == window || this[0] == document ?
			this.width() :
			this.is(':visible') ?
				this[0].offsetWidth :
				this.width() + num(this, 'borderLeftWidth') + num(this, 'borderRightWidth') + num(this, 'paddingLeft') + num(this, 'paddingRight');
	},
	
	/**
	 * Returns how many pixels the user has scrolled to the right (scrollLeft).
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $("#testdiv").scrollLeft()
	 * @result 100
	 *
	 * @name scrollLeft
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	/**
	 * Sets the scrollLeft property and continues the chain.
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $("#testdiv").scrollLeft(10).scrollLeft()
	 * @result 10
	 *
	 * @name scrollLeft
	 * @param Number value A positive number representing the desired scrollLeft.
	 * @type jQuery
	 * @cat Plugins/Dimensions
	 */
	scrollLeft: function(val) {
		if ( val != undefined )
			// set the scroll left
			return this.each(function() {
				if (this == window || this == document)
					window.scrollTo( val, $(window).scrollTop() );
				else
					this.scrollLeft = val;
			});
		
		// return the scroll left offest in pixels
		if ( this[0] == window || this[0] == document )
			return self.pageXOffset ||
				$.boxModel && document.documentElement.scrollLeft ||
				document.body.scrollLeft;
				
		return this[0].scrollLeft;
	},
	
	/**
	 * Returns how many pixels the user has scrolled to the bottom (scrollTop).
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $("#testdiv").scrollTop()
	 * @result 100
	 *
	 * @name scrollTop
	 * @type Number
	 * @cat Plugins/Dimensions
	 */
	/**
	 * Sets the scrollTop property and continues the chain.
	 * Works on containers with overflow: auto and window/document.
	 *
	 * @example $("#testdiv").scrollTop(10).scrollTop()
	 * @result 10
	 *
	 * @name scrollTop
	 * @param Number value A positive number representing the desired scrollTop.
	 * @type jQuery
	 * @cat Plugins/Dimensions
	 */
	scrollTop: function(val) {
		if ( val != undefined )
			// set the scroll top
			return this.each(function() {
				if (this == window || this == document)
					window.scrollTo( $(window).scrollLeft(), val );
				else
					this.scrollTop = val;
			});
		
		// return the scroll top offset in pixels
		if ( this[0] == window || this[0] == document )
			return self.pageYOffset ||
				$.boxModel && document.documentElement.scrollTop ||
				document.body.scrollTop;

		return this[0].scrollTop;
	},
	
	/** 
	 * Returns the top and left positioned offset in pixels.
	 * The positioned offset is the offset between a positioned
	 * parent and the element itself.
	 *
	 * @example $("#testdiv").position()
	 * @result { top: 100, left: 100 }
	 * 
	 * @name position
	 * @param Map options Optional settings to configure the way the offset is calculated.
	 * @option Boolean margin Should the margin of the element be included in the calculations? False by default.
	 * @option Boolean border Should the border of the element be included in the calculations? False by default.
	 * @option Boolean padding Should the padding of the element be included in the calculations? False by default.
	 * @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	position: function(options, returnObject) {
		var elem = this[0], parent = elem.parentNode, op = elem.offsetParent,
		    options = $.extend({ margin: false, border: false, padding: false, scroll: false }, options || {}),
			x = elem.offsetLeft,
			y = elem.offsetTop, 
			sl = elem.scrollLeft, 
			st = elem.scrollTop;
			
		// Mozilla and IE do not add the border
		if ($.browser.mozilla || $.browser.msie) {
			// add borders to offset
			x += num(elem, 'borderLeftWidth');
			y += num(elem, 'borderTopWidth');
		}

		if ($.browser.mozilla) {
			do {
				// Mozilla does not add the border for a parent that has overflow set to anything but visible
				if ($.browser.mozilla && parent != elem && $.css(parent, 'overflow') != 'visible') {
					x += num(parent, 'borderLeftWidth');
					y += num(parent, 'borderTopWidth');
				}

				if (parent == op) break; // break if we are already at the offestParent
			} while ((parent = parent.parentNode) && (parent.tagName.toLowerCase() != 'body' || parent.tagName.toLowerCase() != 'html'));
		}
		
		var returnValue = handleOffsetReturn(elem, options, x, y, sl, st);
		
		if (returnObject) { $.extend(returnObject, returnValue); return this; }
		else              { return returnValue; }
	},
	
	/**
	 * Returns the location of the element in pixels from the top left corner of the viewport.
	 *
	 * For accurate readings make sure to use pixel values for margins, borders and padding.
	 * 
	 * Known issues:
	 *  - Issue: A div positioned relative or static without any content before it and its parent will report an offsetTop of 0 in Safari
	 *    Workaround: Place content before the relative div ... and set height and width to 0 and overflow to hidden
	 *
	 * @example $("#testdiv").offset()
	 * @result { top: 100, left: 100, scrollTop: 10, scrollLeft: 10 }
	 *
	 * @example $("#testdiv").offset({ scroll: false })
	 * @result { top: 90, left: 90 }
	 *
	 * @example var offset = {}
	 * $("#testdiv").offset({ scroll: false }, offset)
	 * @result offset = { top: 90, left: 90 }
	 *
	 * @name offset
	 * @param Map options Optional settings to configure the way the offset is calculated.
	 * @option Boolean margin Should the margin of the element be included in the calculations? True by default.
	 * @option Boolean border Should the border of the element be included in the calculations? False by default.
	 * @option Boolean padding Should the padding of the element be included in the calculations? False by default.
	 * @option Boolean scroll Should the scroll offsets of the parent elements be included in the calculations? True by default.
	 *                        When true it adds the totla scroll offets of all parents to the total offset and also adds two properties
	 *                        to the returned object, scrollTop and scrollLeft. 
	 * @options Boolean lite Will use offsetLite instead of offset when set to true. False by default.
	 * @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	offset: function(options, returnObject) {
		var x = 0, y = 0, sl = 0, st = 0,
		    elem = this[0], parent = this[0], op, parPos, elemPos = $.css(elem, 'position'),
		    mo = $.browser.mozilla, ie = $.browser.msie, sf = $.browser.safari, oa = $.browser.opera,
		    absparent = false, relparent = false, 
		    options = $.extend({ margin: true, border: false, padding: false, scroll: true, lite: false }, options || {});
		
		// Use offsetLite if lite option is true
		if (options.lite) return this.offsetLite(options, returnObject);
		
		if (elem.tagName.toLowerCase() == 'body') {
			// Safari is the only one to get offsetLeft and offsetTop properties of the body "correct"
			// Except they all mess up when the body is positioned absolute or relative
			x = elem.offsetLeft;
			y = elem.offsetTop;
			// Mozilla ignores margin and subtracts border from body element
			if (mo) {
				x += num(elem, 'marginLeft') + (num(elem, 'borderLeftWidth')*2);
				y += num(elem, 'marginTop')  + (num(elem, 'borderTopWidth') *2);
			} else
			// Opera ignores margin
			if (oa) {
				x += num(elem, 'marginLeft');
				y += num(elem, 'marginTop');
			} else
			// IE does not add the border in Standards Mode
			if (ie && jQuery.boxModel) {
				x += num(elem, 'borderLeftWidth');
				y += num(elem, 'borderTopWidth');
			}
		} else {
			do {
				parPos = $.css(parent, 'position');
			
				x += parent.offsetLeft;
				y += parent.offsetTop;

				// Mozilla and IE do not add the border
				if (mo || ie) {
					// add borders to offset
					x += num(parent, 'borderLeftWidth');
					y += num(parent, 'borderTopWidth');

					// Mozilla does not include the border on body if an element isn't positioned absolute and is without an absolute parent
					if (mo && parPos == 'absolute') absparent = true;
					// IE does not include the border on the body if an element is position static and without an absolute or relative parent
					if (ie && parPos == 'relative') relparent = true;
				}

				op = parent.offsetParent;
				if (options.scroll || mo) {
					do {
						if (options.scroll) {
							// get scroll offsets
							sl += parent.scrollLeft;
							st += parent.scrollTop;
						}
				
						// Mozilla does not add the border for a parent that has overflow set to anything but visible
						if (mo && parent != elem && $.css(parent, 'overflow') != 'visible') {
							x += num(parent, 'borderLeftWidth');
							y += num(parent, 'borderTopWidth');
						}
				
						parent = parent.parentNode;
					} while (parent != op);
				}
				parent = op;

				if (parent.tagName.toLowerCase() == 'body' || parent.tagName.toLowerCase() == 'html') {
					// Safari and IE Standards Mode doesn't add the body margin for elments positioned with static or relative
					if ((sf || (ie && $.boxModel)) && elemPos != 'absolute' && elemPos != 'fixed') {
						x += num(parent, 'marginLeft');
						y += num(parent, 'marginTop');
					}
					// Mozilla does not include the border on body if an element isn't positioned absolute and is without an absolute parent
					// IE does not include the border on the body if an element is positioned static and without an absolute or relative parent
					if ( (mo && !absparent && elemPos != 'fixed') || 
					     (ie && elemPos == 'static' && !relparent) ) {
						x += num(parent, 'borderLeftWidth');
						y += num(parent, 'borderTopWidth');
					}
					break; // Exit the loop
				}
			} while (parent);
		}

		var returnValue = handleOffsetReturn(elem, options, x, y, sl, st);

		if (returnObject) { $.extend(returnObject, returnValue); return this; }
		else              { return returnValue; }
	},
	
	/**
	 * Returns the location of the element in pixels from the top left corner of the viewport.
	 * This method is much faster than offset but not as accurate. This method can be invoked
	 * by setting the lite option to true in the offset method.
	 *
	 * @name offsetLite
	 * @param Map options Optional settings to configure the way the offset is calculated.
	 * @option Boolean margin Should the margin of the element be included in the calculations? True by default.
	 * @option Boolean border Should the border of the element be included in the calculations? False by default.
	 * @option Boolean padding Should the padding of the element be included in the calculations? False by default.
	 * @option Boolean scroll Should the scroll offsets of the parent elements be included in the calculations? True by default.
	 *                        When true it adds the totla scroll offets of all parents to the total offset and also adds two properties
	 *                        to the returned object, scrollTop and scrollLeft. 
	 * @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
	 *                            chain will not be broken and the result will be assigned to this object.
	 * @type Object
	 * @cat Plugins/Dimensions
	 */
	offsetLite: function(options, returnObject) {
		var x = 0, y = 0, sl = 0, st = 0, parent = this[0], op, 
		    options = $.extend({ margin: true, border: false, padding: false, scroll: true }, options || {});
				
		do {
			x += parent.offsetLeft;
			y += parent.offsetTop;

			op = parent.offsetParent;
			if (options.scroll) {
				// get scroll offsets
				do {
					sl += parent.scrollLeft;
					st += parent.scrollTop;
					parent = parent.parentNode;
				} while(parent != op);
			}
			parent = op;
		} while (parent && parent.tagName.toLowerCase() != 'body' && parent.tagName.toLowerCase() != 'html');

		var returnValue = handleOffsetReturn(this[0], options, x, y, sl, st);

		if (returnObject) { $.extend(returnObject, returnValue); return this; }
		else              { return returnValue; }
	}
});

/**
 * Handles converting a CSS Style into an Integer.
 * @private
 */
var num = function(el, prop) {
	return parseInt($.css(el.jquery?el[0]:el,prop))||0;
};

/**
 * Handles the return value of the offset and offsetLite methods.
 * @private
 */
var handleOffsetReturn = function(elem, options, x, y, sl, st) {
	if ( !options.margin ) {
		x -= num(elem, 'marginLeft');
		y -= num(elem, 'marginTop');
	}

	// Safari and Opera do not add the border for the element
	if ( options.border && ($.browser.safari || $.browser.opera) ) {
		x += num(elem, 'borderLeftWidth');
		y += num(elem, 'borderTopWidth');
	} else if ( !options.border && !($.browser.safari || $.browser.opera) ) {
		x -= num(elem, 'borderLeftWidth');
		y -= num(elem, 'borderTopWidth');
	}

	if ( options.padding ) {
		x += num(elem, 'paddingLeft');
		y += num(elem, 'paddingTop');
	}
	
	// do not include scroll offset on the element
	if ( options.scroll ) {
		sl -= elem.scrollLeft;
		st -= elem.scrollTop;
	}

	return options.scroll ? { top: y - st, left: x - sl, scrollTop:  st, scrollLeft: sl }
	                      : { top: y, left: x };
};

})(jQuery);

/*
 * jQuery Tooltip plugin 1.3
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.tooltip.js 5741 2008-06-21 15:22:16Z joern.zaefferer $
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 
;(function($) {
	
		// the tooltip element
	var helper = {},
		// the current tooltipped element
		current,
		// the title of the current element, used for restoring
		title,
		// timeout id for delayed tooltips
		tID,
		// IE 5.5 or 6
		IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
		// flag for mouse tracking
		track = false;
	
	$.tooltip = {
		blocked: false,
		defaults: {
			delay: 200,
			fade: false,
			showURL: true,
			extraClass: "",
			top: 15,
			left: 15,
			id: "tooltip"
		},
		block: function() {
			$.tooltip.blocked = !$.tooltip.blocked;
		}
	};
	
	$.fn.extend({
		tooltip: function(settings) {
			settings = $.extend({}, $.tooltip.defaults, settings);
			createHelper(settings);
			return this.each(function() {
					$.data(this, "tooltip", settings);
					this.tOpacity = helper.parent.css("opacity");
					// copy tooltip into its own expando and remove the title
					this.tooltipText = this.title;
					$(this).removeAttr("title");
					// also remove alt attribute to prevent default tooltip in IE
					this.alt = "";
				})
				.mouseover(save)
				.mouseout(hide)
				.click(hide);
		},
		fixPNG: IE ? function() {
			return this.each(function () {
				var image = $(this).css('backgroundImage');
				if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
					image = RegExp.$1;
					$(this).css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					}).each(function () {
						var position = $(this).css('position');
						if (position != 'absolute' && position != 'relative')
							$(this).css('position', 'relative');
					});
				}
			});
		} : function() { return this; },
		unfixPNG: IE ? function() {
			return this.each(function () {
				$(this).css({'filter': '', backgroundImage: ''});
			});
		} : function() { return this; },
		hideWhenEmpty: function() {
			return this.each(function() {
				$(this)[ $(this).html() ? "show" : "hide" ]();
			});
		},
		url: function() {
			return this.attr('href') || this.attr('src');
		}
	});
	
	function createHelper(settings) {
		// there can be only one tooltip helper
		if( helper.parent )
			return;
		// create the helper, h3 for title, div for url
		helper.parent = $('<div id="' + settings.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>')
			// add to document
			.appendTo(document.body)
			// hide it at first
			.hide();
			
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			helper.parent.bgiframe();
		
		// save references to title and url elements
		helper.title = $('h3', helper.parent);
		helper.body = $('div.body', helper.parent);
		helper.url = $('div.url', helper.parent);
	}
	
	function settings(element) {
		return $.data(element, "tooltip");
	}
	
	// main event handler to start showing tooltips
	function handle(event) {
		// show helper, either with timeout or on instant
		if( settings(this).delay )
			tID = setTimeout(show, settings(this).delay);
		else
			show();
		
		// if selected, update the helper position when the mouse moves
		track = !!settings(this).track;
		$(document.body).bind('mousemove', update);
			
		// update at least once
		update(event);
	}
	
	// save elements title before the tooltip is displayed
	function save() {
		// if this is the current source, or it has no title (occurs with click event), stop
		if ( $.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler) )
			return;

		// save current
		current = this;
		title = this.tooltipText;
		
		if ( settings(this).bodyHandler ) {
			helper.title.hide();
			var bodyContent = settings(this).bodyHandler.call(this);
			if (bodyContent.nodeType || bodyContent.jquery) {
				helper.body.empty().append(bodyContent)
			} else {
				helper.body.html( bodyContent );
			}
			helper.body.show();
		} else if ( settings(this).showBody ) {
			var parts = title.split(settings(this).showBody);
			helper.title.html(parts.shift()).show();
			helper.body.empty();
			for(var i = 0, part; (part = parts[i]); i++) {
				if(i > 0)
					helper.body.append("<br/>");
				helper.body.append(part);
			}
			helper.body.hideWhenEmpty();
		} else {
			helper.title.html(title).show();
			helper.body.hide();
		}
		
		// if element has href or src, add and show it, otherwise hide it
		if( settings(this).showURL && $(this).url() )
			helper.url.html( $(this).url().replace('http://', '') ).show();
		else 
			helper.url.hide();
		
		// add an optional class for this tip
		helper.parent.addClass(settings(this).extraClass);

		// fix PNG background for IE
		if (settings(this).fixPNG )
			helper.parent.fixPNG();
			
		handle.apply(this, arguments);
	}
	
	// delete timeout and show helper
	function show() {
		tID = null;
		if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
			if (helper.parent.is(":animated"))
				helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
			else
				helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
		} else {
			helper.parent.show();
		}
		update();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		if($.tooltip.blocked)
			return;
		
		if (event && event.target.tagName == "OPTION") {
			return;
		}
		
		// stop updating when tracking is disabled and the tooltip is visible
		if ( !track && helper.parent.is(":visible")) {
			$(document.body).unbind('mousemove', update)
		}
		
		// if no current element is available, remove this listener
		if( current == null ) {
			$(document.body).unbind('mousemove', update);
			return;	
		}
		
		// remove position helper classes
		helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
		
		var left = helper.parent[0].offsetLeft;
		var top = helper.parent[0].offsetTop;
		if (event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + settings(current).left;
			top = event.pageY + settings(current).top;
			var right='auto';
			if (settings(current).positionLeft) {
				right = $(window).width() - left;
				left = 'auto';
			}
			helper.parent.css({
				left: left,
				right: right,
				top: top
			});
		}
		
		var v = viewport(),
			h = helper.parent[0];
		// check horizontal position
		if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20 + settings(current).left;
			helper.parent.css({left: left + 'px'}).addClass("viewport-right");
		}
		// check vertical position
		if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20 + settings(current).top;
			helper.parent.css({top: top + 'px'}).addClass("viewport-bottom");
		}
	}
	
	function viewport() {
		return {
			x: $(window).scrollLeft(),
			y: $(window).scrollTop(),
			cx: $(window).width(),
			cy: $(window).height()
		};
	}
	
	// hide helper and restore added classes and the title
	function hide(event) {
		if($.tooltip.blocked)
			return;
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		
		var tsettings = settings(this);
		function complete() {
			helper.parent.removeClass( tsettings.extraClass ).hide().css("opacity", "");
		}
		if ((!IE || !$.fn.bgiframe) && tsettings.fade) {
			if (helper.parent.is(':animated'))
				helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
			else
				helper.parent.stop().fadeOut(tsettings.fade, complete);
		} else
			complete();
		
		if( settings(this).fixPNG )
			helper.parent.unfixPNG();
	}
	
})(jQuery);

/*!
 * jQuery blockUI plugin
 * Version 2.26 (09-SEP-2009)
 * @requires jQuery v1.2.3 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2008 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function($) {

if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
	alert('blockUI requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
	return;
}

$.fn._fadeIn = $.fn.fadeIn;

// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
// retarded userAgent strings on Vista)
var mode = document.documentMode || 0;
var setExpr = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8);
var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent) && !mode;

// global $ methods for blocking/unblocking the entire page
$.blockUI   = function(opts) { install(window, opts); };
$.unblockUI = function(opts) { remove(window, opts); };

// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
$.growlUI = function(title, message, timeout, onClose) {
	var $m = $('<div class="growlUI"></div>');
	if (title) $m.append('<h1>'+title+'</h1>');
	if (message) $m.append('<h2>'+message+'</h2>');
	if (timeout == undefined) timeout = 3000;
	$.blockUI({
		message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
		timeout: timeout, showOverlay: false,
		onUnblock: onClose, 
		css: $.blockUI.defaults.growlCSS
	});
};

// plugin method for blocking element content
$.fn.block = function(opts) {
	return this.unblock({ fadeOut: 0 }).each(function() {
		if ($.css(this,'position') == 'static')
			this.style.position = 'relative';
		if ($.browser.msie)
			this.style.zoom = 1; // force 'hasLayout'
		install(this, opts);
	});
};

// plugin method for unblocking element content
$.fn.unblock = function(opts) {
	return this.each(function() {
		remove(this, opts);
	});
};

$.blockUI.version = 2.26; // 2nd generation blocking at no extra cost!

// override these in your code to change the default behavior and style
$.blockUI.defaults = {
	// message displayed when blocking (use null for no message)
	message:  '<h1>Please wait...</h1>',

	title: null,	  // title string; only used when theme == true
	draggable: true,  // only used when theme == true (requires jquery-ui.js to be loaded)
	
	theme: false, // set to true to use with jQuery UI themes
	
	// styles for the message when blocking; if you wish to disable
	// these and use an external stylesheet then do this in your code:
	// $.blockUI.defaults.css = {};
	css: {
		padding:	0,
		margin:		0,
		width:		'30%',
		top:		'40%',
		left:		'35%',
		textAlign:	'center',
		color:		'#000',
		border:		'3px solid #aaa',
		backgroundColor:'#fff',
		cursor:		'wait'
	},
	
	// minimal style set used when themes are used
	themedCSS: {
		width:	'30%',
		top:	'40%',
		left:	'35%'
	},

	// styles for the overlay
	overlayCSS:  {
		backgroundColor: '#000',
		opacity:	  	 0.6,
		cursor:		  	 'wait'
	},

	// styles applied when using $.growlUI
	growlCSS: {
		width:  	'350px',
		top:		'10px',
		left:   	'',
		right:  	'10px',
		border: 	'none',
		padding:	'5px',
		opacity:	0.6,
		cursor: 	'default',
		color:		'#fff',
		backgroundColor: '#000',
		'-webkit-border-radius': '10px',
		'-moz-border-radius':	 '10px'
	},
	
	// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
	// (hat tip to Jorge H. N. de Vasconcelos)
	iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

	// force usage of iframe in non-IE browsers (handy for blocking applets)
	forceIframe: false,

	// z-index for the blocking overlay
	baseZ: 1000,

	// set these to true to have the message automatically centered
	centerX: true, // <-- only effects element blocking (page block controlled via css above)
	centerY: true,

	// allow body element to be stetched in ie6; this makes blocking look better
	// on "short" pages.  disable if you wish to prevent changes to the body height
	allowBodyStretch: true,

	// enable if you want key and mouse events to be disabled for content that is blocked
	bindEvents: true,

	// be default blockUI will supress tab navigation from leaving blocking content
	// (if bindEvents is true)
	constrainTabKey: true,

	// fadeIn time in millis; set to 0 to disable fadeIn on block
	fadeIn:  200,

	// fadeOut time in millis; set to 0 to disable fadeOut on unblock
	fadeOut:  400,

	// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
	timeout: 0,

	// disable if you don't want to show the overlay
	showOverlay: true,

	// if true, focus will be placed in the first available input field when
	// page blocking
	focusInput: true,

	// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
	applyPlatformOpacityRules: true,

	// callback method invoked when unblocking has completed; the callback is
	// passed the element that has been unblocked (which is the window object for page
	// blocks) and the options that were passed to the unblock call:
	//	 onUnblock(element, options)
	onUnblock: null,

	// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
	quirksmodeOffsetHack: 4
};

// private data and functions follow...

var pageBlock = null;
var pageBlockEls = [];

function install(el, opts) {
	var full = (el == window);
	var msg = opts && opts.message !== undefined ? opts.message : undefined;
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
	var css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
	var themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
	msg = msg === undefined ? opts.message : msg;

	// remove the current block (if there is one)
	if (full && pageBlock)
		remove(window, {fadeOut:0});

	// if an existing element is being used as the blocking content then we capture
	// its current place in the DOM (and current display style) so we can restore
	// it when we unblock
	if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
		var node = msg.jquery ? msg[0] : msg;
		var data = {};
		$(el).data('blockUI.history', data);
		data.el = node;
		data.parent = node.parentNode;
		data.display = node.style.display;
		data.position = node.style.position;
		if (data.parent)
			data.parent.removeChild(node);
	}

	var z = opts.baseZ;

	// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
	// layer1 is the iframe layer which is used to supress bleed through of underlying content
	// layer2 is the overlay layer which has opacity and a wait cursor (by default)
	// layer3 is the message content that is displayed while blocking

	var lyr1 = ($.browser.msie || opts.forceIframe) 
		? $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')
		: $('<div class="blockUI" style="display:none"></div>');
	var lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
	
	var lyr3;
	if (opts.theme && full) {
		var s = '<div class="blockUI blockMsg blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:fixed">' +
					'<div class="ui-widget-header ui-dialog-titlebar blockTitle">'+(opts.title || '&nbsp;')+'</div>' +
					'<div class="ui-widget-content ui-dialog-content"></div>' +
				'</div>';
		lyr3 = $(s);
	}
	else {
		lyr3 = full ? $('<div class="blockUI blockMsg blockPage" style="z-index:'+z+';display:none;position:fixed"></div>')
					: $('<div class="blockUI blockMsg blockElement" style="z-index:'+z+';display:none;position:absolute"></div>');
	}						   

	// if we have a message, style it
	if (msg) {
		if (opts.theme) {
			lyr3.css(themedCSS);
			lyr3.addClass('ui-widget-content');
		}
		else 
			lyr3.css(css);
	}

	// style the overlay
	if (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform)))
		lyr2.css(opts.overlayCSS);
	lyr2.css('position', full ? 'fixed' : 'absolute');

	// make iframe layer transparent in IE
	if ($.browser.msie || opts.forceIframe)
		lyr1.css('opacity',0.0);

	$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
	
	if (opts.theme && opts.draggable && $.fn.draggable) {
		lyr3.draggable({
			handle: '.ui-dialog-titlebar',
			cancel: 'li'
		});
	}

	// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
	var expr = setExpr && (!$.boxModel || $('object,embed', full ? null : el).length > 0);
	if (ie6 || expr) {
		// give body 100% height
		if (full && opts.allowBodyStretch && $.boxModel)
			$('html,body').css('height','100%');

		// fix ie6 issue when blocked element has a border width
		if ((ie6 || !$.boxModel) && !full) {
			var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
			var fixT = t ? '(0 - '+t+')' : 0;
			var fixL = l ? '(0 - '+l+')' : 0;
		}

		// simulate fixed position
		$.each([lyr1,lyr2,lyr3], function(i,o) {
			var s = o[0].style;
			s.position = 'absolute';
			if (i < 2) {
				full ? s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"')
					 : s.setExpression('height','this.parentNode.offsetHeight + "px"');
				full ? s.setExpression('width','jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
					 : s.setExpression('width','this.parentNode.offsetWidth + "px"');
				if (fixL) s.setExpression('left', fixL);
				if (fixT) s.setExpression('top', fixT);
			}
			else if (opts.centerY) {
				if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
				s.marginTop = 0;
			}
			else if (!opts.centerY && full) {
				var top = (opts.css && opts.css.top) ? parseInt(opts.css.top) : 0;
				var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
				s.setExpression('top',expression);
			}
		});
	}

	// show the message
	if (msg) {
		if (opts.theme)
			lyr3.find('.ui-widget-content').append(msg);
		else
			lyr3.append(msg);
		if (msg.jquery || msg.nodeType)
			$(msg).show();
	}

	if (($.browser.msie || opts.forceIframe) && opts.showOverlay)
		lyr1.show(); // opacity is zero
	if (opts.fadeIn) {
		if (opts.showOverlay)
			lyr2._fadeIn(opts.fadeIn);
		if (msg)
			lyr3.fadeIn(opts.fadeIn);
	}
	else {
		if (opts.showOverlay)
			lyr2.show();
		if (msg)
			lyr3.show();
	}

	// bind key and mouse events
	bind(1, el, opts);

	if (full) {
		pageBlock = lyr3[0];
		pageBlockEls = $(':input:enabled:visible',pageBlock);
		if (opts.focusInput)
			setTimeout(focus, 20);
	}
	else
		center(lyr3[0], opts.centerX, opts.centerY);

	if (opts.timeout) {
		// auto-unblock
		var to = setTimeout(function() {
			full ? $.unblockUI(opts) : $(el).unblock(opts);
		}, opts.timeout);
		$(el).data('blockUI.timeout', to);
	}
};

// remove the block
function remove(el, opts) {
	var full = (el == window);
	var $el = $(el);
	var data = $el.data('blockUI.history');
	var to = $el.data('blockUI.timeout');
	if (to) {
		clearTimeout(to);
		$el.removeData('blockUI.timeout');
	}
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	bind(0, el, opts); // unbind events
	
	var els;
	if (full) // crazy selector to handle odd field errors in ie6/7
		els = $('body').children().filter('.blockUI').add('body > .blockUI');
	else
		els = $('.blockUI', el);

	if (full)
		pageBlock = pageBlockEls = null;

	if (opts.fadeOut) {
		els.fadeOut(opts.fadeOut);
		setTimeout(function() { reset(els,data,opts,el); }, opts.fadeOut);
	}
	else
		reset(els, data, opts, el);
};

// move blocking element back into the DOM where it started
function reset(els,data,opts,el) {
	els.each(function(i,o) {
		// remove via DOM calls so we don't lose event handlers
		if (this.parentNode)
			this.parentNode.removeChild(this);
	});

	if (data && data.el) {
		data.el.style.display = data.display;
		data.el.style.position = data.position;
		if (data.parent)
			data.parent.appendChild(data.el);
		$(data.el).removeData('blockUI.history');
	}

	if (typeof opts.onUnblock == 'function')
		opts.onUnblock(el,opts);
};

// bind/unbind the handler
function bind(b, el, opts) {
	var full = el == window, $el = $(el);

	// don't bother unbinding if there is nothing to unbind
	if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
		return;
	if (!full)
		$el.data('blockUI.isBlocked', b);

	// don't bind events when overlay is not in use or if bindEvents is false
	if (!opts.bindEvents || (b && !opts.showOverlay)) 
		return;

	// bind anchors and inputs for mouse and key events
	var events = 'mousedown mouseup keydown keypress';
	b ? $(document).bind(events, opts, handler) : $(document).unbind(events, handler);

// former impl...
//	   var $e = $('a,:input');
//	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
};

// event handler to suppress keyboard/mouse events when blocking
function handler(e) {
	// allow tab navigation (conditionally)
	if (e.keyCode && e.keyCode == 9) {
		if (pageBlock && e.data.constrainTabKey) {
			var els = pageBlockEls;
			var fwd = !e.shiftKey && e.target == els[els.length-1];
			var back = e.shiftKey && e.target == els[0];
			if (fwd || back) {
				setTimeout(function(){focus(back)},10);
				return false;
			}
		}
	}
	// allow events within the message content
	if ($(e.target).parents('div.blockMsg').length > 0)
		return true;

	// allow events for content that is not being blocked
	return $(e.target).parents().children().filter('div.blockUI').length == 0;
};

function focus(back) {
	if (!pageBlockEls)
		return;
	var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
	if (e)
		e.focus();
};

function center(el, x, y) {
	var p = el.parentNode, s = el.style;
	var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
	var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
	if (x) s.left = l > 0 ? (l+'px') : '0';
	if (y) s.top  = t > 0 ? (t+'px') : '0';
};

function sz(el, p) {
	return parseInt($.css(el,p))||0;
};

})(jQuery);

/*
 * jQuery Form Plugin
 * version: 2.25 (08-APR-2009)
 * @requires jQuery v1.2.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

/*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are intended to be exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
        $('#myForm').bind('submit', function() {
            $(this).ajaxSubmit({
                target: '#output'
            });
            return false; // <-- important!
        });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
        $('#myForm').ajaxForm({
            target: '#output'
        });
    });

    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
*/

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }

    if (typeof options == 'function')
        options = { success: options };

    // clean url (don't include hash vaue)
    var url = this.attr('action') || window.location.href;
    url = (url.match(/^([^#]+)/)||[])[1];
    url = url || '';

    options = $.extend({
        url:  url,
        type: this.attr('method') || 'GET'
    }, options || {});

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var a = this.formToArray(options.semantic);
    if (options.data) {
        options.extraData = options.data;
        for (var n in options.data) {
          if(options.data[n] instanceof Array) {
            for (var k in options.data[n])
              a.push( { name: n, value: options.data[n][k] } );
          }
          else
             a.push( { name: n, value: options.data[n] } );
        }
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a);

    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else
        options.data = q; // data is the query string for 'post'

    var $form = this, callbacks = [];
    if (options.resetForm) callbacks.push(function() { $form.resetForm(); });
    if (options.clearForm) callbacks.push(function() { $form.clearForm(); });

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            $(options.target).html(data).each(oldSuccess, arguments);
        });
    }
    else if (options.success)
        callbacks.push(options.success);

    options.success = function(data, status) {
        for (var i=0, max=callbacks.length; i < max; i++)
            callbacks[i].apply(options, [data, status, $form]);
    };

    // are there files to upload?
    var files = $('input:file', this).fieldValue();
    var found = false;
    for (var j=0; j < files.length; j++)
        if (files[j])
            found = true;

    // options.iframe allows user to force iframe mode
   if (options.iframe || found) {
       // hack to fix Safari hang (thanks to Tim Molendijk for this)
       // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
       if (options.closeKeepAlive)
           $.get(options.closeKeepAlive, fileUpload);
       else
           fileUpload();
       }
   else
       $.ajax(options);

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;


    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUpload() {
        var form = $form[0];

        if ($(':input[name=submit]', form).length) {
            alert('Error: Form elements must not be named "submit".');
            return;
        }

        var opts = $.extend({}, $.ajaxSettings, options);
		var s = $.extend(true, {}, $.extend(true, {}, $.ajaxSettings), opts);

        var id = 'jqFormIO' + (new Date().getTime());
        var $io = $('<iframe id="' + id + '" name="' + id + '" src="about:blank" />');
        var io = $io[0];

        $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

        var xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function() {
                this.aborted = 1;
                $io.attr('src','about:blank'); // abort op in progress
            }
        };

        var g = opts.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && ! $.active++) $.event.trigger("ajaxStart");
        if (g) $.event.trigger("ajaxSend", [xhr, opts]);

		if (s.beforeSend && s.beforeSend(xhr, s) === false) {
			s.global && $.active--;
			return;
        }
        if (xhr.aborted)
            return;

        var cbInvoked = 0;
        var timedOut = 0;

        // add submitting element to data if we know it
        var sub = form.clk;
        if (sub) {
            var n = sub.name;
            if (n && !sub.disabled) {
                options.extraData = options.extraData || {};
                options.extraData[n] = sub.value;
                if (sub.type == "image") {
                    options.extraData[name+'.x'] = form.clk_x;
                    options.extraData[name+'.y'] = form.clk_y;
                }
            }
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        setTimeout(function() {
            // make sure form attrs are set
            var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (form.getAttribute('method') != 'POST')
				form.setAttribute('method', 'POST');
			if (form.getAttribute('action') != opts.url)
				form.setAttribute('action', opts.url);

            // ie borks in some cases when setting encoding
            if (! options.skipEncodingOverride) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (opts.timeout)
                setTimeout(function() { timedOut = true; cb(); }, opts.timeout);

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (options.extraData)
                    for (var n in options.extraData)
                        extraInputs.push(
                            $('<input type="hidden" name="'+n+'" value="'+options.extraData[n]+'" />')
                                .appendTo(form)[0]);

                // add iframe to doc and submit the form
                $io.appendTo('body');
                io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
                form.submit();
            }
            finally {
                // reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
                t ? form.setAttribute('target', t) : $form.removeAttr('target');
                $(extraInputs).remove();
            }
        }, 10);

        var nullCheckFlag = 0;

        function cb() {
            if (cbInvoked++) return;

            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

            var ok = true;
            try {
                if (timedOut) throw 'timeout';
                // extract the server response from the iframe
                var data, doc;

                doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;

                if ((doc.body == null || doc.body.innerHTML == '') && !nullCheckFlag) {
                    // in some browsers (cough, Opera 9.2.x) the iframe DOM is not always traversable when
                    // the onload callback fires, so we give them a 2nd chance
                    nullCheckFlag = 1;
                    cbInvoked--;
                    setTimeout(cb, 100);
                    return;
                }

                xhr.responseText = doc.body ? doc.body.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': opts.dataType};
                    return headers[header];
                };

                if (opts.dataType == 'json' || opts.dataType == 'script') {
                    var ta = doc.getElementsByTagName('textarea')[0];
                    xhr.responseText = ta ? ta.value : xhr.responseText;
                }
                else if (opts.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                    xhr.responseXML = toXml(xhr.responseText);
                }
                data = $.httpData(xhr, opts.dataType);
            }
            catch(e){
                ok = false;
                $.handleError(opts, xhr, 'error', e);
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (ok) {
                opts.success(data, 'success');
                if (g) $.event.trigger("ajaxSuccess", [xhr, opts]);
            }
            if (g) $.event.trigger("ajaxComplete", [xhr, opts]);
            if (g && ! --$.active) $.event.trigger("ajaxStop");
            if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');

            // clean up
            setTimeout(function() {
                $io.remove();
                xhr.responseXML = null;
            }, 100);
        };

        function toXml(s, doc) {
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
        };
    };
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
    return this.ajaxFormUnbind().bind('submit.form-plugin',function() {
        $(this).ajaxSubmit(options);
        return false;
    }).each(function() {
        // store options in hash
        $(":submit,input:image", this).bind('click.form-plugin',function(e) {
            var form = this.form;
            form.clk = this;
            if (this.type == 'image') {
                if (e.offsetX != undefined) {
                    form.clk_x = e.offsetX;
                    form.clk_y = e.offsetY;
                } else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
                    var offset = $(this).offset();
                    form.clk_x = e.pageX - offset.left;
                    form.clk_y = e.pageY - offset.top;
                } else {
                    form.clk_x = e.pageX - this.offsetLeft;
                    form.clk_y = e.pageY - this.offsetTop;
                }
            }
            // clear form vars
            setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 10);
        });
    });
};

// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    this.unbind('submit.form-plugin');
    return this.each(function() {
        $(":submit,input:image", this).unbind('click.form-plugin');
    });

};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic) {
    var a = [];
    if (this.length == 0) return a;

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) return a;
    for(var i=0, max=els.length; i < max; i++) {
        var el = els[i];
        var n = el.name;
        if (!n) continue;

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(!el.disabled && form.clk == el)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            continue;
        }

        var v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            for(var j=0, jmax=v.length; j < jmax; j++)
                a.push({name: n, value: v[j]});
        }
        else if (v !== null && typeof v != 'undefined')
            a.push({name: n, value: v});
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle them here
        var inputs = form.getElementsByTagName("input");
        for(var i=0, max=inputs.length; i < max; i++) {
            var input = inputs[i];
            var n = input.name;
            if(n && !input.disabled && input.type == "image" && form.clk == input)
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) return;
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++)
                a.push({name: n, value: v[i]});
        }
        else if (v !== null && typeof v != 'undefined')
            a.push({name: this.name, value: v});
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *       array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
            continue;
        v.constructor == Array ? $.merge(val, v) : val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (typeof successful == 'undefined') successful = true;

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1))
            return null;

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) return null;
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
				var v = op.value;
				if (!v) // extra pain for IE...
                	v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                if (one) return v;
                a.push(v);
            }
        }
        return a;
    }
    return el.value;
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function() {
    return this.each(function() {
        $('input,select,textarea', this).clearFields();
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function() {
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (t == 'text' || t == 'password' || tag == 'textarea')
            this.value = '';
        else if (t == 'checkbox' || t == 'radio')
            this.checked = false;
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
            this.reset();
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b == undefined) b = true;
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select == undefined) select = true;
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio')
            this.checked = select;
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// helper fn for console logging
// set $.fn.ajaxSubmit.debug to true to enable debug logging
function log() {
    if ($.fn.ajaxSubmit.debug && window.console && window.console.log)
        window.console.log('[jquery.form] ' + Array.prototype.join.call(arguments,''));
};

})(jQuery);


/*
 * nyroModal - jQuery Plugin
 * http://nyromodal.nyrodev.com
 *
 * Copyright (c) 2008 Cedric Nirousset (nyrodev.com)
 * Licensed under the MIT license
 *
 * $Date: 2009-02-19 (Thu, 19 Feb 2009) $
 * $version: 1.4.2
 */
jQuery(function($) {

	// -------------------------------------------------------
	// Private Variables
	// -------------------------------------------------------

	var userAgent = navigator.userAgent.toLowerCase();
	var browserVersion = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1];
	var isIE6 = (/msie/.test(userAgent) && !/opera/.test(userAgent) && parseInt(browserVersion) < 7);
	var body = $('body');

	var currentSettings;

	var shouldResize = false;

	// To know if the fix for the Issue 10 should be applied (or has been applied)
	var fixFF = false;

	// Used for retrieve the content from an hidden div
	var contentElt;
	var contentEltLast;

	// Contains info about nyroModal state and all div references
	var modal = {
		started: false,
		ready: false,
		dataReady: false,
		anim: false,
		animContent: false,
		loadingShown: false,
		transition: false,
		closing: false,
		error: false,
		blocker: null,
		blockerVars: null,
		full: null,
		bg: null,
		loading: null,
		tmp: null,
		content: null,
		wrapper: null,
		contentWrapper: null,
		scripts: new Array(),
		scriptsShown: new Array()
	};

	// Indicate of the height or the width was resized, to reinit the currentsettings related to null
	var resized = {
		width: false,
		height: false
	};


	// -------------------------------------------------------
	// Public function
	// -------------------------------------------------------

	// jQuery extension function. A paramater object could be used to overwrite the default settings
	$.fn.nyroModal = function(settings) {
		if (!this)
			return false;
		return this.each(function(){
			if (this.nodeName.toLowerCase() == 'form') {
				$(this).submit(function(e) {
					if ($(this).data('processing'))
						return true;
					if (this.enctype == 'multipart/form-data') {
						processModal($.extend(settings, {
							from: this
						}));
						return true;
					}
					e.preventDefault();
					processModal($.extend(settings, {
						from: this
					}));
					return false;
				});
			} else {
				$(this).click(function(e) {
					e.preventDefault();
					processModal($.extend(settings, {
						from: this
					}));
					return false;
				});
			}
		});
	};

	// jQuery extension function to call manually the modal. A paramater object could be used to overwrite the default settings
	$.fn.nyroModalManual = function(settings) {
		if (!this.length)
			processModal(settings);
		return this.each(function(){
			processModal($.extend(settings, {
				from: this
			}));
		});
	};

	$.nyroModalManual = function(settings) {
		processModal(settings);
	};

	// Update the current settings
	// object settings
	// string deep1 first key where overwrite the settings
	// string deep2 second key where overwrite the settings
	$.nyroModalSettings = function(settings, deep1, deep2) {
		setCurrentSettings(settings, deep1, deep2);
		if (!deep1 && modal.started) {
			if (modal.bg && settings.bgColor)
				currentSettings.updateBgColor(modal, currentSettings, function(){});

			if (modal.contentWrapper && settings.title)
				setTitle();

			if (((settings.width && settings.width == currentSettings.width) || (settings.height && settings.height == currentSettings.height))) {
				if (modal.contentWrapper)
					calculateSize(true);
				if (modal.contentWrapper && modal.contentWrapper.is(':visible') && !modal.animContent) {
					if (fixFF)
						modal.content.css({position: ''});
					currentSettings.resize(modal, currentSettings, function() {
						if (fixFF)
							modal.content.css({position: 'fixed'});
						if ($.isFunction(currentSettings.endResize))
							currentSettings.endResize(modal, currentSettings);
					});
				}
			}
		}
	};

	// Remove the modal function
	$.nyroModalRemove = function() {
		removeModal();
	};

	// Go to the next image for a gallery
	// return false if nothing was done
	$.nyroModalNext = function() {
		var link = getGalleryLink(1);
		if (link)
			return link.nyroModalManual(getCurrentSettingsNew());
		return false;
	};

	// Go to the previous image for a gallery
	// return false if nothing was done
	$.nyroModalPrev = function() {
		var link = getGalleryLink(-1);
		if (link)
			return link.nyroModalManual(getCurrentSettingsNew());
		return false;
	};


	// -------------------------------------------------------
	// Default Settings
	// -------------------------------------------------------

	$.fn.nyroModal.settings = {
		debug: false, // Show the debug in the background

		blocker: false, // Element which will be blocked by the modal

		modal: false, // Esc key or click backgrdound enabling or not

		type: '', // nyroModal type (form, formData, iframe, image, etc...)
		from: '', // Dom object where the call come from
		hash: '', // Eventual hash in the url

		processHandler: null, // Handler just before the real process

		selIndicator: 'nyroModalSel', // Value added when a form or Ajax is sent with a filter content

		formIndicator: 'nyroModal', // Value added when a form is sent

		content: null, // Raw content if type content is used

		bgColor: '#000000', // Background color

		ajax: {}, // Ajax option (url, data, type, success will be overwritten for a form, url and success only for an ajax call)

		swf: { // Swf player options if swf type is used.
			wmode: 'transparent'
		},

		width: null, // default Width If null, will be calculate automatically
		height: null, // default Height If null, will be calculate automatically

		minWidth: 400, // Minimum width
		minHeight: 150, // Minimum height

		resizable: true, // Indicate if the content is resizable. Will be set to false for swf
		autoSizable: true, // Indicate if the content is auto sizable. If not, the min size will be used

		padding: 15, // padding for the max modal size

		regexImg: '[^\.]\.(jpg|jpeg|png|tiff|gif|bmp)\s*$', // Regex to find images
		defaultImgAlt: 'Image', // Default alt attribute for the images
		setWidthImgTitle: true, // Set the width to the image title
		ltr: true, // Left to Right by default. Put to false for Hebrew or Right to Left language

		gallery: null, // Gallery name if provided
		galleryLinks: '<a href="#" class="nyroModalPrev">Prev</a><a href="#"  class="nyroModalNext">Next</a>', // Use .nyroModalPrev and .nyroModalNext to set the navigation link

		css: { // Default CSS option for the nyroModal Div. Some will be overwritten or updated when using IE6
			bg: {
				position: 'absolute',
				overflow: 'hidden',
				top: 0,
				left: 0,
				height: '100%',
				width: '100%'
			},
			wrapper: {
				position: 'absolute',
				top: '50%',
				left: '50%'
			},
			wrapper2: {
			},
			content: {
				overflow: 'auto'
			},
			loading: {
				position: 'absolute',
				top: '50%',
				left: '50%',
				marginTop: '-50px',
				marginLeft: '-50px'
			}
		},

		wrap: { // Wrapper div used to style the modal regarding the content type
			div: '<div class="wrapper"></div>',
			ajax: '<div class="wrapper"></div>',
			form: '<div class="wrapper"></div>',
			formData: '<div class="wrapper"></div>',
			image: '<div class="wrapperImg"></div>',
			swf: '<div class="wrapperSwf"></div>',
			iframe: '<div class="wrapperIframe"></div>',
			iframeForm: '<div class="wrapperIframe"></div>',
			manual: '<div class="wrapper"></div>'
		},

		closeButton: '<a href="#" class="nyroModalClose" id="closeBut" title="close">Close</a>', // Adding automaticly as the first child of #nyroModalWrapper

		title: null, // Modal title
		titleFromIframe: true, // When using iframe in the same domain, try to get the title from it

		openSelector: '.nyroModal', // selector for open a new modal. will be used to parse automaticly at page loading
		closeSelector: '.nyroModalClose', // selector to close the modal

		contentLoading: '<a href="#" class="nyroModalClose">Cancel</a>', // Loading div content

		errorClass: 'error', // CSS Error class added to the loading div in case of error
		contentError: 'The requested content cannot be loaded.<br />Please try again later.<br /><a href="#" class="nyroModalClose">Close</a>', // Content placed in the loading div in case of error

		handleError: null, // Callback in case of error

		showBackground: showBackground, // Show background animation function
		hideBackground: hideBackground, // Hide background animation function

		endFillContent: null, // Will be called after filling and wraping the content, before parsing closeSelector and openSelector and showing the content
		showContent: showContent, // Show content animation function
		endShowContent: null, // Will be called once the content is shown
		beforeHideContent: null, // Will be called just before the modal closing
		hideContent: hideContent, // Hide content animation function

		showTransition: showTransition, // Show the transition animation (a modal is already shown and a new one is requested)
		hideTransition: hideTransition, // Hide the transition animation to show the content

		showLoading: showLoading, // show loading animation function
		hideLoading: hideLoading, // hide loading animation function

		resize: resize, // Resize animation function
		endResize: null, // Will be called one the content is resized

		updateBgColor: updateBgColor, // Change background color animation function

		endRemove: null // Will be called once the modal is totally gone
	};

	// -------------------------------------------------------
	// Private function
	// -------------------------------------------------------

	// Main function
	function processModal(settings) {
		if (modal.loadingShown || modal.transition || modal.anim)
			return;
		debug('processModal');
		modal.started = true;
		setDefaultCurrentSettings(settings);
		if (!modal.full)
			modal.blockerVars = modal.blocker = null;
		modal.error = false;
		modal.closing = false;
		modal.dataReady = false;
		modal.scripts = new Array();
		modal.scriptsShown = new Array();

		currentSettings.type = fileType();

		if ($.isFunction(currentSettings.processHandler))
			currentSettings.processHandler(currentSettings);

		from = currentSettings.from;
		url = currentSettings.url;

		if (currentSettings.type == 'swf') {
			// Swf is transforming as a raw content
			currentSettings.resizable = false;
			setCurrentSettings({overflow: 'hidden'}, 'css', 'content');
			currentSettings.content = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+currentSettings.width+'" height="'+currentSettings.height+'"><param name="movie" value="'+url+'"></param>';
			var tmp = '';
			$.each(currentSettings.swf, function(name, val) {
				currentSettings.content+= '<param name="'+name+'" value="'+val+'"></param>';
				tmp+= ' '+name+'="'+val+'"';
			});
			currentSettings.content+= '<embed src="'+url+'" type="application/x-shockwave-flash" width="'+currentSettings.width+'" height="'+currentSettings.height+'"'+tmp+'></embed></object>';
		}

		if (from) {
			var jFrom = $(from);
			if (currentSettings.type == 'form') {
				var data = $(from).serializeArray();
				data.push({name: currentSettings.formIndicator, value: 1});
				if (currentSettings.selector)
					data.push({name: currentSettings.selIndicator, value: currentSettings.selector.substring(1)});
				$.ajax($.extend({}, currentSettings.ajax, {
						url: url,
						data: data,
						type: from.method,
						success: ajaxLoaded,
						error: loadingError
					}));
				debug('Form Ajax Load: '+jFrom.attr('action'));
				showModal();
			} else if (currentSettings.type == 'formData') {
				// Form with data. We're using a hidden iframe
				initModal();
				jFrom.attr('target', 'nyroModalIframe');
				jFrom.attr('action', url);
				jFrom.prepend('<input type="hidden" name="'+currentSettings.formIndicator+'" value="1" />');
				if (currentSettings.selector)
					jFrom.prepend('<input type="hidden" name="'+currentSettings.selIndicator+'" value="'+currentSettings.selector.substring(1)+'" />');
				modal.tmp.html('<iframe frameborder="0" hspace="0" name="nyroModalIframe"></iframe>');
				$('iframe', modal.tmp)
					.css({
						width: currentSettings.width,
						height: currentSettings.height
					})
					.error(loadingError)
					.load(formDataLoaded);
				debug('Form Data Load: '+jFrom.attr('action'));
				showModal();
				showContentOrLoading();
			} else if (currentSettings.type == 'image') {
				var title = jFrom.attr('title') || currentSettings.defaultImgAlt;
				initModal();
				modal.tmp.html('<img id="nyroModalImg" />').find('img').attr('alt', title);
				debug('Image Load: '+url);
				modal.tmp.css({lineHeight: 0});
				$('img', modal.tmp)
					.error(loadingError)
					.load(function() {
						debug('Image Loaded: '+this.src);
						$(this).unbind('load');
						var w = modal.tmp.width();
						var h = modal.tmp.height();
						modal.tmp.css({lineHeight: ''});
						resized.width = w;
						resized.height = h;
						setCurrentSettings({
							width: w,
							height: h,
							imgWidth: w,
							imgHeight: h
						});
						setCurrentSettings({overflow: 'hidden'}, 'css', 'content');
						modal.dataReady = true;
						if (modal.loadingShown || modal.transition)
							showContentOrLoading();
					})
					.attr('src', url);
				showModal();
			} else if (currentSettings.type == 'iframeForm') {
				initModal();
				modal.tmp.html('<iframe frameborder="0" hspace="0" src="" name="nyroModalIframe" id="nyroModalIframe"></iframe>');
				debug('Iframe Form Load: '+url);
				$('iframe', modal.tmp).eq(0)
					.css({
						width: '100%',
						height: $.support.boxModel? '99%' : '100%'
					})
					.load(function(e) {
						if (currentSettings.titleFromIframe && url.indexOf(window.location.hostname) > -1)
							$.nyroModalSettings({title: $('iframe', modal.full).contents().find('title').text()});
					});
				modal.dataReady = true;
				showModal();
			} else if (currentSettings.type == 'iframe') {
				initModal();
				modal.tmp.html('<iframe frameborder="0" hspace="0" src="'+url+'" name="nyroModalIframe" id="nyroModalIframe"></iframe>');
				debug('Iframe Load: '+url);
				$('iframe', modal.tmp).eq(0)
					.css({
						width: '100%',
						height: $.support.boxModel? '99%' : '100%'
					})
					.load(function(e) {
						if (currentSettings.titleFromIframe && url.indexOf(window.location.hostname) > -1)
							$.nyroModalSettings({title: $('iframe', modal.full).contents().find('title').text()});
					});
				modal.dataReady = true;
				showModal();
			} else if (currentSettings.type) {
				// Could be every other kind of type or a dom selector
				debug('Content: '+currentSettings.type);
				initModal();
				modal.tmp.html(currentSettings.content);
				var w = modal.tmp.width();
				var h = modal.tmp.height();
				var div = $(currentSettings.type);
				if (div.length) {
					setCurrentSettings({type: 'div'});
					w = div.width();
					h = div.height();
					if (contentElt)
						contentEltLast = contentElt;
					contentElt = div;
					modal.tmp.append(div.contents());
				}
				setCurrentSettings({
					width: w,
					height: h
				});
				if (modal.tmp.html())
					modal.dataReady = true;
				else
					loadingError();
				if (!modal.ready)
					showModal();
				else
					endHideContent();
			} else {
				debug('Ajax Load: '+url);
				setCurrentSettings({type: 'ajax'});
				var data = currentSettings.ajax.data || {};
				if (currentSettings.selector) {
					if (typeof data == "string") {
						data+= '&'+currentSettings.selIndicator+'='+currentSettings.selector.substring(1);
					} else {
						data[currentSettings.selIndicator] = currentSettings.selector.substring(1);
					}
				}
				$.ajax($.extend(true, currentSettings.ajax, {
					url: url,
					success: ajaxLoaded,
					error: loadingError,
					data: data
				}));
				showModal();
			}
		} else if (currentSettings.content) {
			// Raw content not from a DOM element
			debug('Content: '+currentSettings.type);
			setCurrentSettings({type: 'manual'});
			initModal();
			modal.tmp.html($('<div/>').html(currentSettings.content).contents());
			if (modal.tmp.html())
				modal.dataReady = true;
			else
				loadingError();
			showModal();
		} else {
			// What should we show here? nothing happen
		}
	}

	// Update the current settings
	// object settings
	// string deep1 first key where overwrite the settings
	// string deep2 second key where overwrite the settings
	function setDefaultCurrentSettings(settings) {
		debug('setDefaultCurrentSettings');
		currentSettings = $.extend(true, {}, $.fn.nyroModal.settings, settings);
		currentSettings.selector = '';
		currentSettings.borderW = 0;
		currentSettings.borderH = 0;
		currentSettings.resizable = true;
		setMargin();
	}

	function setCurrentSettings(settings, deep1, deep2) {
		if (modal.started) {
			if (deep1 && deep2) {
				$.extend(true, currentSettings[deep1][deep2], settings);
			} else if (deep1) {
				$.extend(true, currentSettings[deep1], settings);
			} else {
				if (modal.animContent) {
					if (settings.width) {
						settings.setWidth = settings.width;
						delete settings['width'];
						shouldResize = true;
					}
					if (settings.height) {
						settings.setHeight = settings.height;
						delete settings['height'];
						shouldResize = true;
					}
				}
				$.extend(true, currentSettings, settings);
			}
		} else {
			if (deep1 && deep2) {
				$.extend(true, $.fn.nyroModal.settings[deep1][deep2], settings);
			} else if (deep1) {
				$.extend(true, $.fn.nyroModal.settings[deep1], settings);
			} else {
				$.extend(true, $.fn.nyroModal.settings, settings);
			}
		}
	}

	// Set the margin for postionning the element. Useful for IE6
	function setMarginScroll() {
		if (isIE6 && !modal.blocker) {
			if (document.documentElement) {
				currentSettings.marginScrollLeft = document.documentElement.scrollLeft;
				currentSettings.marginScrollTop = document.documentElement.scrollTop;
			} else {
				currentSettings.marginScrollLeft = document.body.scrollLeft;
				currentSettings.marginScrollTop = document.body.scrollTop;
			}
		} else {
			currentSettings.marginScrollLeft = 0;
			currentSettings.marginScrollTop = 0;
		}
	}

	// Set the margin for the content
	function setMargin() {
		setMarginScroll();
		currentSettings.marginLeft = -(currentSettings.width+currentSettings.borderW)/2;
		currentSettings.marginTop = -(currentSettings.height+currentSettings.borderH)/2;
		if (!modal.blocker) {
			currentSettings.marginLeft+= currentSettings.marginScrollLeft;
			currentSettings.marginTop+= currentSettings.marginScrollTop;
		}
	}

	// Set the margin for the current loading
	function setMarginLoading() {
		setMarginScroll();
		var outer = getOuter(modal.loading);
		currentSettings.marginTopLoading = -(modal.loading.height() + outer.h.border + outer.h.padding)/2;
		currentSettings.marginLeftLoading = -(modal.loading.width() + outer.w.border + outer.w.padding)/2;
		if (!modal.blocker) {
			currentSettings.marginLefttLoading+= currentSettings.marginScrollLeft;
			currentSettings.marginTopLoading+= currentSettings.marginScrollTop;
		}
	}

	// Set the modal Title
	function setTitle() {
		var title = $('h1#nyroModalTitle', modal.contentWrapper);
		if (title.length)
			title.text(currentSettings.title);
		else
			modal.contentWrapper.prepend('<h1 id="nyroModalTitle">'+currentSettings.title+'</h1>');
	}

	// Init the nyroModal div by settings the CSS elements and hide needed elements
	function initModal() {
		debug('initModal');
		if (!modal.full) {
			if (currentSettings.debug)
				setCurrentSettings({color: 'white'}, 'css', 'bg');

			var full = {
				zIndex: 100,
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%'
			};

			var contain = body;
			var iframeHideIE = '';
			if (currentSettings.blocker) {
				modal.blocker = contain = $(currentSettings.blocker);
				var pos = modal.blocker.offset();
				var w = modal.blocker.outerWidth();
				var h = modal.blocker.outerHeight();
				if (isIE6) {
					setCurrentSettings({
						height: '100%',
						width: '100%',
						top: 0,
						left: 0
					}, 'css', 'bg');
				}
				modal.blockerVars = {
					top: pos.top,
					left: pos.left,
					width: w,
					height: h
				};
				var plusTop = (/msie/.test(userAgent) ?0:getCurCSS(body.get(0), 'borderTopWidth'));
				var plusLeft = (/msie/.test(userAgent) ?0:getCurCSS(body.get(0), 'borderLeftWidth'));
				full = {
					position: 'absolute',
					top: pos.top + plusTop,
					left: pos.left + plusLeft,
					width: w,
					height: h
				};
			} else if (isIE6) {
				body.css({
					height: body.height()+'px',
					width: body.width()+'px',
					position: 'static',
					overflow: 'hidden'
				});
				$('html').css({overflow: 'hidden'});
				setCurrentSettings({
					css: {
						bg: {
							position: 'absolute',
							zIndex: 101,
							height: '110%',
							width: '110%',
							top: currentSettings.marginScrollTop+'px',
							left: currentSettings.marginScrollLeft+'px'
						},
						wrapper: { zIndex: 102	},
						loading: { zIndex: 103	}
					}
				});

				iframeHideIE = $('<iframe id="nyroModalIframeHideIe"></iframe>')
								.css($.extend({},
									currentSettings.css.bg, {
										opacity: 0,
										zIndex: 50,
										border: 'none'
									}));
			}

			contain.append($('<div id="nyroModalFull"><div id="nyroModalBg"></div><div id="nyroModalWrapper"><div id="nyroModalContent"></div></div><div id="nyrModalTmp"></div><div id="nyroModalLoading"></div></div>').hide());

			modal.full = $('#nyroModalFull')
				.css(full)
				.show();
			modal.bg = $('#nyroModalBg')
				.css($.extend({
						backgroundColor: currentSettings.bgColor
					}, currentSettings.css.bg))
				.before(iframeHideIE);
			if (!currentSettings.modal)
				modal.bg.click(removeModal);
			modal.loading = $('#nyroModalLoading')
				.css(currentSettings.css.loading)
				.hide();
			modal.contentWrapper = $('#nyroModalWrapper')
				.css(currentSettings.css.wrapper)
				.hide();
			modal.content = $('#nyroModalContent');
			modal.tmp = $('#nyrModalTmp').hide();

			// To stop the mousewheel if the the plugin is available
			if ($.isFunction($.fn.mousewheel)) {
				modal.content.mousewheel(function(e, d) {
					var elt = modal.content.get(0);
					if ((d > 0 && elt.scrollTop == 0) ||
							(d < 0 && elt.scrollHeight - elt.scrollTop == elt.clientHeight)) {
						e.preventDefault();
						e.stopPropagation();
					}
				});
			}

			$(document).keydown(keyHandler);
			modal.content.css({width: 'auto', height: 'auto'});
			modal.contentWrapper.css({width: 'auto', height: 'auto'});
		}
	}

	// Show the modal (ie: the background and then the loading if needed or the content directly)
	function showModal() {
		debug('showModal');
		if (!modal.ready) {
			initModal();
			modal.anim = true;
			currentSettings.showBackground(modal, currentSettings, endBackground);
		} else {
			modal.anim = true;
			modal.transition = true;
			currentSettings.showTransition(modal, currentSettings, function(){endHideContent();modal.anim=false;showContentOrLoading();});
		}
	}

	// Used for the escape key or the arrow in the gallery type
	function keyHandler(e) {
		if (e.keyCode == 27) {
			if (!currentSettings.modal)
				removeModal();
		} else if (currentSettings.gallery && modal.ready && modal.dataReady && !modal.anim && !modal.transition) {
			if (e.keyCode == 39 || e.keyCode == 40) {
				e.preventDefault();
				$.nyroModalNext();
				return false;
			} else if (e.keyCode == 37 || e.keyCode == 38) {
				e.preventDefault();
				$.nyroModalPrev();
				return false;
			}
		}
	}

	// Determine the filetype regarding the link DOM element
	function fileType() {
		if (currentSettings.forceType) {
			var tmp = currentSettings.forceType;
			if (!currentSettings.content)
				currentSettings.from = true;
			currentSettings.forceType = null;
			return tmp;
		}

		var from = currentSettings.from;

		var url;

		if (from && from.nodeName) {
			var jFrom = $(from);
			currentSettings.url = url = from.nodeName.toLowerCase() == 'form'? jFrom.attr('action') : from.href;

			if (jFrom.attr('rev') == 'modal')
				currentSettings.modal = true;

			currentSettings.title = jFrom.attr('title');

			if (from && from.rel)
				currentSettings.gallery = from.rel;

			var imgType = imageType(url, from);
			if (imgType)
				return imgType;

			var iframe = false;
			if (from.target && from.target.toLowerCase() == '_blank' || (from.hostname && from.hostname.replace(/:\d*$/,'') != window.location.hostname.replace(/:\d*$/,''))) {
				iframe = true;
			}
			if (from.nodeName.toLowerCase() == 'form') {
				if (iframe)
					return 'iframeForm';
				setCurrentSettings(extractUrlSel(url));
				if (jFrom.attr('enctype') == 'multipart/form-data')
					return 'formData';
				return 'form';
			}
			if (iframe)
				return 'iframe';
		} else {
			url = currentSettings.url;
			if (!currentSettings.content)
				currentSettings.from = true;

			if (!url)
				return null;

			var reg1 = new RegExp("^http://", "g");
			if (url.match(reg1))
				return 'iframe';
		}

		var imgType = imageType(url, from);
		if (imgType)
			return imgType;

		var swf = new RegExp('[^\.]\.(swf)\s*$', 'i');
		if (swf.test(url))
			return 'swf';

		var tmp = extractUrlSel(url);
		setCurrentSettings(tmp);

		if (!tmp.url)
			return tmp.selector;
	}

	function imageType(url, from) {
		var image = new RegExp(currentSettings.regexImg, 'i');
		if (image.test(url)) {
			return 'image';
		}
	}

	function extractUrlSel(url) {
		var ret = {
			url: null,
			selector: null
		};

		if (url) {
			var hash = getHash(url);
			var hashLoc = getHash(window.location.href);
			var curLoc = window.location.href.substring(0, window.location.href.length - hashLoc.length);
			var req = url.substring(0, url.length - hash.length);

			if (req == curLoc) {
				ret.selector = hash;
			} else {
				ret.url = req;
				ret.selector = hash;
			}
		}
		return ret;
	}

	// Called when the content cannot be loaded or tiemout reached
	function loadingError() {
		debug('loadingError');

		modal.error = true;

		if (!modal.ready)
			return;

		if ($.isFunction(currentSettings.handleError))
			currentSettings.handleError(modal, currentSettings);

		modal.loading
			.addClass(currentSettings.errorClass)
			.html(currentSettings.contentError);
		$(currentSettings.closeSelector, modal.loading).click(removeModal);
		setMarginLoading();
		modal.loading
			.css({
				marginTop: currentSettings.marginTopLoading+'px',
				marginLeft: currentSettings.marginLeftLoading+'px'
			});
	}

	// Put the content from modal.tmp to modal.content
	function fillContent() {
		debug('fillContent');
		if (!modal.tmp.html())
			return;

		modal.content.html(modal.tmp.contents());
		modal.tmp.empty();
		wrapContent();

		if (currentSettings.type == 'iframeForm') {
			$(currentSettings.from)
				.attr('target', 'nyroModalIframe')
				.data('processing', 1)
				.submit()
				.attr('target', '_blank')
				.removeData('processing');
		}

		if ($.isFunction(currentSettings.endFillContent))
			currentSettings.endFillContent(modal, currentSettings);

		modal.content.append(modal.scripts);

		$(currentSettings.closeSelector, modal.contentWrapper).click(removeModal);
		$(currentSettings.openSelector, modal.contentWrapper).nyroModal(getCurrentSettingsNew());
	}

	// Get the current settings to be used in new links
	function getCurrentSettingsNew() {
		var currentSettingsNew = $.extend(true, {}, currentSettings);
		if (resized.width)
			currentSettingsNew.width = null;
		if (resized.height)
			currentSettingsNew.height = null;
		currentSettingsNew.css.content.overflow = 'auto';
		return currentSettingsNew;
	}

	// Wrap the content and update the modal size if needed
	function wrapContent() {
		debug('wrapContent');

		var wrap = $(currentSettings.wrap[currentSettings.type]);
		modal.content.append(wrap.children().remove());
		modal.contentWrapper.wrapInner(wrap);

		if (currentSettings.gallery) {
			// Set the action for the next and prev button (or remove them)
			modal.content.append(currentSettings.galleryLinks);

			var currentSettingsNew = getCurrentSettingsNew();

			var linkPrev = getGalleryLink(-1);
			if (linkPrev) {
				var prev = $('.nyroModalPrev', modal.contentWrapper)
					.attr('href', linkPrev.attr('href'))
					.click(function(e) {
						e.preventDefault();
						linkPrev.nyroModalManual(currentSettingsNew);
						return false;
					});
				if (isIE6 && currentSettings.type == 'swf') {
					prev.before($('<iframe id="nyroModalIframeHideIeGalleryPrev"></iframe>').css({
											position: prev.css('position'),
											top: prev.css('top'),
											left: prev.css('left'),
											width: prev.width(),
											height: prev.height(),
											opacity: 0,
											border: 'none'
										}));
				}
			} else {
				$('.nyroModalPrev', modal.contentWrapper).remove();
			}
			var linkNext = getGalleryLink(1);
			if (linkNext) {
				var next = $('.nyroModalNext', modal.contentWrapper)
					.attr('href', linkNext.attr('href'))
					.click(function(e) {
						e.preventDefault();
						linkNext.nyroModalManual(currentSettingsNew);
						return false;
					});
				if (isIE6 && currentSettings.type == 'swf') {
					next.before($('<iframe id="nyroModalIframeHideIeGalleryNext"></iframe>')
									.css($.extend({}, {
											position: next.css('position'),
											top: next.css('top'),
											left: next.css('left'),
											width: next.width(),
											height: next.height(),
											opacity: 0,
											border: 'none'
										})));
				}
			} else {
				$('.nyroModalNext', modal.contentWrapper).remove();
			}
		}

		calculateSize();
	}

	function getGalleryLink(dir) {
		if (currentSettings.gallery) {
			if (!currentSettings.ltr)
				dir *= -1;
			// next
			var gallery = $('[rel="'+currentSettings.gallery+'"]');
			var currentIndex = gallery.index(currentSettings.from);
			var index = currentIndex + dir;
			if (index >= 0 && index < gallery.length)
				return gallery.eq(index);
		}
		return false;
	}

	// Calculate the size for the contentWrapper
	function calculateSize(resizing) {
		debug('calculateSize');

		if (!modal.wrapper)
			modal.wrapper = modal.contentWrapper.children(':first');

		resized.width = false;
		resized.height = false;
		if (currentSettings.autoSizable && (!currentSettings.width || !currentSettings.height)) {
			modal.contentWrapper
				.css({
					opacity: 0,
					width: 'auto',
					height: 'auto'
				})
				.show();
			var tmp = {
				width: 'auto',
				height: 'auto'
			};
			if (currentSettings.width) {
				tmp.width = currentSettings.width;
			} else if (currentSettings.type == 'iframe') {
				tmp.width = currentSettings.minWidth;
			}
				
			if (currentSettings.height) {
				tmp.height = currentSettings.height
			} else if (currentSettings.type == 'iframe') {
				tmp.height = currentSettings.minHeight;
			}
			
			modal.content.css(tmp);
			if (!currentSettings.width) {
				currentSettings.width = modal.content.outerWidth(true);
				resized.width = true;
			}
			if (!currentSettings.height) {
				currentSettings.height = modal.content.outerHeight(true);
				resized.height = true;
			}
			modal.contentWrapper.hide().css({opacity: 1});
		}

		currentSettings.width = Math.max(currentSettings.width, currentSettings.minWidth);
		currentSettings.height = Math.max(currentSettings.height, currentSettings.minHeight);

		var outerWrapper = getOuter(modal.contentWrapper);
		var outerWrapper2 = getOuter(modal.wrapper);
		var outerContent = getOuter(modal.content);

		var tmp = {
			content: {
				width: currentSettings.width,
				height: currentSettings.height
			},
			wrapper2: {
				width: currentSettings.width + outerContent.w.total,
				height: currentSettings.height + outerContent.h.total
			},
			wrapper: {
				width: currentSettings.width + outerContent.w.total + outerWrapper2.w.total,
				height: currentSettings.height + outerContent.h.total + outerWrapper2.h.total
			}
		};

		if (currentSettings.resizable) {
			var maxHeight = modal.blockerVars? modal.blockerVars.height : $(window).height()
								- outerWrapper.h.border
								- (tmp.wrapper.height - currentSettings.height);
			var maxWidth = modal.blockerVars? modal.blockerVars.width : $(window).width()
								- outerWrapper.w.border
								- (tmp.wrapper.width - currentSettings.width);
			maxHeight-= currentSettings.padding*2;
			maxWidth-= currentSettings.padding*2;

			if (tmp.content.height > maxHeight || tmp.content.width > maxWidth) {
				// We're gonna resize the modal as it will goes outside the view port
				if (currentSettings.type == 'image') {
					// An image is resized proportionnaly
					var diffW = tmp.content.width - currentSettings.imgWidth;
					var diffH = tmp.content.height - currentSettings.imgHeight;
						if (diffH < 0) diffH = 0;
						if (diffW < 0) diffW = 0;
					var calcH = maxHeight - diffH;
					var calcW = maxWidth - diffW;
					var ratio = Math.min(calcH/currentSettings.imgHeight, calcW/currentSettings.imgWidth);

					calcH = Math.floor(currentSettings.imgHeight*ratio);
					calcW = Math.floor(currentSettings.imgWidth*ratio);
					$('img#nyroModalImg', modal.content).css({
						height: calcH+'px',
						width: calcW+'px'
					});
					tmp.content.height = calcH + diffH;
					tmp.content.width = calcW + diffW;
				} else {
					// For an HTML content, we simply decrease the size
					tmp.content.height = Math.min(tmp.content.height, maxHeight);
					tmp.content.width = Math.min(tmp.content.width, maxWidth);
				}
				tmp.wrapper2 = {
						width: tmp.content.width + outerContent.w.total,
						height: tmp.content.height + outerContent.h.total
					};
				tmp.wrapper = {
						width: tmp.content.width + outerContent.w.total + outerWrapper2.w.total,
						height: tmp.content.height + outerContent.h.total + outerWrapper2.h.total
					};
			}
		}

		modal.content.css($.extend({}, tmp.content, currentSettings.css.content));
		modal.wrapper.css($.extend({}, tmp.wrapper2, currentSettings.css.wrapper2));

		if (!resizing) {
			modal.contentWrapper.css($.extend({}, tmp.wrapper, currentSettings.css.wrapper));
			if (currentSettings.type == 'image') {
				// Adding the title for the image
				var title = $('img', modal.content).attr('alt');
				$('img', modal.content).removeAttr('alt');
				if (title != currentSettings.defaultImgAlt) {
					var divTitle = $('<div>'+title+'</div>');
					modal.content.append(divTitle);
					if (currentSettings.setWidthImgTitle) {
						var outerDivTitle = getOuter(divTitle);
						divTitle.css({width: (tmp.content.width + outerContent.w.padding - outerDivTitle.w.total)+'px'});
					}
				}
			}

			if (!currentSettings.modal)
				modal.contentWrapper.prepend(currentSettings.closeButton);
		}

		if (currentSettings.title)
			setTitle();

		tmp.wrapper.borderW = outerWrapper.w.border;
		tmp.wrapper.borderH = outerWrapper.h.border;

		setCurrentSettings(tmp.wrapper);
		setMargin();
	}

	function removeModal(e) {
		debug('removeModal');
		if (e)
			e.preventDefault();
		if (modal.full && modal.ready) {
			modal.ready = false;
			modal.anim = true;
			modal.closing = true;
			if (modal.loadingShown || modal.transition) {
				currentSettings.hideLoading(modal, currentSettings, function() {
						modal.loading.hide();
						modal.loadingShown = false;
						modal.transition = false;
						currentSettings.hideBackground(modal, currentSettings, endRemove);
					});
			} else {
				if (fixFF)
					modal.content.css({position: ''}); // Fix Issue #10, remove the attribute
				modal.wrapper.css({overflow: 'hidden'}); // Used to fix a visual issue when hiding
				modal.content.css({overflow: 'hidden'}); // Used to fix a visual issue when hiding
				if ($.isFunction(currentSettings.beforeHideContent)) {
					currentSettings.beforeHideContent(modal, currentSettings, function() {
						currentSettings.hideContent(modal, currentSettings, function() {
							endHideContent();
							currentSettings.hideBackground(modal, currentSettings, endRemove);
						});
					});
				} else {
					currentSettings.hideContent(modal, currentSettings, function() {
							endHideContent();
							currentSettings.hideBackground(modal, currentSettings, endRemove);
						});
				}
			}
		}
		if (e)
			return false;
	}

	function showContentOrLoading() {
		debug('showContentOrLoading');
		if (modal.ready && !modal.anim) {
			if (modal.dataReady) {
				if (modal.tmp.html()) {
					modal.anim = true;
					if (modal.transition) {
						fillContent();
						modal.animContent = true;
						currentSettings.hideTransition(modal, currentSettings, function() {
							modal.loading.hide();
							modal.transition = false;
							modal.loadingShown = false;
							endShowContent();
						});
					} else {
						currentSettings.hideLoading(modal, currentSettings, function() {
								modal.loading.hide();
								modal.loadingShown = false;
								fillContent();
								setMarginLoading();
								setMargin();
								modal.animContent = true;
								currentSettings.showContent(modal, currentSettings, endShowContent);
							});
					}
				}
			} else if (!modal.loadingShown && !modal.transition) {
				modal.anim = true;
				modal.loadingShown = true;
				if (modal.error)
					loadingError();
				else
					modal.loading.html(currentSettings.contentLoading);
				$(currentSettings.closeSelector, modal.loading).click(removeModal);
				setMarginLoading();
				currentSettings.showLoading(modal, currentSettings, function(){modal.anim=false;showContentOrLoading();});
			}
		}
	}


	// -------------------------------------------------------
	// Private Data Loaded callback
	// -------------------------------------------------------

	function ajaxLoaded(data) {
		debug('AjaxLoaded: '+this.url);
		modal.tmp.html(currentSettings.selector
			?filterScripts($('<div>'+data+'</div>').find(currentSettings.selector).contents())
			:filterScripts(data));
		if (modal.tmp.html()) {
			modal.dataReady = true;
			showContentOrLoading();
		} else
			loadingError();
	}

	function formDataLoaded() {
		debug('formDataLoaded');
		var jFrom = $(currentSettings.from);
		jFrom.attr('action', jFrom.attr('action')+currentSettings.selector);
		jFrom.attr('target', '');
		$('input[name='+currentSettings.formIndicator+']', currentSettings.from).remove();
		var iframe = modal.tmp.children('iframe');
		var iframeContent = iframe.unbind('load').contents().find(currentSettings.selector || 'body').not('script[src]');
		iframe.attr('src', 'about:blank'); // Used to stop the loading in FF
		modal.tmp.html(iframeContent.html());
		if (modal.tmp.html()) {
			modal.dataReady = true;
			showContentOrLoading();
		} else
			loadingError();
	}


	// -------------------------------------------------------
	// Private Animation callback
	// -------------------------------------------------------

	function endHideContent() {
		debug('endHideContent');
		modal.anim = false;
		if (contentEltLast) {
			contentEltLast.append(modal.content.contents());
			contentEltLast= null;
		} else if (contentElt) {
			contentElt.append(modal.content.contents());
			contentElt= null;
		}
		modal.content.empty();
		
		modal.contentWrapper.hide().children().remove().empty().attr('style', '').hide();

		if (modal.closing || modal.transition)
			modal.contentWrapper.hide();

		modal.contentWrapper
			.css(currentSettings.css.wrapper)
			.append(modal.content);
		showContentOrLoading();
	}

	function endRemove() {
		debug('endRemove');
		$(document).unbind('keydown', keyHandler);
		modal.anim = false;
		modal.full.remove();
		modal.full = null;
		if (isIE6) {
			body.css({height: '', width: '', position: '', overflow: ''});
			$('html').css({overflow: ''});
		}
		if ($.isFunction(currentSettings.endRemove))
			currentSettings.endRemove(modal, currentSettings);
	}

	function endBackground() {
		debug('endBackground');
		modal.ready = true;
		modal.anim = false;
		showContentOrLoading();
	}

	function endShowContent() {
		debug('endShowContent');
		modal.anim = false;
		modal.animContent = false;
		modal.contentWrapper.css({opacity: ''}); // for the close button in IE
		fixFF = /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent) && parseFloat(browserVersion) < 1.9 && currentSettings.type != 'image';
		if (fixFF)
			modal.content.css({position: 'fixed'}); // Fix Issue #10
		modal.content.append(modal.scriptsShown);
		if (currentSettings.autoSizable && currentSettings.type == 'iframe') {
			var iframe = modal.content.find('iframe');
			if (iframe.length && iframe.attr('src').indexOf(window.location.hostname) !== -1) {
				var body = iframe.contents().find('body');
			
				if (body.height() > 0) {
					var h = body.outerHeight(true)+1;
					var w = body.outerWidth(true)+1;
					$.nyroModalSettings({
						height: h,
						width: w
					});
				} else {
					iframe.bind('load', function() {
						var body = iframe.contents().find('body');
						if (body.length && body.height() > 0) {
							var h = body.outerHeight(true)+1;
							var w = body.outerWidth(true)+1;
							$.nyroModalSettings({
								height: h,
								width: w
							});
						}
					});
				}
			}
		}
		if ($.isFunction(currentSettings.endShowContent))
			currentSettings.endShowContent(modal, currentSettings);
		if (shouldResize) {
			shouldResize = false;
			$.nyroModalSettings({width: currentSettings.setWidth, height: currentSettings.setHeight});
			delete currentSettings['setWidth'];
			delete currentSettings['setHeight'];
		}
		if (resized.width)
			setCurrentSettings({width: null});
		if (resized.height)
			setCurrentSettings({height: null});
	}


	// -------------------------------------------------------
	// Utilities
	// -------------------------------------------------------

	// Get the selector from an url (as string)
	function getHash(url) {
		if (typeof url == 'string') {
			var hashPos = url.indexOf('#');
			if (hashPos > -1)
				return url.substring(hashPos);
		}
		return '';
	}

	// Filter an html content to remove the script[src]
	function filterScripts(data) {
		// Removing the body, head and html tag
		if (typeof data == 'string')
			data = data.replace(/<\/?(html|head|body)([^>]*)>/gi, '');
		var tmp = new Array();
		$.each($.clean({0:data}, this.ownerDocument), function() {
			if ($.nodeName(this, "script")) {
				if (!this.src || $(this).attr('rel') == 'forceLoad') {
					if ($(this).attr('rev') == 'shown')
						modal.scriptsShown.push(this);
					else
						modal.scripts.push(this);
				}
			} else
				tmp.push(this);
		});
		return tmp;
	}

	// Get the vertical and horizontal margin, padding and border dimension
	function getOuter(elm) {
		elm = elm.get(0);
		var ret = {
			h: {
				margin: getCurCSS(elm, 'marginTop') + getCurCSS(elm, 'marginBottom'),
				border: getCurCSS(elm, 'borderTopWidth') + getCurCSS(elm, 'borderBottomWidth'),
				padding: getCurCSS(elm, 'paddingTop') + getCurCSS(elm, 'paddingBottom')
			},
			w: {
				margin: getCurCSS(elm, 'marginLeft') + getCurCSS(elm, 'marginRight'),
				border: getCurCSS(elm, 'borderLeftWidth') + getCurCSS(elm, 'borderRightWidth'),
				padding: getCurCSS(elm, 'paddingLeft') + getCurCSS(elm, 'paddingRight')
			}
		};

		ret.h.outer = ret.h.margin + ret.h.border;
		ret.w.outer = ret.w.margin + ret.w.border;

		ret.h.inner = ret.h.padding + ret.h.border;
		ret.w.inner = ret.w.padding + ret.w.border;

		ret.h.total = ret.h.outer + ret.h.padding;
		ret.w.total = ret.w.outer + ret.w.padding;

		return ret;
	}

	function getCurCSS(elm, name) {
		var ret = parseInt($.curCSS(elm, name, true));
		if (isNaN(ret))
			ret = 0;
		return ret;
	}

	// Proxy Debug function
	function debug(msg) {
		if ($.fn.nyroModal.settings.debug || currentSettings && currentSettings.debug)
			nyroModalDebug(msg, modal, currentSettings || {});
	}

	// -------------------------------------------------------
	// Default animation function
	// -------------------------------------------------------

	function showBackground(elts, settings, callback) {
		elts.bg.css({opacity:0}).fadeTo(500, 0.75, callback);
	}

	function hideBackground(elts, settings, callback) {
		elts.bg.fadeOut(300, callback);
	}

	function showLoading(elts, settings, callback) {
		elts.loading
			.css({
				marginTop: settings.marginTopLoading+'px',
				marginLeft: settings.marginLeftLoading+'px',
				opacity: 0
			})
			.show()
			.animate({
				opacity: 1
			}, {complete: callback, duration: 400});
	}

	function hideLoading(elts, settings, callback) {
		callback();
	}

	function showContent(elts, settings, callback) {
		elts.loading
			.css({
				marginTop: settings.marginTopLoading+'px',
				marginLeft: settings.marginLeftLoading+'px'
			})
			.show()
			.animate({
				width: settings.width+'px',
				height: settings.height+'px',
				marginTop: settings.marginTop+'px',
				marginLeft: settings.marginLeft+'px'
			}, {duration: 350, complete: function() {
				elts.contentWrapper
					.css({
						width: settings.width+'px',
						height: settings.height+'px',
						marginTop: settings.marginTop+'px',
						marginLeft: settings.marginLeft+'px'
					})
					.show();
					elts.loading.fadeOut(200, callback);
				}
			});
	}

	function hideContent(elts, settings, callback) {
		elts.contentWrapper
			.animate({
				height: '50px',
				width: '50px',
				marginTop: (-(25+settings.borderH)/2 + settings.marginScrollTop)+'px',
				marginLeft: (-(25+settings.borderW)/2 + settings.marginScrollLeft)+'px'
			}, {duration: 350, complete: function() {
				elts.contentWrapper.hide();
				callback();
			}});
	}

	function showTransition(elts, settings, callback) {
		// Put the loading with the same dimensions of the current content
		elts.loading
			.css({
				marginTop: elts.contentWrapper.css('marginTop'),
				marginLeft: elts.contentWrapper.css('marginLeft'),
				height: elts.contentWrapper.css('height'),
				width: elts.contentWrapper.css('width'),
				opacity: 0
			})
			.show()
			.fadeTo(400, 1, function() {
					elts.contentWrapper.hide();
					callback();
				});
	}

	function hideTransition(elts, settings, callback) {
		// Place the content wrapper underneath the the loading with the right dimensions
		elts.contentWrapper
			.hide()
			.css({
				width: settings.width+'px',
				height: settings.height+'px',
				marginLeft: settings.marginLeft+'px',
				marginTop: settings.marginTop+'px',
				opacity: 1
			});
		elts.loading
			.animate({
				width: settings.width+'px',
				height: settings.height+'px',
				marginLeft: settings.marginLeft+'px',
				marginTop: settings.marginTop+'px'
			}, {complete: function() {
					elts.contentWrapper.show();
					elts.loading.fadeOut(400, function() {
						elts.loading.hide();
						callback();
					});
				}, duration: 350});
	}

	function resize(elts, settings, callback) {
		elts.contentWrapper
			.animate({
				width: settings.width+'px',
				height: settings.height+'px',
				marginLeft: settings.marginLeft+'px',
				marginTop: settings.marginTop+'px'
			}, {complete: callback, duration: 400});
	}

	function updateBgColor(elts, settings, callback) {
		if (!$.fx.step.backgroundColor) {
			elts.bg.css({backgroundColor: settings.bgColor});
			callback();
		} else
			elts.bg
				.animate({
					backgroundColor: settings.bgColor
				}, {complete: callback, duration: 400});
	}

	// -------------------------------------------------------
	// Default initialization
	// -------------------------------------------------------

	$($.fn.nyroModal.settings.openSelector).nyroModal();

});

// Default debug function, to be overwritten if needed
//      Be aware that the settings parameter could be empty
function nyroModalDebug(msg, elts, settings) {
	if (elts.full)
		elts.bg.prepend(msg+'<br />');
}

/*----------------------- jquery ajax queue ------------------------------  */
/*
 * Queued Ajax requests.
 * A new Ajax request won't be started until the previous queued 
 * request has finished.
 */
jQuery.ajaxQueue = function(o){
	var _old = o.complete;
	o.complete = function(){
		if ( _old ) _old.apply( this, arguments );

		jQuery([ jQuery.ajaxQueue ]).dequeue();
	};
	
	jQuery([ jQuery.ajaxQueue ]).queue(function(){
		jQuery.ajax( o );
	});
};
