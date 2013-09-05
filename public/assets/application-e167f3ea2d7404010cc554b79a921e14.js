/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.src || node.href);
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */


(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function(a){var b="0.3.4",c="hasOwnProperty",d=/[\.\/]/,e="*",f=function(){},g=function(a,b){return a-b},h,i,j={n:{}},k=function(a,b){var c=j,d=i,e=Array.prototype.slice.call(arguments,2),f=k.listeners(a),l=0,m=!1,n,o=[],p={},q=[],r=h,s=[];h=a,i=0;for(var t=0,u=f.length;t<u;t++)"zIndex"in f[t]&&(o.push(f[t].zIndex),f[t].zIndex<0&&(p[f[t].zIndex]=f[t]));o.sort(g);while(o[l]<0){n=p[o[l++]],q.push(n.apply(b,e));if(i){i=d;return q}}for(t=0;t<u;t++){n=f[t];if("zIndex"in n)if(n.zIndex==o[l]){q.push(n.apply(b,e));if(i)break;do{l++,n=p[o[l]],n&&q.push(n.apply(b,e));if(i)break}while(n)}else p[n.zIndex]=n;else{q.push(n.apply(b,e));if(i)break}}i=d,h=r;return q.length?q:null};k.listeners=function(a){var b=a.split(d),c=j,f,g,h,i,k,l,m,n,o=[c],p=[];for(i=0,k=b.length;i<k;i++){n=[];for(l=0,m=o.length;l<m;l++){c=o[l].n,g=[c[b[i]],c[e]],h=2;while(h--)f=g[h],f&&(n.push(f),p=p.concat(f.f||[]))}o=n}return p},k.on=function(a,b){var c=a.split(d),e=j;for(var g=0,h=c.length;g<h;g++)e=e.n,!e[c[g]]&&(e[c[g]]={n:{}}),e=e[c[g]];e.f=e.f||[];for(g=0,h=e.f.length;g<h;g++)if(e.f[g]==b)return f;e.f.push(b);return function(a){+a==+a&&(b.zIndex=+a)}},k.stop=function(){i=1},k.nt=function(a){if(a)return(new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)")).test(h);return h},k.off=k.unbind=function(a,b){var f=a.split(d),g,h,i,k,l,m,n,o=[j];for(k=0,l=f.length;k<l;k++)for(m=0;m<o.length;m+=i.length-2){i=[m,1],g=o[m].n;if(f[k]!=e)g[f[k]]&&i.push(g[f[k]]);else for(h in g)g[c](h)&&i.push(g[h]);o.splice.apply(o,i)}for(k=0,l=o.length;k<l;k++){g=o[k];while(g.n){if(b){if(g.f){for(m=0,n=g.f.length;m<n;m++)if(g.f[m]==b){g.f.splice(m,1);break}!g.f.length&&delete g.f}for(h in g.n)if(g.n[c](h)&&g.n[h].f){var p=g.n[h].f;for(m=0,n=p.length;m<n;m++)if(p[m]==b){p.splice(m,1);break}!p.length&&delete g.n[h].f}}else{delete g.f;for(h in g.n)g.n[c](h)&&g.n[h].f&&delete g.n[h].f}g=g.n}}},k.once=function(a,b){var c=function(){var d=b.apply(this,arguments);k.unbind(a,c);return d};return k.on(a,c)},k.version=b,k.toString=function(){return"You are running Eve "+b},typeof module!="undefined"&&module.exports?module.exports=k:typeof define!="undefined"?define("eve",[],function(){return k}):a.eve=k})(this),function(){function cF(a){for(var b=0;b<cy.length;b++)cy[b].el.paper==a&&cy.splice(b--,1)}function cE(b,d,e,f,h,i){e=Q(e);var j,k,l,m=[],o,p,q,t=b.ms,u={},v={},w={};if(f)for(y=0,z=cy.length;y<z;y++){var x=cy[y];if(x.el.id==d.id&&x.anim==b){x.percent!=e?(cy.splice(y,1),l=1):k=x,d.attr(x.totalOrigin);break}}else f=+v;for(var y=0,z=b.percents.length;y<z;y++){if(b.percents[y]==e||b.percents[y]>f*b.top){e=b.percents[y],p=b.percents[y-1]||0,t=t/b.top*(e-p),o=b.percents[y+1],j=b.anim[e];break}f&&d.attr(b.anim[b.percents[y]])}if(!!j){if(!k){for(var A in j)if(j[g](A))if(U[g](A)||d.paper.customAttributes[g](A)){u[A]=d.attr(A),u[A]==null&&(u[A]=T[A]),v[A]=j[A];switch(U[A]){case C:w[A]=(v[A]-u[A])/t;break;case"colour":u[A]=a.getRGB(u[A]);var B=a.getRGB(v[A]);w[A]={r:(B.r-u[A].r)/t,g:(B.g-u[A].g)/t,b:(B.b-u[A].b)/t};break;case"path":var D=bR(u[A],v[A]),E=D[1];u[A]=D[0],w[A]=[];for(y=0,z=u[A].length;y<z;y++){w[A][y]=[0];for(var F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(E[y][F]-u[A][y][F])/t}break;case"transform":var H=d._,I=ca(H[A],v[A]);if(I){u[A]=I.from,v[A]=I.to,w[A]=[],w[A].real=!0;for(y=0,z=u[A].length;y<z;y++){w[A][y]=[u[A][y][0]];for(F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(v[A][y][F]-u[A][y][F])/t}}else{var J=d.matrix||new cb,K={_:{transform:H.transform},getBBox:function(){return d.getBBox(1)}};u[A]=[J.a,J.b,J.c,J.d,J.e,J.f],b$(K,v[A]),v[A]=K._.transform,w[A]=[(K.matrix.a-J.a)/t,(K.matrix.b-J.b)/t,(K.matrix.c-J.c)/t,(K.matrix.d-J.d)/t,(K.matrix.e-J.e)/t,(K.matrix.f-J.f)/t]}break;case"csv":var L=r(j[A])[s](c),M=r(u[A])[s](c);if(A=="clip-rect"){u[A]=M,w[A]=[],y=M.length;while(y--)w[A][y]=(L[y]-u[A][y])/t}v[A]=L;break;default:L=[][n](j[A]),M=[][n](u[A]),w[A]=[],y=d.paper.customAttributes[A].length;while(y--)w[A][y]=((L[y]||0)-(M[y]||0))/t}}var O=j.easing,P=a.easing_formulas[O];if(!P){P=r(O).match(N);if(P&&P.length==5){var R=P;P=function(a){return cC(a,+R[1],+R[2],+R[3],+R[4],t)}}else P=bf}q=j.start||b.start||+(new Date),x={anim:b,percent:e,timestamp:q,start:q+(b.del||0),status:0,initstatus:f||0,stop:!1,ms:t,easing:P,from:u,diff:w,to:v,el:d,callback:j.callback,prev:p,next:o,repeat:i||b.times,origin:d.attr(),totalOrigin:h},cy.push(x);if(f&&!k&&!l){x.stop=!0,x.start=new Date-t*f;if(cy.length==1)return cA()}l&&(x.start=new Date-x.ms*f),cy.length==1&&cz(cA)}else k.initstatus=f,k.start=new Date-k.ms*f;eve("raphael.anim.start."+d.id,d,b)}}function cD(a,b){var c=[],d={};this.ms=b,this.times=1;if(a){for(var e in a)a[g](e)&&(d[Q(e)]=a[e],c.push(Q(e)));c.sort(bd)}this.anim=d,this.top=c[c.length-1],this.percents=c}function cC(a,b,c,d,e,f){function o(a,b){var c,d,e,f,j,k;for(e=a,k=0;k<8;k++){f=m(e)-a;if(z(f)<b)return e;j=(3*i*e+2*h)*e+g;if(z(j)<1e-6)break;e=e-f/j}c=0,d=1,e=a;if(e<c)return c;if(e>d)return d;while(c<d){f=m(e);if(z(f-a)<b)return e;a>f?c=e:d=e,e=(d-c)/2+c}return e}function n(a,b){var c=o(a,b);return((l*c+k)*c+j)*c}function m(a){return((i*a+h)*a+g)*a}var g=3*b,h=3*(d-b)-g,i=1-g-h,j=3*c,k=3*(e-c)-j,l=1-j-k;return n(a,1/(200*f))}function cq(){return this.x+q+this.y+q+this.width+" × "+this.height}function cp(){return this.x+q+this.y}function cb(a,b,c,d,e,f){a!=null?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function bH(b,c,d){b=a._path2curve(b),c=a._path2curve(c);var e,f,g,h,i,j,k,l,m,n,o=d?0:[];for(var p=0,q=b.length;p<q;p++){var r=b[p];if(r[0]=="M")e=i=r[1],f=j=r[2];else{r[0]=="C"?(m=[e,f].concat(r.slice(1)),e=m[6],f=m[7]):(m=[e,f,e,f,i,j,i,j],e=i,f=j);for(var s=0,t=c.length;s<t;s++){var u=c[s];if(u[0]=="M")g=k=u[1],h=l=u[2];else{u[0]=="C"?(n=[g,h].concat(u.slice(1)),g=n[6],h=n[7]):(n=[g,h,g,h,k,l,k,l],g=k,h=l);var v=bG(m,n,d);if(d)o+=v;else{for(var w=0,x=v.length;w<x;w++)v[w].segment1=p,v[w].segment2=s,v[w].bez1=m,v[w].bez2=n;o=o.concat(v)}}}}}return o}function bG(b,c,d){var e=a.bezierBBox(b),f=a.bezierBBox(c);if(!a.isBBoxIntersect(e,f))return d?0:[];var g=bB.apply(0,b),h=bB.apply(0,c),i=~~(g/5),j=~~(h/5),k=[],l=[],m={},n=d?0:[];for(var o=0;o<i+1;o++){var p=a.findDotsAtSegment.apply(a,b.concat(o/i));k.push({x:p.x,y:p.y,t:o/i})}for(o=0;o<j+1;o++)p=a.findDotsAtSegment.apply(a,c.concat(o/j)),l.push({x:p.x,y:p.y,t:o/j});for(o=0;o<i;o++)for(var q=0;q<j;q++){var r=k[o],s=k[o+1],t=l[q],u=l[q+1],v=z(s.x-r.x)<.001?"y":"x",w=z(u.x-t.x)<.001?"y":"x",x=bD(r.x,r.y,s.x,s.y,t.x,t.y,u.x,u.y);if(x){if(m[x.x.toFixed(4)]==x.y.toFixed(4))continue;m[x.x.toFixed(4)]=x.y.toFixed(4);var y=r.t+z((x[v]-r[v])/(s[v]-r[v]))*(s.t-r.t),A=t.t+z((x[w]-t[w])/(u[w]-t[w]))*(u.t-t.t);y>=0&&y<=1&&A>=0&&A<=1&&(d?n++:n.push({x:x.x,y:x.y,t1:y,t2:A}))}}return n}function bF(a,b){return bG(a,b,1)}function bE(a,b){return bG(a,b)}function bD(a,b,c,d,e,f,g,h){if(!(x(a,c)<y(e,g)||y(a,c)>x(e,g)||x(b,d)<y(f,h)||y(b,d)>x(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(!k)return;var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(n<+y(a,c).toFixed(2)||n>+x(a,c).toFixed(2)||n<+y(e,g).toFixed(2)||n>+x(e,g).toFixed(2)||o<+y(b,d).toFixed(2)||o>+x(b,d).toFixed(2)||o<+y(f,h).toFixed(2)||o>+x(f,h).toFixed(2))return;return{x:l,y:m}}}function bC(a,b,c,d,e,f,g,h,i){if(!(i<0||bB(a,b,c,d,e,f,g,h)<i)){var j=1,k=j/2,l=j-k,m,n=.01;m=bB(a,b,c,d,e,f,g,h,l);while(z(m-i)>n)k/=2,l+=(m<i?1:-1)*k,m=bB(a,b,c,d,e,f,g,h,l);return l}}function bB(a,b,c,d,e,f,g,h,i){i==null&&(i=1),i=i>1?1:i<0?0:i;var j=i/2,k=12,l=[-0.1252,.1252,-0.3678,.3678,-0.5873,.5873,-0.7699,.7699,-0.9041,.9041,-0.9816,.9816],m=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],n=0;for(var o=0;o<k;o++){var p=j*l[o]+j,q=bA(p,a,c,e,g),r=bA(p,b,d,f,h),s=q*q+r*r;n+=m[o]*w.sqrt(s)}return j*n}function bA(a,b,c,d,e){var f=-3*b+9*c-9*d+3*e,g=a*f+6*b-12*c+6*d;return a*g-3*b+3*c}function by(a,b){var c=[];for(var d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}function bx(){return this.hex}function bv(a,b,c){function d(){var e=Array.prototype.slice.call(arguments,0),f=e.join("␀"),h=d.cache=d.cache||{},i=d.count=d.count||[];if(h[g](f)){bu(i,f);return c?c(h[f]):h[f]}i.length>=1e3&&delete h[i.shift()],i.push(f),h[f]=a[m](b,e);return c?c(h[f]):h[f]}return d}function bu(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function bm(a){if(Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[g](c)&&(b[c]=bm(a[c]));return b}function a(c){if(a.is(c,"function"))return b?c():eve.on("raphael.DOMload",c);if(a.is(c,E))return a._engine.create[m](a,c.splice(0,3+a.is(c[0],C))).add(c);var d=Array.prototype.slice.call(arguments,0);if(a.is(d[d.length-1],"function")){var e=d.pop();return b?e.call(a._engine.create[m](a,d)):eve.on("raphael.DOMload",function(){e.call(a._engine.create[m](a,d))})}return a._engine.create[m](a,arguments)}a.version="2.1.0",a.eve=eve;var b,c=/[, ]+/,d={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},e=/\{(\d+)\}/g,f="prototype",g="hasOwnProperty",h={doc:document,win:window},i={was:Object.prototype[g].call(h.win,"Raphael"),is:h.win.Raphael},j=function(){this.ca=this.customAttributes={}},k,l="appendChild",m="apply",n="concat",o="createTouch"in h.doc,p="",q=" ",r=String,s="split",t="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[s](q),u={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},v=r.prototype.toLowerCase,w=Math,x=w.max,y=w.min,z=w.abs,A=w.pow,B=w.PI,C="number",D="string",E="array",F="toString",G="fill",H=Object.prototype.toString,I={},J="push",K=a._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,L=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,M={NaN:1,Infinity:1,"-Infinity":1},N=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,O=w.round,P="setAttribute",Q=parseFloat,R=parseInt,S=r.prototype.toUpperCase,T=a._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},U=a._availableAnimAttrs={blur:C,"clip-rect":"csv",cx:C,cy:C,fill:"colour","fill-opacity":C,"font-size":C,height:C,opacity:C,path:"path",r:C,rx:C,ry:C,stroke:"colour","stroke-opacity":C,"stroke-width":C,transform:"transform",width:C,x:C,y:C},V=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,W=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,X={hs:1,rg:1},Y=/,?([achlmqrstvxz]),?/gi,Z=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,$=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,_=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,ba=a._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,bb={},bc=function(a,b){return a.key-b.key},bd=function(a,b){return Q(a)-Q(b)},be=function(){},bf=function(a){return a},bg=a._rectPath=function(a,b,c,d,e){if(e)return[["M",a+e,b],["l",c-e*2,0],["a",e,e,0,0,1,e,e],["l",0,d-e*2],["a",e,e,0,0,1,-e,e],["l",e*2-c,0],["a",e,e,0,0,1,-e,-e],["l",0,e*2-d],["a",e,e,0,0,1,e,-e],["z"]];return[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]},bh=function(a,b,c,d){d==null&&(d=c);return[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]},bi=a._getPath={path:function(a){return a.attr("path")},circle:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.r)},ellipse:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height,b.r)},image:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height)},text:function(a){var b=a._getBBox();return bg(b.x,b.y,b.width,b.height)}},bj=a.mapPath=function(a,b){if(!b)return a;var c,d,e,f,g,h,i;a=bR(a);for(e=0,g=a.length;e<g;e++){i=a[e];for(f=1,h=i.length;f<h;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d}return a};a._g=h,a.type=h.win.SVGAngle||h.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML";if(a.type=="VML"){var bk=h.doc.createElement("div"),bl;bk.innerHTML='<v:shape adj="1"/>',bl=bk.firstChild,bl.style.behavior="url(#default#VML)";if(!bl||typeof bl.adj!="object")return a.type=p;bk=null}a.svg=!(a.vml=a.type=="VML"),a._Paper=j,a.fn=k=j.prototype=a.prototype,a._id=0,a._oid=0,a.is=function(a,b){b=v.call(b);if(b=="finite")return!M[g](+a);if(b=="array")return a instanceof Array;return b=="null"&&a===null||b==typeof a&&a!==null||b=="object"&&a===Object(a)||b=="array"&&Array.isArray&&Array.isArray(a)||H.call(a).slice(8,-1).toLowerCase()==b},a.angle=function(b,c,d,e,f,g){if(f==null){var h=b-d,i=c-e;if(!h&&!i)return 0;return(180+w.atan2(-i,-h)*180/B+360)%360}return a.angle(b,c,f,g)-a.angle(d,e,f,g)},a.rad=function(a){return a%360*B/180},a.deg=function(a){return a*180/B%360},a.snapTo=function(b,c,d){d=a.is(d,"finite")?d:10;if(a.is(b,E)){var e=b.length;while(e--)if(z(b[e]-c)<=d)return b[e]}else{b=+b;var f=c%b;if(f<d)return c-f;if(f>b-d)return c-f+b}return c};var bn=a.createUUID=function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}}(/[xy]/g,function(a){var b=w.random()*16|0,c=a=="x"?b:b&3|8;return c.toString(16)});a.setWindow=function(b){eve("raphael.setWindow",a,h.win,b),h.win=b,h.doc=h.win.document,a._engine.initWin&&a._engine.initWin(h.win)};var bo=function(b){if(a.vml){var c=/^\s+|\s+$/g,d;try{var e=new ActiveXObject("htmlfile");e.write("<body>"),e.close(),d=e.body}catch(f){d=createPopup().document.body}var g=d.createTextRange();bo=bv(function(a){try{d.style.color=r(a).replace(c,p);var b=g.queryCommandValue("ForeColor");b=(b&255)<<16|b&65280|(b&16711680)>>>16;return"#"+("000000"+b.toString(16)).slice(-6)}catch(e){return"none"}})}else{var i=h.doc.createElement("i");i.title="Raphaël Colour Picker",i.style.display="none",h.doc.body.appendChild(i),bo=bv(function(a){i.style.color=a;return h.doc.defaultView.getComputedStyle(i,p).getPropertyValue("color")})}return bo(b)},bp=function(){return"hsb("+[this.h,this.s,this.b]+")"},bq=function(){return"hsl("+[this.h,this.s,this.l]+")"},br=function(){return this.hex},bs=function(b,c,d){c==null&&a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b&&(d=b.b,c=b.g,b=b.r);if(c==null&&a.is(b,D)){var e=a.getRGB(b);b=e.r,c=e.g,d=e.b}if(b>1||c>1||d>1)b/=255,c/=255,d/=255;return[b,c,d]},bt=function(b,c,d,e){b*=255,c*=255,d*=255;var f={r:b,g:c,b:d,hex:a.rgb(b,c,d),toString:br};a.is(e,"finite")&&(f.opacity=e);return f};a.color=function(b){var c;a.is(b,"object")&&"h"in b&&"s"in b&&"b"in b?(c=a.hsb2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):a.is(b,"object")&&"h"in b&&"s"in b&&"l"in b?(c=a.hsl2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):(a.is(b,"string")&&(b=a.getRGB(b)),a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b?(c=a.rgb2hsl(b),b.h=c.h,b.s=c.s,b.l=c.l,c=a.rgb2hsb(b),b.v=c.b):(b={hex:"none"},b.r=b.g=b.b=b.h=b.s=b.v=b.l=-1)),b.toString=br;return b},a.hsb2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,f,g,h,i;a=a%360/60,i=c*b,h=i*(1-z(a%2-1)),e=f=g=c-i,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.hsl2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h);if(a>1||b>1||c>1)a/=360,b/=100,c/=100;a*=360;var e,f,g,h,i;a=a%360/60,i=2*b*(c<.5?c:1-c),h=i*(1-z(a%2-1)),e=f=g=c-i/2,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.rgb2hsb=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;f=x(a,b,c),g=f-y(a,b,c),d=g==0?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=(d+360)%6*60/360,e=g==0?0:g/f;return{h:d,s:e,b:f,toString:bp}},a.rgb2hsl=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;g=x(a,b,c),h=y(a,b,c),i=g-h,d=i==0?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=(d+360)%6*60/360,f=(g+h)/2,e=i==0?0:f<.5?i/(2*f):i/(2-2*f);return{h:d,s:e,l:f,toString:bq}},a._path2string=function(){return this.join(",").replace(Y,"$1")};var bw=a._preload=function(a,b){var c=h.doc.createElement("img");c.style.cssText="position:absolute;left:-9999em;top:-9999em",c.onload=function(){b.call(this),this.onload=null,h.doc.body.removeChild(this)},c.onerror=function(){h.doc.body.removeChild(this)},h.doc.body.appendChild(c),c.src=a};a.getRGB=bv(function(b){if(!b||!!((b=r(b)).indexOf("-")+1))return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx};if(b=="none")return{r:-1,g:-1,b:-1,hex:"none",toString:bx};!X[g](b.toLowerCase().substring(0,2))&&b.charAt()!="#"&&(b=bo(b));var c,d,e,f,h,i,j,k=b.match(L);if(k){k[2]&&(f=R(k[2].substring(5),16),e=R(k[2].substring(3,5),16),d=R(k[2].substring(1,3),16)),k[3]&&(f=R((i=k[3].charAt(3))+i,16),e=R((i=k[3].charAt(2))+i,16),d=R((i=k[3].charAt(1))+i,16)),k[4]&&(j=k[4][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),k[1].toLowerCase().slice(0,4)=="rgba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100));if(k[5]){j=k[5][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsb2rgb(d,e,f,h)}if(k[6]){j=k[6][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsla"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsl2rgb(d,e,f,h)}k={r:d,g:e,b:f,toString:bx},k.hex="#"+(16777216|f|e<<8|d<<16).toString(16).slice(1),a.is(h,"finite")&&(k.opacity=h);return k}return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx}},a),a.hsb=bv(function(b,c,d){return a.hsb2rgb(b,c,d).hex}),a.hsl=bv(function(b,c,d){return a.hsl2rgb(b,c,d).hex}),a.rgb=bv(function(a,b,c){return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)}),a.getColor=function(a){var b=this.getColor.start=this.getColor.start||{h:0,s:1,b:a||.75},c=this.hsb2rgb(b.h,b.s,b.b);b.h+=.075,b.h>1&&(b.h=0,b.s-=.2,b.s<=0&&(this.getColor.start={h:0,s:1,b:b.b}));return c.hex},a.getColor.reset=function(){delete this.start},a.parsePathString=function(b){if(!b)return null;var c=bz(b);if(c.arr)return bJ(c.arr);var d={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},e=[];a.is(b,E)&&a.is(b[0],E)&&(e=bJ(b)),e.length||r(b).replace(Z,function(a,b,c){var f=[],g=b.toLowerCase();c.replace(_,function(a,b){b&&f.push(+b)}),g=="m"&&f.length>2&&(e.push([b][n](f.splice(0,2))),g="l",b=b=="m"?"l":"L");if(g=="r")e.push([b][n](f));else while(f.length>=d[g]){e.push([b][n](f.splice(0,d[g])));if(!d[g])break}}),e.toString=a._path2string,c.arr=bJ(e);return e},a.parseTransformString=bv(function(b){if(!b)return null;var c={r:3,s:4,t:2,m:6},d=[];a.is(b,E)&&a.is(b[0],E)&&(d=bJ(b)),d.length||r(b).replace($,function(a,b,c){var e=[],f=v.call(b);c.replace(_,function(a,b){b&&e.push(+b)}),d.push([b][n](e))}),d.toString=a._path2string;return d});var bz=function(a){var b=bz.ps=bz.ps||{};b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[g](c)&&c!=a&&(b[c].sleep--,!b[c].sleep&&delete b[c])});return b[a]};a.findDotsAtSegment=function(a,b,c,d,e,f,g,h,i){var j=1-i,k=A(j,3),l=A(j,2),m=i*i,n=m*i,o=k*a+l*3*i*c+j*3*i*i*e+n*g,p=k*b+l*3*i*d+j*3*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d),u=j*a+i*c,v=j*b+i*d,x=j*e+i*g,y=j*f+i*h,z=90-w.atan2(q-s,r-t)*180/B;(q>s||r<t)&&(z+=180);return{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:u,y:v},end:{x:x,y:y},alpha:z}},a.bezierBBox=function(b,c,d,e,f,g,h,i){a.is(b,"array")||(b=[b,c,d,e,f,g,h,i]);var j=bQ.apply(null,b);return{x:j.min.x,y:j.min.y,x2:j.max.x,y2:j.max.y,width:j.max.x-j.min.x,height:j.max.y-j.min.y}},a.isPointInsideBBox=function(a,b,c){return b>=a.x&&b<=a.x2&&c>=a.y&&c<=a.y2},a.isBBoxIntersect=function(b,c){var d=a.isPointInsideBBox;return d(c,b.x,b.y)||d(c,b.x2,b.y)||d(c,b.x,b.y2)||d(c,b.x2,b.y2)||d(b,c.x,c.y)||d(b,c.x2,c.y)||d(b,c.x,c.y2)||d(b,c.x2,c.y2)||(b.x<c.x2&&b.x>c.x||c.x<b.x2&&c.x>b.x)&&(b.y<c.y2&&b.y>c.y||c.y<b.y2&&c.y>b.y)},a.pathIntersection=function(a,b){return bH(a,b)},a.pathIntersectionNumber=function(a,b){return bH(a,b,1)},a.isPointInsidePath=function(b,c,d){var e=a.pathBBox(b);return a.isPointInsideBBox(e,c,d)&&bH(b,[["M",c,d],["H",e.x2+10]],1)%2==1},a._removedFactory=function(a){return function(){eve("raphael.log",null,"Raphaël: you are calling to method “"+a+"” of removed object",a)}};var bI=a.pathBBox=function(a){var b=bz(a);if(b.bbox)return b.bbox;if(!a)return{x:0,y:0,width:0,height:0,x2:0,y2:0};a=bR(a);var c=0,d=0,e=[],f=[],g;for(var h=0,i=a.length;h<i;h++){g=a[h];if(g[0]=="M")c=g[1],d=g[2],e.push(c),f.push(d);else{var j=bQ(c,d,g[1],g[2],g[3],g[4],g[5],g[6]);e=e[n](j.min.x,j.max.x),f=f[n](j.min.y,j.max.y),c=g[5],d=g[6]}}var k=y[m](0,e),l=y[m](0,f),o=x[m](0,e),p=x[m](0,f),q={x:k,y:l,x2:o,y2:p,width:o-k,height:p-l};b.bbox=bm(q);return q},bJ=function(b){var c=bm(b);c.toString=a._path2string;return c},bK=a._pathToRelative=function(b){var c=bz(b);if(c.rel)return bJ(c.rel);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=b[0][1],f=b[0][2],g=e,h=f,i++,d.push(["M",e,f]));for(var j=i,k=b.length;j<k;j++){var l=d[j]=[],m=b[j];if(m[0]!=v.call(m[0])){l[0]=v.call(m[0]);switch(l[0]){case"a":l[1]=m[1],l[2]=m[2],l[3]=m[3],l[4]=m[4],l[5]=m[5],l[6]=+(m[6]-e).toFixed(3),l[7]=+(m[7]-f).toFixed(3);break;case"v":l[1]=+(m[1]-f).toFixed(3);break;case"m":g=m[1],h=m[2];default:for(var n=1,o=m.length;n<o;n++)l[n]=+(m[n]-(n%2?e:f)).toFixed(3)}}else{l=d[j]=[],m[0]=="m"&&(g=m[1]+e,h=m[2]+f);for(var p=0,q=m.length;p<q;p++)d[j][p]=m[p]}var r=d[j].length;switch(d[j][0]){case"z":e=g,f=h;break;case"h":e+=+d[j][r-1];break;case"v":f+=+d[j][r-1];break;default:e+=+d[j][r-2],f+=+d[j][r-1]}}d.toString=a._path2string,c.rel=bJ(d);return d},bL=a._pathToAbsolute=function(b){var c=bz(b);if(c.abs)return bJ(c.abs);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);if(!b||!b.length)return[["M",0,0]];var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=+b[0][1],f=+b[0][2],g=e,h=f,i++,d[0]=["M",e,f]);var j=b.length==3&&b[0][0]=="M"&&b[1][0].toUpperCase()=="R"&&b[2][0].toUpperCase()=="Z";for(var k,l,m=i,o=b.length;m<o;m++){d.push(k=[]),l=b[m];if(l[0]!=S.call(l[0])){k[0]=S.call(l[0]);switch(k[0]){case"A":k[1]=l[1],k[2]=l[2],k[3]=l[3],k[4]=l[4],k[5]=l[5],k[6]=+(l[6]+e),k[7]=+(l[7]+f);break;case"V":k[1]=+l[1]+f;break;case"H":k[1]=+l[1]+e;break;case"R":var p=[e,f][n](l.slice(1));for(var q=2,r=p.length;q<r;q++)p[q]=+p[q]+e,p[++q]=+p[q]+f;d.pop(),d=d[n](by(p,j));break;case"M":g=+l[1]+e,h=+l[2]+f;default:for(q=1,r=l.length;q<r;q++)k[q]=+l[q]+(q%2?e:f)}}else if(l[0]=="R")p=[e,f][n](l.slice(1)),d.pop(),d=d[n](by(p,j)),k=["R"][n](l.slice(-2));else for(var s=0,t=l.length;s<t;s++)k[s]=l[s];switch(k[0]){case"Z":e=g,f=h;break;case"H":e=k[1];break;case"V":f=k[1];break;case"M":g=k[k.length-2],h=k[k.length-1];default:e=k[k.length-2],f=k[k.length-1]}}d.toString=a._path2string,c.abs=bJ(d);return d},bM=function(a,b,c,d){return[a,b,c,d,c,d]},bN=function(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]},bO=function(a,b,c,d,e,f,g,h,i,j){var k=B*120/180,l=B/180*(+e||0),m=[],o,p=bv(function(a,b,c){var d=a*w.cos(c)-b*w.sin(c),e=a*w.sin(c)+b*w.cos(c);return{x:d,y:e}});if(!j){o=p(a,b,-l),a=o.x,b=o.y,o=p(h,i,-l),h=o.x,i=o.y;var q=w.cos(B/180*e),r=w.sin(B/180*e),t=(a-h)/2,u=(b-i)/2,v=t*t/(c*c)+u*u/(d*d);v>1&&(v=w.sqrt(v),c=v*c,d=v*d);var x=c*c,y=d*d,A=(f==g?-1:1)*w.sqrt(z((x*y-x*u*u-y*t*t)/(x*u*u+y*t*t))),C=A*c*u/d+(a+h)/2,D=A*-d*t/c+(b+i)/2,E=w.asin(((b-D)/d).toFixed(9)),F=w.asin(((i-D)/d).toFixed(9));E=a<C?B-E:E,F=h<C?B-F:F,E<0&&(E=B*2+E),F<0&&(F=B*2+F),g&&E>F&&(E=E-B*2),!g&&F>E&&(F=F-B*2)}else E=j[0],F=j[1],C=j[2],D=j[3];var G=F-E;if(z(G)>k){var H=F,I=h,J=i;F=E+k*(g&&F>E?1:-1),h=C+c*w.cos(F),i=D+d*w.sin(F),m=bO(h,i,c,d,e,0,g,I,J,[F,H,C,D])}G=F-E;var K=w.cos(E),L=w.sin(E),M=w.cos(F),N=w.sin(F),O=w.tan(G/4),P=4/3*c*O,Q=4/3*d*O,R=[a,b],S=[a+P*L,b-Q*K],T=[h+P*N,i-Q*M],U=[h,i];S[0]=2*R[0]-S[0],S[1]=2*R[1]-S[1];if(j)return[S,T,U][n](m);m=[S,T,U][n](m).join()[s](",");var V=[];for(var W=0,X=m.length;W<X;W++)V[W]=W%2?p(m[W-1],m[W],l).y:p(m[W],m[W+1],l).x;return V},bP=function(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:A(j,3)*a+A(j,2)*3*i*c+j*3*i*i*e+A(i,3)*g,y:A(j,3)*b+A(j,2)*3*i*d+j*3*i*i*f+A(i,3)*h}},bQ=bv(function(a,b,c,d,e,f,g,h){var i=e-2*c+a-(g-2*e+c),j=2*(c-a)-2*(e-c),k=a-c,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,o=[b,h],p=[a,g],q;z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y)),i=f-2*d+b-(h-2*f+d),j=2*(d-b)-2*(f-d),k=b-d,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y));return{min:{x:y[m](0,p),y:y[m](0,o)},max:{x:x[m](0,p),y:x[m](0,o)}}}),bR=a._path2curve=bv(function(a,b){var c=!b&&bz(a);if(!b&&c.curve)return bJ(c.curve);var d=bL(a),e=b&&bL(b),f={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},g={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},h=function(a,b){var c,d;if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];!(a[0]in{T:1,Q:1})&&(b.qx=b.qy=null);switch(a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"][n](bO[m](0,[b.x,b.y][n](a.slice(1))));break;case"S":c=b.x+(b.x-(b.bx||b.x)),d=b.y+(b.y-(b.by||b.y)),a=["C",c,d][n](a.slice(1));break;case"T":b.qx=b.x+(b.x-(b.qx||b.x)),b.qy=b.y+(b.y-(b.qy||b.y)),a=["C"][n](bN(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"][n](bN(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"][n](bM(b.x,b.y,a[1],a[2]));break;case"H":a=["C"][n](bM(b.x,b.y,a[1],b.y));break;case"V":a=["C"][n](bM(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"][n](bM(b.x,b.y,b.X,b.Y))}return a},i=function(a,b){if(a[b].length>7){a[b].shift();var c=a[b];while(c.length)a.splice(b++,0,["C"][n](c.splice(0,6)));a.splice(b,1),l=x(d.length,e&&e.length||0)}},j=function(a,b,c,f,g){a&&b&&a[g][0]=="M"&&b[g][0]!="M"&&(b.splice(g,0,["M",f.x,f.y]),c.bx=0,c.by=0,c.x=a[g][1],c.y=a[g][2],l=x(d.length,e&&e.length||0))};for(var k=0,l=x(d.length,e&&e.length||0);k<l;k++){d[k]=h(d[k],f),i(d,k),e&&(e[k]=h(e[k],g)),e&&i(e,k),j(d,e,f,g,k),j(e,d,g,f,k);var o=d[k],p=e&&e[k],q=o.length,r=e&&p.length;f.x=o[q-2],f.y=o[q-1],f.bx=Q(o[q-4])||f.x,f.by=Q(o[q-3])||f.y,g.bx=e&&(Q(p[r-4])||g.x),g.by=e&&(Q(p[r-3])||g.y),g.x=e&&p[r-2],g.y=e&&p[r-1]}e||(c.curve=bJ(d));return e?[d,e]:d},null,bJ),bS=a._parseDots=bv(function(b){var c=[];for(var d=0,e=b.length;d<e;d++){var f={},g=b[d].match(/^([^:]*):?([\d\.]*)/);f.color=a.getRGB(g[1]);if(f.color.error)return null;f.color=f.color.hex,g[2]&&(f.offset=g[2]+"%"),c.push(f)}for(d=1,e=c.length-1;d<e;d++)if(!c[d].offset){var h=Q(c[d-1].offset||0),i=0;for(var j=d+1;j<e;j++)if(c[j].offset){i=c[j].offset;break}i||(i=100,j=e),i=Q(i);var k=(i-h)/(j-d+1);for(;d<j;d++)h+=k,c[d].offset=h+"%"}return c}),bT=a._tear=function(a,b){a==b.top&&(b.top=a.prev),a==b.bottom&&(b.bottom=a.next),a.next&&(a.next.prev=a.prev),a.prev&&(a.prev.next=a.next)},bU=a._tofront=function(a,b){b.top!==a&&(bT(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)},bV=a._toback=function(a,b){b.bottom!==a&&(bT(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)},bW=a._insertafter=function(a,b,c){bT(a,c),b==c.top&&(c.top=a),b.next&&(b.next.prev=a),a.next=b.next,a.prev=b,b.next=a},bX=a._insertbefore=function(a,b,c){bT(a,c),b==c.bottom&&(c.bottom=a),b.prev&&(b.prev.next=a),a.prev=b.prev,b.prev=a,a.next=b},bY=a.toMatrix=function(a,b){var c=bI(a),d={_:{transform:p},getBBox:function(){return c}};b$(d,b);return d.matrix},bZ=a.transformPath=function(a,b){return bj(a,bY(a,b))},b$=a._extractTransform=function(b,c){if(c==null)return b._.transform;c=r(c).replace(/\.{3}|\u2026/g,b._.transform||p);var d=a.parseTransformString(c),e=0,f=0,g=0,h=1,i=1,j=b._,k=new cb;j.transform=d||[];if(d)for(var l=0,m=d.length;l<m;l++){var n=d[l],o=n.length,q=r(n[0]).toLowerCase(),s=n[0]!=q,t=s?k.invert():0,u,v,w,x,y;q=="t"&&o==3?s?(u=t.x(0,0),v=t.y(0,0),w=t.x(n[1],n[2]),x=t.y(n[1],n[2]),k.translate(w-u,x-v)):k.translate(n[1],n[2]):q=="r"?o==2?(y=y||b.getBBox(1),k.rotate(n[1],y.x+y.width/2,y.y+y.height/2),e+=n[1]):o==4&&(s?(w=t.x(n[2],n[3]),x=t.y(n[2],n[3]),k.rotate(n[1],w,x)):k.rotate(n[1],n[2],n[3]),e+=n[1]):q=="s"?o==2||o==3?(y=y||b.getBBox(1),k.scale(n[1],n[o-1],y.x+y.width/2,y.y+y.height/2),h*=n[1],i*=n[o-1]):o==5&&(s?(w=t.x(n[3],n[4]),x=t.y(n[3],n[4]),k.scale(n[1],n[2],w,x)):k.scale(n[1],n[2],n[3],n[4]),h*=n[1],i*=n[2]):q=="m"&&o==7&&k.add(n[1],n[2],n[3],n[4],n[5],n[6]),j.dirtyT=1,b.matrix=k}b.matrix=k,j.sx=h,j.sy=i,j.deg=e,j.dx=f=k.e,j.dy=g=k.f,h==1&&i==1&&!e&&j.bbox?(j.bbox.x+=+f,j.bbox.y+=+g):j.dirtyT=1},b_=function(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return a.length==4?[b,0,a[2],a[3]]:[b,0];case"s":return a.length==5?[b,1,1,a[3],a[4]]:a.length==3?[b,1,1]:[b,1]}},ca=a._equaliseTransform=function(b,c){c=r(c).replace(/\.{3}|\u2026/g,b),b=a.parseTransformString(b)||[],c=a.parseTransformString(c)||[];var d=x(b.length,c.length),e=[],f=[],g=0,h,i,j,k;for(;g<d;g++){j=b[g]||b_(c[g]),k=c[g]||b_(j);if(j[0]!=k[0]||j[0].toLowerCase()=="r"&&(j[2]!=k[2]||j[3]!=k[3])||j[0].toLowerCase()=="s"&&(j[3]!=k[3]||j[4]!=k[4]))return;e[g]=[],f[g]=[];for(h=0,i=x(j.length,k.length);h<i;h++)h in j&&(e[g][h]=j[h]),h in k&&(f[g][h]=k[h])}return{from:e,to:f}};a._getContainer=function(b,c,d,e){var f;f=e==null&&!a.is(b,"object")?h.doc.getElementById(b):b;if(f!=null){if(f.tagName)return c==null?{container:f,width:f.style.pixelWidth||f.offsetWidth,height:f.style.pixelHeight||f.offsetHeight}:{container:f,width:c,height:d};return{container:1,x:b,y:c,width:d,height:e}}},a.pathToRelative=bK,a._engine={},a.path2curve=bR,a.matrix=function(a,b,c,d,e,f){return new cb(a,b,c,d,e,f)},function(b){function d(a){var b=w.sqrt(c(a));a[0]&&(a[0]/=b),a[1]&&(a[1]/=b)}function c(a){return a[0]*a[0]+a[1]*a[1]}b.add=function(a,b,c,d,e,f){var g=[[],[],[]],h=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],i=[[a,c,e],[b,d,f],[0,0,1]],j,k,l,m;a&&a instanceof cb&&(i=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]);for(j=0;j<3;j++)for(k=0;k<3;k++){m=0;for(l=0;l<3;l++)m+=h[j][l]*i[l][k];g[j][k]=m}this.a=g[0][0],this.b=g[1][0],this.c=g[0][1],this.d=g[1][1],this.e=g[0][2],this.f=g[1][2]},b.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new cb(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},b.clone=function(){return new cb(this.a,this.b,this.c,this.d,this.e,this.f)},b.translate=function(a,b){this.add(1,0,0,1,a,b)},b.scale=function(a,b,c,d){b==null&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d)},b.rotate=function(b,c,d){b=a.rad(b),c=c||0,d=d||0;var e=+w.cos(b).toFixed(9),f=+w.sin(b).toFixed(9);this.add(e,f,-f,e,c,d),this.add(1,0,0,1,-c,-d)},b.x=function(a,b){return a*this.a+b*this.c+this.e},b.y=function(a,b){return a*this.b+b*this.d+this.f},b.get=function(a){return+this[r.fromCharCode(97+a)].toFixed(4)},b.toString=function(){return a.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},b.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},b.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},b.split=function(){var b={};b.dx=this.e,b.dy=this.f;var e=[[this.a,this.c],[this.b,this.d]];b.scalex=w.sqrt(c(e[0])),d(e[0]),b.shear=e[0][0]*e[1][0]+e[0][1]*e[1][1],e[1]=[e[1][0]-e[0][0]*b.shear,e[1][1]-e[0][1]*b.shear],b.scaley=w.sqrt(c(e[1])),d(e[1]),b.shear/=b.scaley;var f=-e[0][1],g=e[1][1];g<0?(b.rotate=a.deg(w.acos(g)),f<0&&(b.rotate=360-b.rotate)):b.rotate=a.deg(w.asin(f)),b.isSimple=!+b.shear.toFixed(9)&&(b.scalex.toFixed(9)==b.scaley.toFixed(9)||!b.rotate),b.isSuperSimple=!+b.shear.toFixed(9)&&b.scalex.toFixed(9)==b.scaley.toFixed(9)&&!b.rotate,b.noRotation=!+b.shear.toFixed(9)&&!b.rotate;return b},b.toTransformString=function(a){var b=a||this[s]();if(b.isSimple){b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4);return(b.dx||b.dy?"t"+[b.dx,b.dy]:p)+(b.scalex!=1||b.scaley!=1?"s"+[b.scalex,b.scaley,0,0]:p)+(b.rotate?"r"+[b.rotate,0,0]:p)}return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(cb.prototype);var cc=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);navigator.vendor=="Apple Computer, Inc."&&(cc&&cc[1]<4||navigator.platform.slice(0,2)=="iP")||navigator.vendor=="Google Inc."&&cc&&cc[1]<8?k.safari=function(){var a=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){a.remove()})}:k.safari=be;var cd=function(){this.returnValue=!1},ce=function(){return this.originalEvent.preventDefault()},cf=function(){this.cancelBubble=!0},cg=function(){return this.originalEvent.stopPropagation()},ch=function(){if(h.doc.addEventListener)return function(a,b,c,d){var e=o&&u[b]?u[b]:b,f=function(e){var f=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,i=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,j=e.clientX+i,k=e.clientY+f;if(o&&u[g](b))for(var l=0,m=e.targetTouches&&e.targetTouches.length;l<m;l++)if(e.targetTouches[l].target==a){var n=e;e=e.targetTouches[l],e.originalEvent=n,e.preventDefault=ce,e.stopPropagation=cg;break}return c.call(d,e,j,k)};a.addEventListener(e,f,!1);return function(){a.removeEventListener(e,f,!1);return!0}};if(h.doc.attachEvent)return function(a,b,c,d){var e=function(a){a=a||h.win.event;var b=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f=a.clientX+e,g=a.clientY+b;a.preventDefault=a.preventDefault||cd,a.stopPropagation=a.stopPropagation||cf;return c.call(d,a,f,g)};a.attachEvent("on"+b,e);var f=function(){a.detachEvent("on"+b,e);return!0};return f}}(),ci=[],cj=function(a){var b=a.clientX,c=a.clientY,d=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f,g=ci.length;while(g--){f=ci[g];if(o){var i=a.touches.length,j;while(i--){j=a.touches[i];if(j.identifier==f.el._drag.id){b=j.clientX,c=j.clientY,(a.originalEvent?a.originalEvent:a).preventDefault();break}}}else a.preventDefault();var k=f.el.node,l,m=k.nextSibling,n=k.parentNode,p=k.style.display;h.win.opera&&n.removeChild(k),k.style.display="none",l=f.el.paper.getElementByPoint(b,c),k.style.display=p,h.win.opera&&(m?n.insertBefore(k,m):n.appendChild(k)),l&&eve("raphael.drag.over."+f.el.id,f.el,l),b+=e,c+=d,eve("raphael.drag.move."+f.el.id,f.move_scope||f.el,b-f.el._drag.x,c-f.el._drag.y,b,c,a)}},ck=function(b){a.unmousemove(cj).unmouseup(ck);var c=ci.length,d;while(c--)d=ci[c],d.el._drag={},eve("raphael.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,b);ci=[]},cl=a.el={};for(var cm=t.length;cm--;)(function(b){a[b]=cl[b]=function(c,d){a.is(c,"function")&&(this.events=this.events||[],this.events.push({name:b,f:c,unbind:ch(this.shape||this.node||h.doc,b,c,d||this)}));return this},a["un"+b]=cl["un"+b]=function(a){var c=this.events||[],d=c.length;while(d--)if(c[d].name==b&&c[d].f==a){c[d].unbind(),c.splice(d,1),!c.length&&delete this.events;return this}return this}})(t[cm]);cl.data=function(b,c){var d=bb[this.id]=bb[this.id]||{};if(arguments.length==1){if(a.is(b,"object")){for(var e in b)b[g](e)&&this.data(e,b[e]);return this}eve("raphael.data.get."+this.id,this,d[b],b);return d[b]}d[b]=c,eve("raphael.data.set."+this.id,this,c,b);return this},cl.removeData=function(a){a==null?bb[this.id]={}:bb[this.id]&&delete bb[this.id][a];return this},cl.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},cl.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var cn=[];cl.drag=function(b,c,d,e,f,g){function i(i){(i.originalEvent||i).preventDefault();var j=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,k=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft;this._drag.x=i.clientX+k,this._drag.y=i.clientY+j,this._drag.id=i.identifier,!ci.length&&a.mousemove(cj).mouseup(ck),ci.push({el:this,move_scope:e,start_scope:f,end_scope:g}),c&&eve.on("raphael.drag.start."+this.id,c),b&&eve.on("raphael.drag.move."+this.id,b),d&&eve.on("raphael.drag.end."+this.id,d),eve("raphael.drag.start."+this.id,f||e||this,i.clientX+k,i.clientY+j,i)}this._drag={},cn.push({el:this,start:i}),this.mousedown(i);return this},cl.onDragOver=function(a){a?eve.on("raphael.drag.over."+this.id,a):eve.unbind("raphael.drag.over."+this.id)},cl.undrag=function(){var b=cn.length;while(b--)cn[b].el==this&&(this.unmousedown(cn[b].start),cn.splice(b,1),eve.unbind("raphael.drag.*."+this.id));!cn.length&&a.unmousemove(cj).unmouseup(ck)},k.circle=function(b,c,d){var e=a._engine.circle(this,b||0,c||0,d||0);this.__set__&&this.__set__.push(e);return e},k.rect=function(b,c,d,e,f){var g=a._engine.rect(this,b||0,c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.ellipse=function(b,c,d,e){var f=a._engine.ellipse(this,b||0,c||0,d||0,e||0);this.__set__&&this.__set__.push(f);return f},k.path=function(b){b&&!a.is(b,D)&&!a.is(b[0],E)&&(b+=p);var c=a._engine.path(a.format[m](a,arguments),this);this.__set__&&this.__set__.push(c);return c},k.image=function(b,c,d,e,f){var g=a._engine.image(this,b||"about:blank",c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.text=function(b,c,d){var e=a._engine.text(this,b||0,c||0,r(d));this.__set__&&this.__set__.push(e);return e},k.set=function(b){!a.is(b,"array")&&(b=Array.prototype.splice.call(arguments,0,arguments.length));var c=new cG(b);this.__set__&&this.__set__.push(c);return c},k.setStart=function(a){this.__set__=a||this.set()},k.setFinish=function(a){var b=this.__set__;delete this.__set__;return b},k.setSize=function(b,c){return a._engine.setSize.call(this,b,c)},k.setViewBox=function(b,c,d,e,f){return a._engine.setViewBox.call(this,b,c,d,e,f)},k.top=k.bottom=null,k.raphael=a;var co=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,i=b.top+(h.win.pageYOffset||e.scrollTop||d.scrollTop)-f,j=b.left+(h.win.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{y:i,x:j}};k.getElementByPoint=function(a,b){var c=this,d=c.canvas,e=h.doc.elementFromPoint(a,b);if(h.win.opera&&e.tagName=="svg"){var f=co(d),g=d.createSVGRect();g.x=a-f.x,g.y=b-f.y,g.width=g.height=1;var i=d.getIntersectionList(g,null);i.length&&(e=i[i.length-1])}if(!e)return null;while(e.parentNode&&e!=d.parentNode&&!e.raphael)e=e.parentNode;e==c.canvas.parentNode&&(e=d),e=e&&e.raphael?c.getById(e.raphaelid):null;return e},k.getById=function(a){var b=this.bottom;while(b){if(b.id==a)return b;b=b.next}return null},k.forEach=function(a,b){var c=this.bottom;while(c){if(a.call(b,c)===!1)return this;c=c.next}return this},k.getElementsByPoint=function(a,b){var c=this.set();this.forEach(function(d){d.isPointInside(a,b)&&c.push(d)});return c},cl.isPointInside=function(b,c){var d=this.realPath=this.realPath||bi[this.type](this);return a.isPointInsidePath(d,b,c)},cl.getBBox=function(a){if(this.removed)return{};var b=this._;if(a){if(b.dirty||!b.bboxwt)this.realPath=bi[this.type](this),b.bboxwt=bI(this.realPath),b.bboxwt.toString=cq,b.dirty=0;return b.bboxwt}if(b.dirty||b.dirtyT||!b.bbox){if(b.dirty||!this.realPath)b.bboxwt=0,this.realPath=bi[this.type](this);b.bbox=bI(bj(this.realPath,this.matrix)),b.bbox.toString=cq,b.dirty=b.dirtyT=0}return b.bbox},cl.clone=function(){if(this.removed)return null;var a=this.paper[this.type]().attr(this.attr());this.__set__&&this.__set__.push(a);return a},cl.glow=function(a){if(this.type=="text")return null;a=a||{};var b={width:(a.width||10)+(+this.attr("stroke-width")||1),fill:a.fill||!1,opacity:a.opacity||.5,offsetx:a.offsetx||0,offsety:a.offsety||0,color:a.color||"#000"},c=b.width/2,d=this.paper,e=d.set(),f=this.realPath||bi[this.type](this);f=this.matrix?bj(f,this.matrix):f;for(var g=1;g<c+1;g++)e.push(d.path(f).attr({stroke:b.color,fill:b.fill?b.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(b.width/c*g).toFixed(3),opacity:+(b.opacity/c).toFixed(3)}));return e.insertBefore(this).translate(b.offsetx,b.offsety)};var cr={},cs=function(b,c,d,e,f,g,h,i,j){return j==null?bB(b,c,d,e,f,g,h,i):a.findDotsAtSegment(b,c,d,e,f,g,h,i,bC(b,c,d,e,f,g,h,i,j))},ct=function(b,c){return function(d,e,f){d=bR(d);var g,h,i,j,k="",l={},m,n=0;for(var o=0,p=d.length;o<p;o++){i=d[o];if(i[0]=="M")g=+i[1],h=+i[2];else{j=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6]);if(n+j>e){if(c&&!l.start){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),k+=["C"+m.start.x,m.start.y,m.m.x,m.m.y,m.x,m.y];if(f)return k;l.start=k,k=["M"+m.x,m.y+"C"+m.n.x,m.n.y,m.end.x,m.end.y,i[5],i[6]].join(),n+=j,g=+i[5],h=+i[6];continue}if(!b&&!c){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n);return{x:m.x,y:m.y,alpha:m.alpha}}}n+=j,g=+i[5],h=+i[6]}k+=i.shift()+i}l.end=k,m=b?n:c?l:a.findDotsAtSegment(g,h,i[0],i[1],i[2],i[3],i[4],i[5],1),m.alpha&&(m={x:m.x,y:m.y,alpha:m.alpha});return m}},cu=ct(1),cv=ct(),cw=ct(0,1);a.getTotalLength=cu,a.getPointAtLength=cv,a.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return cw(a,b).end;var d=cw(a,c,1);return b?cw(d,b).end:d},cl.getTotalLength=function(){if(this.type=="path"){if(this.node.getTotalLength)return this.node.getTotalLength();return cu(this.attrs.path)}},cl.getPointAtLength=function(a){if(this.type=="path")return cv(this.attrs.path,a)},cl.getSubpath=function(b,c){if(this.type=="path")return a.getSubpath(this.attrs.path,b,c)};var cx=a.easing_formulas={linear:function(a){return a},"<":function(a){return A(a,1.7)},">":function(a){return A(a,.48)},"<>":function(a){var b=.48-a/1.04,c=w.sqrt(.1734+b*b),d=c-b,e=A(z(d),1/3)*(d<0?-1:1),f=-c-b,g=A(z(f),1/3)*(f<0?-1:1),h=e+g+.5;return(1-h)*3*h*h+h*h*h},backIn:function(a){var b=1.70158;return a*a*((b+1)*a-b)},backOut:function(a){a=a-1;var b=1.70158;return a*a*((b+1)*a+b)+1},elastic:function(a){if(a==!!a)return a;return A(2,-10*a)*w.sin((a-.075)*2*B/.3)+1},bounce:function(a){var b=7.5625,c=2.75,d;a<1/c?d=b*a*a:a<2/c?(a-=1.5/c,d=b*a*a+.75):a<2.5/c?(a-=2.25/c,d=b*a*a+.9375):(a-=2.625/c,d=b*a*a+.984375);return d}};cx.easeIn=cx["ease-in"]=cx["<"],cx.easeOut=cx["ease-out"]=cx[">"],cx.easeInOut=cx["ease-in-out"]=cx["<>"],cx["back-in"]=cx.backIn,cx["back-out"]=cx.backOut;var cy=[],cz=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){setTimeout(a,16)},cA=function(){var b=+(new Date),c=0;for(;c<cy.length;c++){var d=cy[c];if(d.el.removed||d.paused)continue;var e=b-d.start,f=d.ms,h=d.easing,i=d.from,j=d.diff,k=d.to,l=d.t,m=d.el,o={},p,r={},s;d.initstatus?(e=(d.initstatus*d.anim.top-d.prev)/(d.percent-d.prev)*f,d.status=d.initstatus,delete d.initstatus,d.stop&&cy.splice(c--,1)):d.status=(d.prev+(d.percent-d.prev)*(e/f))/d.anim.top;if(e<0)continue;if(e<f){var t=h(e/f);for(var u in i)if(i[g](u)){switch(U[u]){case C:p=+i[u]+t*f*j[u];break;case"colour":p="rgb("+[cB(O(i[u].r+t*f*j[u].r)),cB(O(i[u].g+t*f*j[u].g)),cB(O(i[u].b+t*f*j[u].b))].join(",")+")";break;case"path":p=[];for(var v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(var x=1,y=i[u][v].length;x<y;x++)p[v][x]=+i[u][v][x]+t*f*j[u][v][x];p[v]=p[v].join(q)}p=p.join(q);break;case"transform":if(j[u].real){p=[];for(v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(x=1,y=i[u][v].length;x<y;x++)p[v][x]=i[u][v][x]+t*f*j[u][v][x]}}else{var z=function(a){return+i[u][a]+t*f*j[u][a]};p=[["m",z(0),z(1),z(2),z(3),z(4),z(5)]]}break;case"csv":if(u=="clip-rect"){p=[],v=4;while(v--)p[v]=+i[u][v]+t*f*j[u][v]}break;default:var A=[][n](i[u]);p=[],v=m.paper.customAttributes[u].length;while(v--)p[v]=+A[v]+t*f*j[u][v]}o[u]=p}m.attr(o),function(a,b,c){setTimeout(function(){eve("raphael.anim.frame."+a,b,c)})}(m.id,m,d.anim)}else{(function(b,c,d){setTimeout(function(){eve("raphael.anim.frame."+c.id,c,d),eve("raphael.anim.finish."+c.id,c,d),a.is(b,"function")&&b.call(c)})})(d.callback,m,d.anim),m.attr(k),cy.splice(c--,1);if(d.repeat>1&&!d.next){for(s in k)k[g](s)&&(r[s]=d.totalOrigin[s]);d.el.attr(r),cE(d.anim,d.el,d.anim.percents[0],null,d.totalOrigin,d.repeat-1)}d.next&&!d.stop&&cE(d.anim,d.el,d.next,null,d.totalOrigin,d.repeat)}}a.svg&&m&&m.paper&&m.paper.safari(),cy.length&&cz(cA)},cB=function(a){return a>255?255:a<0?0:a};cl.animateWith=function(b,c,d,e,f,g){var h=this;if(h.removed){g&&g.call(h);return h}var i=d instanceof cD?d:a.animation(d,e,f,g),j,k;cE(i,h,i.percents[0],null,h.attr());for(var l=0,m=cy.length;l<m;l++)if(cy[l].anim==c&&cy[l].el==b){cy[m-1].start=cy[l].start;break}return h},cl.onAnimation=function(a){a?eve.on("raphael.anim.frame."+this.id,a):eve.unbind("raphael.anim.frame."+this.id);return this},cD.prototype.delay=function(a){var b=new cD(this.anim,this.ms);b.times=this.times,b.del=+a||0;return b},cD.prototype.repeat=function(a){var b=new cD(this.anim,this.ms);b.del=this.del,b.times=w.floor(x(a,0))||1;return b},a.animation=function(b,c,d,e){if(b instanceof cD)return b;if(a.is(d,"function")||!d)e=e||d||null,d=null;b=Object(b),c=+c||0;var f={},h,i;for(i in b)b[g](i)&&Q(i)!=i&&Q(i)+"%"!=i&&(h=!0,f[i]=b[i]);if(!h)return new cD(b,c);d&&(f.easing=d),e&&(f.callback=e);return new cD({100:f},c)},cl.animate=function(b,c,d,e){var f=this;if(f.removed){e&&e.call(f);return f}var g=b instanceof cD?b:a.animation(b,c,d,e);cE(g,f,g.percents[0],null,f.attr());return f},cl.setTime=function(a,b){a&&b!=null&&this.status(a,y(b,a.ms)/a.ms);return this},cl.status=function(a,b){var c=[],d=0,e,f;if(b!=null){cE(a,this,-1,y(b,1));return this}e=cy.length;for(;d<e;d++){f=cy[d];if(f.el.id==this.id&&(!a||f.anim==a)){if(a)return f.status;c.push({anim:f.anim,status:f.status})}}if(a)return 0;return c},cl.pause=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.pause."+this.id,this,cy[b].anim)!==!1&&(cy[b].paused=!0);return this},cl.resume=function(a){for(var b=0;b<cy.length;b++)if(cy[b].el.id==this.id&&(!a||cy[b].anim==a)){var c=cy[b];eve("raphael.anim.resume."+this.id,this,c.anim)!==!1&&(delete c.paused,this.status(c.anim,c.status))}return this},cl.stop=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.stop."+this.id,this,cy[b].anim)!==!1&&cy.splice(b--,1);return this},eve.on("raphael.remove",cF),eve.on("raphael.clear",cF),cl.toString=function(){return"Raphaël’s object"};var cG=function(a){this.items=[],this.length=0,this.type="set";if(a)for(var b=0,c=a.length;b<c;b++)a[b]&&(a[b].constructor==cl.constructor||a[b].constructor==cG)&&(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},cH=cG.prototype;cH.push=function(){var a,b;for(var c=0,d=arguments.length;c<d;c++)a=arguments[c],a&&(a.constructor==cl.constructor||a.constructor==cG)&&(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},cH.pop=function(){this.length&&delete this[this.length--];return this.items.pop()},cH.forEach=function(a,b){for(var c=0,d=this.items.length;c<d;c++)if(a.call(b,this.items[c],c)===!1)return this;return this};for(var cI in cl)cl[g](cI)&&(cH[cI]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a][m](c,b)})}}(cI));cH.attr=function(b,c){if(b&&a.is(b,E)&&a.is(b[0],"object"))for(var d=0,e=b.length;d<e;d++)this.items[d].attr(b[d]);else for(var f=0,g=this.items.length;f<g;f++)this.items[f].attr(b,c);return this},cH.clear=function(){while(this.length)this.pop()},cH.splice=function(a,b,c){a=a<0?x(this.length+a,0):a,b=x(0,y(this.length-a,b));var d=[],e=[],f=[],g;for(g=2;g<arguments.length;g++)f.push(arguments[g]);for(g=0;g<b;g++)e.push(this[a+g]);for(;g<this.length-a;g++)d.push(this[a+g]);var h=f.length;for(g=0;g<h+d.length;g++)this.items[a+g]=this[a+g]=g<h?f[g]:d[g-h];g=this.items.length=this.length-=b-h;while(this[g])delete this[g++];return new cG(e)},cH.exclude=function(a){for(var b=0,c=this.length;b<c;b++)if(this[b]==a){this.splice(b,1);return!0}},cH.animate=function(b,c,d,e){(a.is(d,"function")||!d)&&(e=d||null);var f=this.items.length,g=f,h,i=this,j;if(!f)return this;e&&(j=function(){!--f&&e.call(i)}),d=a.is(d,D)?d:j;var k=a.animation(b,c,d,j);h=this.items[--g].animate(k);while(g--)this.items[g]&&!this.items[g].removed&&this.items[g].animateWith(h,k,k);return this},cH.insertAfter=function(a){var b=this.items.length;while(b--)this.items[b].insertAfter(a);return this},cH.getBBox=function(){var a=[],b=[],c=[],d=[];for(var e=this.items.length;e--;)if(!this.items[e].removed){var f=this.items[e].getBBox();a.push(f.x),b.push(f.y),c.push(f.x+f.width),d.push(f.y+f.height)}a=y[m](0,a),b=y[m](0,b),c=x[m](0,c),d=x[m](0,d);return{x:a,y:b,x2:c,y2:d,width:c-a,height:d-b}},cH.clone=function(a){a=new cG;for(var b=0,c=this.items.length;b<c;b++)a.push(this.items[b].clone());return a},cH.toString=function(){return"Raphaël‘s set"},a.registerFont=function(a){if(!a.face)return a;this.fonts=this.fonts||{};var b={w:a.w,face:{},glyphs:{}},c=a.face["font-family"];for(var d in a.face)a.face[g](d)&&(b.face[d]=a.face[d]);this.fonts[c]?this.fonts[c].push(b):this.fonts[c]=[b];if(!a.svg){b.face["units-per-em"]=R(a.face["units-per-em"],10);for(var e in a.glyphs)if(a.glyphs[g](e)){var f=a.glyphs[e];b.glyphs[e]={w:f.w,k:{},d:f.d&&"M"+f.d.replace(/[mlcxtrv]/g,function(a){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a]||"M"})+"z"};if(f.k)for(var h in f.k)f[g](h)&&(b.glyphs[e].k[h]=f.k[h])}}return a},k.getFont=function(b,c,d,e){e=e||"normal",d=d||"normal",c=+c||{normal:400,bold:700,lighter:300,bolder:800}[c]||400;if(!!a.fonts){var f=a.fonts[b];if(!f){var h=new RegExp("(^|\\s)"+b.replace(/[^\w\d\s+!~.:_-]/g,p)+"(\\s|$)","i");for(var i in a.fonts)if(a.fonts[g](i)&&h.test(i)){f=a.fonts[i];break}}var j;if(f)for(var k=0,l=f.length;k<l;k++){j=f[k];if(j.face["font-weight"]==c&&(j.face["font-style"]==d||!j.face["font-style"])&&j.face["font-stretch"]==e)break}return j}},k.print=function(b,d,e,f,g,h,i){h=h||"middle",i=x(y(i||0,1),-1);var j=r(e)[s](p),k=0,l=0,m=p,n;a.is(f,e)&&(f=this.getFont(f));if(f){n=(g||16)/f.face["units-per-em"];var o=f.face.bbox[s](c),q=+o[0],t=o[3]-o[1],u=0,v=+o[1]+(h=="baseline"?t+ +f.face.descent:t/2);for(var w=0,z=j.length;w<z;w++){if(j[w]=="\n")k=0,B=0,l=0,u+=t;else{var A=l&&f.glyphs[j[w-1]]||{},B=f.glyphs[j[w]];k+=l?(A.w||f.w)+(A.k&&A.k[j[w]]||0)+f.w*i:0,l=1}B&&B.d&&(m+=a.transformPath(B.d,["t",k*n,u*n,"s",n,n,q,v,"t",(b-q)/n,(d-v)/n]))}}return this.path(m).attr({fill:"#000",stroke:"none"})},k.add=function(b){if(a.is(b,"array")){var c=this.set(),e=0,f=b.length,h;for(;e<f;e++)h=b[e]||{},d[g](h.type)&&c.push(this[h.type]().attr(h))}return c},a.format=function(b,c){var d=a.is(c,E)?[0][n](c):arguments;b&&a.is(b,D)&&d.length-1&&(b=b.replace(e,function(a,b){return d[++b]==null?p:d[b]}));return b||p},a.fullfill=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),typeof e=="function"&&f&&(e=e()))}),e=(e==null||e==d?a:e)+"";return e};return function(b,d){return String(b).replace(a,function(a,b){return c(a,b,d)})}}(),a.ninja=function(){i.was?h.win.Raphael=i.is:delete Raphael;return a},a.st=cH,function(b,c,d){function e(){/in/.test(b.readyState)?setTimeout(e,9):a.eve("raphael.DOMload")}b.readyState==null&&b.addEventListener&&(b.addEventListener(c,d=function(){b.removeEventListener(c,d,!1),b.readyState="complete"},!1),b.readyState="loading"),e()}(document,"DOMContentLoaded"),i.was?h.win.Raphael=a:Raphael=a,eve.on("raphael.DOMload",function(){b=!0})}(),window.Raphael.svg&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=parseInt,f=Math,g=f.max,h=f.abs,i=f.pow,j=/[, ]+/,k=a.eve,l="",m=" ",n="http://www.w3.org/1999/xlink",o={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},p={};a.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var q=function(d,e){if(e){typeof d=="string"&&(d=q(d));for(var f in e)e[b](f)&&(f.substring(0,6)=="xlink:"?d.setAttributeNS(n,f.substring(6),c(e[f])):d.setAttribute(f,c(e[f])))}else d=a._g.doc.createElementNS("http://www.w3.org/2000/svg",d),d.style&&(d.style.webkitTapHighlightColor="rgba(0,0,0,0)");return d},r=function(b,e){var j="linear",k=b.id+e,m=.5,n=.5,o=b.node,p=b.paper,r=o.style,s=a._g.doc.getElementById(k);if(!s){e=c(e).replace(a._radial_gradient,function(a,b,c){j="radial";if(b&&c){m=d(b),n=d(c);var e=(n>.5)*2-1;i(m-.5,2)+i(n-.5,2)>.25&&(n=f.sqrt(.25-i(m-.5,2))*e+.5)&&n!=.5&&(n=n.toFixed(5)-1e-5*e)}return l}),e=e.split(/\s*\-\s*/);if(j=="linear"){var t=e.shift();t=-d(t);if(isNaN(t))return null;var u=[0,0,f.cos(a.rad(t)),f.sin(a.rad(t))],v=1/(g(h(u[2]),h(u[3]))||1);u[2]*=v,u[3]*=v,u[2]<0&&(u[0]=-u[2],u[2]=0),u[3]<0&&(u[1]=-u[3],u[3]=0)}var w=a._parseDots(e);if(!w)return null;k=k.replace(/[\(\)\s,\xb0#]/g,"_"),b.gradient&&k!=b.gradient.id&&(p.defs.removeChild(b.gradient),delete b.gradient);if(!b.gradient){s=q(j+"Gradient",{id:k}),b.gradient=s,q(s,j=="radial"?{fx:m,fy:n}:{x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientTransform:b.matrix.invert()}),p.defs.appendChild(s);for(var x=0,y=w.length;x<y;x++)s.appendChild(q("stop",{offset:w[x].offset?w[x].offset:x?"100%":"0%","stop-color":w[x].color||"#fff"}))}}q(o,{fill:"url(#"+k+")",opacity:1,"fill-opacity":1}),r.fill=l,r.opacity=1,r.fillOpacity=1;return 1},s=function(a){var b=a.getBBox(1);q(a.pattern,{patternTransform:a.matrix.invert()+" translate("+b.x+","+b.y+")"})},t=function(d,e,f){if(d.type=="path"){var g=c(e).toLowerCase().split("-"),h=d.paper,i=f?"end":"start",j=d.node,k=d.attrs,m=k["stroke-width"],n=g.length,r="classic",s,t,u,v,w,x=3,y=3,z=5;while(n--)switch(g[n]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":r=g[n];break;case"wide":y=5;break;case"narrow":y=2;break;case"long":x=5;break;case"short":x=2}r=="open"?(x+=2,y+=2,z+=2,u=1,v=f?4:1,w={fill:"none",stroke:k.stroke}):(v=u=x/2,w={fill:k.stroke,stroke:"none"}),d._.arrows?f?(d._.arrows.endPath&&p[d._.arrows.endPath]--,d._.arrows.endMarker&&p[d._.arrows.endMarker]--):(d._.arrows.startPath&&p[d._.arrows.startPath]--,d._.arrows.startMarker&&p[d._.arrows.startMarker]--):d._.arrows={};if(r!="none"){var A="raphael-marker-"+r,B="raphael-marker-"+i+r+x+y;a._g.doc.getElementById(A)?p[A]++:(h.defs.appendChild(q(q("path"),{"stroke-linecap":"round",d:o[r],id:A})),p[A]=1);var C=a._g.doc.getElementById(B),D;C?(p[B]++,D=C.getElementsByTagName("use")[0]):(C=q(q("marker"),{id:B,markerHeight:y,markerWidth:x,orient:"auto",refX:v,refY:y/2}),D=q(q("use"),{"xlink:href":"#"+A,transform:(f?"rotate(180 "+x/2+" "+y/2+") ":l)+"scale("+x/z+","+y/z+")","stroke-width":(1/((x/z+y/z)/2)).toFixed(4)}),C.appendChild(D),h.defs.appendChild(C),p[B]=1),q(D,w);var F=u*(r!="diamond"&&r!="oval");f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-F*m):(s=F*m,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),w={},w["marker-"+i]="url(#"+B+")";if(t||s)w.d=Raphael.getSubpath(k.path,s,t);q(j,w),d._.arrows[i+"Path"]=A,d._.arrows[i+"Marker"]=B,d._.arrows[i+"dx"]=F,d._.arrows[i+"Type"]=r,d._.arrows[i+"String"]=e}else f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-s):(s=0,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),d._.arrows[i+"Path"]&&q(j,{d:Raphael.getSubpath(k.path,s,t)}),delete d._.arrows[i+"Path"],delete d._.arrows[i+"Marker"],delete d._.arrows[i+"dx"],delete d._.arrows[i+"Type"],delete d._.arrows[i+"String"];for(w in p)if(p[b](w)&&!p[w]){var G=a._g.doc.getElementById(w);G&&G.parentNode.removeChild(G)}}},u={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},v=function(a,b,d){b=u[c(b).toLowerCase()];if(b){var e=a.attrs["stroke-width"]||"1",f={round:e,square:e,butt:0}[a.attrs["stroke-linecap"]||d["stroke-linecap"]]||0,g=[],h=b.length;while(h--)g[h]=b[h]*e+(h%2?1:-1)*f;q(a.node,{"stroke-dasharray":g.join(",")})}},w=function(d,f){var i=d.node,k=d.attrs,m=i.style.visibility;i.style.visibility="hidden";for(var o in f)if(f[b](o)){if(!a._availableAttrs[b](o))continue;var p=f[o];k[o]=p;switch(o){case"blur":d.blur(p);break;case"href":case"title":case"target":var u=i.parentNode;if(u.tagName.toLowerCase()!="a"){var w=q("a");u.insertBefore(w,i),w.appendChild(i),u=w}o=="target"?u.setAttributeNS(n,"show",p=="blank"?"new":p):u.setAttributeNS(n,o,p);break;case"cursor":i.style.cursor=p;break;case"transform":d.transform(p);break;case"arrow-start":t(d,p);break;case"arrow-end":t(d,p,1);break;case"clip-rect":var x=c(p).split(j);if(x.length==4){d.clip&&d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);var z=q("clipPath"),A=q("rect");z.id=a.createUUID(),q(A,{x:x[0],y:x[1],width:x[2],height:x[3]}),z.appendChild(A),d.paper.defs.appendChild(z),q(i,{"clip-path":"url(#"+z.id+")"}),d.clip=A}if(!p){var B=i.getAttribute("clip-path");if(B){var C=a._g.doc.getElementById(B.replace(/(^url\(#|\)$)/g,l));C&&C.parentNode.removeChild(C),q(i,{"clip-path":l}),delete d.clip}}break;case"path":d.type=="path"&&(q(i,{d:p?k.path=a._pathToAbsolute(p):"M0,0"}),d._.dirty=1,d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1)));break;case"width":i.setAttribute(o,p),d._.dirty=1;if(k.fx)o="x",p=k.x;else break;case"x":k.fx&&(p=-k.x-(k.width||0));case"rx":if(o=="rx"&&d.type=="rect")break;case"cx":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"height":i.setAttribute(o,p),d._.dirty=1;if(k.fy)o="y",p=k.y;else break;case"y":k.fy&&(p=-k.y-(k.height||0));case"ry":if(o=="ry"&&d.type=="rect")break;case"cy":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"r":d.type=="rect"?q(i,{rx:p,ry:p}):i.setAttribute(o,p),d._.dirty=1;break;case"src":d.type=="image"&&i.setAttributeNS(n,"href",p);break;case"stroke-width":if(d._.sx!=1||d._.sy!=1)p/=g(h(d._.sx),h(d._.sy))||1;d.paper._vbSize&&(p*=d.paper._vbSize),i.setAttribute(o,p),k["stroke-dasharray"]&&v(d,k["stroke-dasharray"],f),d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"stroke-dasharray":v(d,p,f);break;case"fill":var D=c(p).match(a._ISURL);if(D){z=q("pattern");var F=q("image");z.id=a.createUUID(),q(z,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),q(F,{x:0,y:0,"xlink:href":D[1]}),z.appendChild(F),function(b){a._preload(D[1],function(){var a=this.offsetWidth,c=this.offsetHeight;q(b,{width:a,height:c}),q(F,{width:a,height:c}),d.paper.safari()})}(z),d.paper.defs.appendChild(z),q(i,{fill:"url(#"+z.id+")"}),d.pattern=z,d.pattern&&s(d);break}var G=a.getRGB(p);if(!G.error)delete f.gradient,delete k.gradient,!a.is(k.opacity,"undefined")&&a.is(f.opacity,"undefined")&&q(i,{opacity:k.opacity}),!a.is(k["fill-opacity"],"undefined")&&a.is(f["fill-opacity"],"undefined")&&q(i,{"fill-opacity":k["fill-opacity"]});else if((d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p)){if("opacity"in k||"fill-opacity"in k){var H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l));if(H){var I=H.getElementsByTagName("stop");q(I[I.length-1],{"stop-opacity":("opacity"in k?k.opacity:1)*("fill-opacity"in k?k["fill-opacity"]:1)})}}k.gradient=p,k.fill="none";break}G[b]("opacity")&&q(i,{"fill-opacity":G.opacity>1?G.opacity/100:G.opacity});case"stroke":G=a.getRGB(p),i.setAttribute(o,G.hex),o=="stroke"&&G[b]("opacity")&&q(i,{"stroke-opacity":G.opacity>1?G.opacity/100:G.opacity}),o=="stroke"&&d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"gradient":(d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p);break;case"opacity":k.gradient&&!k[b]("stroke-opacity")&&q(i,{"stroke-opacity":p>1?p/100:p});case"fill-opacity":if(k.gradient){H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l)),H&&(I=H.getElementsByTagName("stop"),q(I[I.length-1],{"stop-opacity":p}));break};default:o=="font-size"&&(p=e(p,10)+"px");var J=o.replace(/(\-.)/g,function(a){return a.substring(1).toUpperCase()});i.style[J]=p,d._.dirty=1,i.setAttribute(o,p)}}y(d,f),i.style.visibility=m},x=1.2,y=function(d,f){if(d.type=="text"&&!!(f[b]("text")||f[b]("font")||f[b]("font-size")||f[b]("x")||f[b]("y"))){var g=d.attrs,h=d.node,i=h.firstChild?e(a._g.doc.defaultView.getComputedStyle(h.firstChild,l).getPropertyValue("font-size"),10):10;if(f[b]("text")){g.text=f.text;while(h.firstChild)h.removeChild(h.firstChild);var j=c(f.text).split("\n"),k=[],m;for(var n=0,o=j.length;n<o;n++)m=q("tspan"),n&&q(m,{dy:i*x,x:g.x}),m.appendChild(a._g.doc.createTextNode(j[n])),h.appendChild(m),k[n]=m}else{k=h.getElementsByTagName("tspan");for(n=0,o=k.length;n<o;n++)n?q(k[n],{dy:i*x,x:g.x}):q(k[0],{dy:0})}q(h,{x:g.x,y:g.y}),d._.dirty=1;var p=d._getBBox(),r=g.y-(p.y+p.height/2);r&&a.is(r,"finite")&&q(k[0],{dy:r})}},z=function(b,c){var d=0,e=0;this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.matrix=a.matrix(),this.realPath=null,this.paper=c,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},A=a.el;z.prototype=A,A.constructor=z,a._engine.path=function(a,b){var c=q("path");b.canvas&&b.canvas.appendChild(c);var d=new z(c,b);d.type="path",w(d,{fill:"none",stroke:"#000",path:a});return d},A.rotate=function(a,b,e){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this.transform(this._.transform.concat([["r",a,b,e]]));return this},A.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3])),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]]));return this},A.translate=function(a,b){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this.transform(this._.transform.concat([["t",a,b]]));return this},A.transform=function(c){var d=this._;if(c==null)return d.transform;a._extractTransform(this,c),this.clip&&q(this.clip,{transform:this.matrix.invert()}),this.pattern&&s(this),this.node&&q(this.node,{transform:this.matrix});if(d.sx!=1||d.sy!=1){var e=this.attrs[b]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":e})}return this},A.hide=function(){!this.removed&&this.paper.safari(this.node.style.display="none");return this},A.show=function(){!this.removed&&this.paper.safari(this.node.style.display="");return this},A.remove=function(){if(!this.removed&&!!this.node.parentNode){var b=this.paper;b.__set__&&b.__set__.exclude(this),k.unbind("raphael.*.*."+this.id),this.gradient&&b.defs.removeChild(this.gradient),a._tear(this,b),this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var c in this)this[c]=typeof this[c]=="function"?a._removedFactory(c):null;this.removed=!0}},A._getBBox=function(){if(this.node.style.display=="none"){this.show();var a=!0}var b={};try{b=this.node.getBBox()}catch(c){}finally{b=b||{}}a&&this.hide();return b},A.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;if(c=="transform")return this._.transform;var g=c.split(j),h={};for(var i=0,l=g.length;i<l;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return l-1?h:h[g[0]]}if(d==null&&a.is(c,"array")){h={};for(i=0,l=c.length;i<l;i++)h[c[i]]=this.attr(c[i]);return h}if(d!=null){var m={};m[c]=d}else c!=null&&a.is(c,"object")&&(m=c);for(var n in m)k("raphael.attr."+n+"."+this.id,this,m[n]);for(n in this.paper.customAttributes)if(this.paper.customAttributes[b](n)&&m[b](n)&&a.is(this.paper.customAttributes[n],"function")){var o=this.paper.customAttributes[n].apply(this,[].concat(m[n]));this.attrs[n]=m[n];for(var p in o)o[b](p)&&(m[p]=o[p])}w(this,m);return this},A.toFront=function(){if(this.removed)return this;this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var b=this.paper;b.top!=this&&a._tofront(this,b);return this},A.toBack=function(){if(this.removed)return this;var b=this.node.parentNode;b.tagName.toLowerCase()=="a"?b.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):b.firstChild!=this.node&&b.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper);var c=this.paper;return this},A.insertAfter=function(b){if(this.removed)return this;var c=b.node||b[b.length-1].node;c.nextSibling?c.parentNode.insertBefore(this.node,c.nextSibling):c.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},A.insertBefore=function(b){if(this.removed)return this;var c=b.node||b[0].node;c.parentNode.insertBefore(this.node,c),a._insertbefore(this,b,this.paper);return this},A.blur=function(b){var c=this;if(+b!==0){var d=q("filter"),e=q("feGaussianBlur");c.attrs.blur=b,d.id=a.createUUID(),q(e,{stdDeviation:+b||1.5}),d.appendChild(e),c.paper.defs.appendChild(d),c._blur=d,q(c.node,{filter:"url(#"+d.id+")"})}else c._blur&&(c._blur.parentNode.removeChild(c._blur),delete c._blur,delete c.attrs.blur),c.node.removeAttribute("filter")},a._engine.circle=function(a,b,c,d){var e=q("circle");a.canvas&&a.canvas.appendChild(e);var f=new z(e,a);f.attrs={cx:b,cy:c,r:d,fill:"none",stroke:"#000"},f.type="circle",q(e,f.attrs);return f},a._engine.rect=function(a,b,c,d,e,f){var g=q("rect");a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:b,y:c,width:d,height:e,r:f||0,rx:f||0,ry:f||0,fill:"none",stroke:"#000"},h.type="rect",q(g,h.attrs);return h},a._engine.ellipse=function(a,b,c,d,e){var f=q("ellipse");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);g.attrs={cx:b,cy:c,rx:d,ry:e,fill:"none",stroke:"#000"},g.type="ellipse",q(f,g.attrs);return g},a._engine.image=function(a,b,c,d,e,f){var g=q("image");q(g,{x:c,y:d,width:e,height:f,preserveAspectRatio:"none"}),g.setAttributeNS(n,"href",b),a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:c,y:d,width:e,height:f,src:b},h.type="image";return h},a._engine.text=function(b,c,d,e){var f=q("text");b.canvas&&b.canvas.appendChild(f);var g=new z(f,b);g.attrs={x:c,y:d,"text-anchor":"middle",text:e,font:a._availableAttrs.font,stroke:"none",fill:"#000"},g.type="text",w(g,g.attrs);return g},a._engine.setSize=function(a,b){this.width=a||this.width,this.height=b||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox);return this},a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b&&b.container,d=b.x,e=b.y,f=b.width,g=b.height;if(!c)throw new Error("SVG container not found.");var h=q("svg"),i="overflow:hidden;",j;d=d||0,e=e||0,f=f||512,g=g||342,q(h,{height:g,version:1.1,width:f,xmlns:"http://www.w3.org/2000/svg"}),c==1?(h.style.cssText=i+"position:absolute;left:"+d+"px;top:"+e+"px",a._g.doc.body.appendChild(h),j=1):(h.style.cssText=i+"position:relative",c.firstChild?c.insertBefore(h,c.firstChild):c.appendChild(h)),c=new a._Paper,c.width=f,c.height=g,c.canvas=h,c.clear(),c._left=c._top=0,j&&(c.renderfix=function(){}),c.renderfix();return c},a._engine.setViewBox=function(a,b,c,d,e){k("raphael.setViewBox",this,this._viewBox,[a,b,c,d,e]);var f=g(c/this.width,d/this.height),h=this.top,i=e?"meet":"xMinYMin",j,l;a==null?(this._vbSize&&(f=1),delete this._vbSize,j="0 0 "+this.width+m+this.height):(this._vbSize=f,j=a+m+b+m+c+m+d),q(this.canvas,{viewBox:j,preserveAspectRatio:i});while(f&&h)l="stroke-width"in h.attrs?h.attrs["stroke-width"]:1,h.attr({"stroke-width":l}),h._.dirty=1,h._.dirtyT=1,h=h.prev;this._viewBox=[a,b,c,d,!!e];return this},a.prototype.renderfix=function(){var a=this.canvas,b=a.style,c;try{c=a.getScreenCTM()||a.createSVGMatrix()}catch(d){c=a.createSVGMatrix()}var e=-c.e%1,f=-c.f%1;if(e||f)e&&(this._left=(this._left+e)%1,b.left=this._left+"px"),f&&(this._top=(this._top+f)%1,b.top=this._top+"px")},a.prototype.clear=function(){a.eve("raphael.clear",this);var b=this.canvas;while(b.firstChild)b.removeChild(b.firstChild);this.bottom=this.top=null,(this.desc=q("desc")).appendChild(a._g.doc.createTextNode("Created with Raphaël "+a.version)),b.appendChild(this.desc),b.appendChild(this.defs=q("defs"))},a.prototype.remove=function(){k("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null};var B=a.st;for(var C in A)A[b](C)&&!B[b](C)&&(B[C]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(C))}(window.Raphael),window.Raphael.vml&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=Math,f=e.round,g=e.max,h=e.min,i=e.abs,j="fill",k=/[, ]+/,l=a.eve,m=" progid:DXImageTransform.Microsoft",n=" ",o="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},q=/([clmz]),?([^clmz]*)/gi,r=/ progid:\S+Blur\([^\)]+\)/g,s=/-?[^,\s-]+/g,t="position:absolute;left:0;top:0;width:1px;height:1px",u=21600,v={path:1,rect:1,image:1},w={circle:1,ellipse:1},x=function(b){var d=/[ahqstv]/ig,e=a._pathToAbsolute;c(b).match(d)&&(e=a._path2curve),d=/[clmz]/g;if(e==a._pathToAbsolute&&!c(b).match(d)){var g=c(b).replace(q,function(a,b,c){var d=[],e=b.toLowerCase()=="m",g=p[b];c.replace(s,function(a){e&&d.length==2&&(g+=d+p[b=="m"?"l":"L"],d=[]),d.push(f(a*u))});return g+d});return g}var h=e(b),i,j;g=[];for(var k=0,l=h.length;k<l;k++){i=h[k],j=h[k][0].toLowerCase(),j=="z"&&(j="x");for(var m=1,r=i.length;m<r;m++)j+=f(i[m]*u)+(m!=r-1?",":o);g.push(j)}return g.join(n)},y=function(b,c,d){var e=a.matrix();e.rotate(-b,.5,.5);return{dx:e.x(c,d),dy:e.y(c,d)}},z=function(a,b,c,d,e,f){var g=a._,h=a.matrix,k=g.fillpos,l=a.node,m=l.style,o=1,p="",q,r=u/b,s=u/c;m.visibility="hidden";if(!!b&&!!c){l.coordsize=i(r)+n+i(s),m.rotation=f*(b*c<0?-1:1);if(f){var t=y(f,d,e);d=t.dx,e=t.dy}b<0&&(p+="x"),c<0&&(p+=" y")&&(o=-1),m.flip=p,l.coordorigin=d*-r+n+e*-s;if(k||g.fillsize){var v=l.getElementsByTagName(j);v=v&&v[0],l.removeChild(v),k&&(t=y(f,h.x(k[0],k[1]),h.y(k[0],k[1])),v.position=t.dx*o+n+t.dy*o),g.fillsize&&(v.size=g.fillsize[0]*i(b)+n+g.fillsize[1]*i(c)),l.appendChild(v)}m.visibility="visible"}};a.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var A=function(a,b,d){var e=c(b).toLowerCase().split("-"),f=d?"end":"start",g=e.length,h="classic",i="medium",j="medium";while(g--)switch(e[g]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":h=e[g];break;case"wide":case"narrow":j=e[g];break;case"long":case"short":i=e[g]}var k=a.node.getElementsByTagName("stroke")[0];k[f+"arrow"]=h,k[f+"arrowlength"]=i,k[f+"arrowwidth"]=j},B=function(e,i){e.attrs=e.attrs||{};var l=e.node,m=e.attrs,p=l.style,q,r=v[e.type]&&(i.x!=m.x||i.y!=m.y||i.width!=m.width||i.height!=m.height||i.cx!=m.cx||i.cy!=m.cy||i.rx!=m.rx||i.ry!=m.ry||i.r!=m.r),s=w[e.type]&&(m.cx!=i.cx||m.cy!=i.cy||m.r!=i.r||m.rx!=i.rx||m.ry!=i.ry),t=e;for(var y in i)i[b](y)&&(m[y]=i[y]);r&&(m.path=a._getPath[e.type](e),e._.dirty=1),i.href&&(l.href=i.href),i.title&&(l.title=i.title),i.target&&(l.target=i.target),i.cursor&&(p.cursor=i.cursor),"blur"in i&&e.blur(i.blur);if(i.path&&e.type=="path"||r)l.path=x(~c(m.path).toLowerCase().indexOf("r")?a._pathToAbsolute(m.path):m.path),e.type=="image"&&(e._.fillpos=[m.x,m.y],e._.fillsize=[m.width,m.height],z(e,1,1,0,0,0));"transform"in i&&e.transform(i.transform);if(s){var B=+m.cx,D=+m.cy,E=+m.rx||+m.r||0,G=+m.ry||+m.r||0;l.path=a.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",f((B-E)*u),f((D-G)*u),f((B+E)*u),f((D+G)*u),f(B*u))}if("clip-rect"in i){var H=c(i["clip-rect"]).split(k);if(H.length==4){H[2]=+H[2]+ +H[0],H[3]=+H[3]+ +H[1];var I=l.clipRect||a._g.doc.createElement("div"),J=I.style;J.clip=a.format("rect({1}px {2}px {3}px {0}px)",H),l.clipRect||(J.position="absolute",J.top=0,J.left=0,J.width=e.paper.width+"px",J.height=e.paper.height+"px",l.parentNode.insertBefore(I,l),I.appendChild(l),l.clipRect=I)}i["clip-rect"]||l.clipRect&&(l.clipRect.style.clip="auto")}if(e.textpath){var K=e.textpath.style;i.font&&(K.font=i.font),i["font-family"]&&(K.fontFamily='"'+i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,o)+'"'),i["font-size"]&&(K.fontSize=i["font-size"]),i["font-weight"]&&(K.fontWeight=i["font-weight"]),i["font-style"]&&(K.fontStyle=i["font-style"])}"arrow-start"in i&&A(t,i["arrow-start"]),"arrow-end"in i&&A(t,i["arrow-end"],1);if(i.opacity!=null||i["stroke-width"]!=null||i.fill!=null||i.src!=null||i.stroke!=null||i["stroke-width"]!=null||i["stroke-opacity"]!=null||i["fill-opacity"]!=null||i["stroke-dasharray"]!=null||i["stroke-miterlimit"]!=null||i["stroke-linejoin"]!=null||i["stroke-linecap"]!=null){var L=l.getElementsByTagName(j),M=!1;L=L&&L[0],!L&&(M=L=F(j)),e.type=="image"&&i.src&&(L.src=i.src),i.fill&&(L.on=!0);if(L.on==null||i.fill=="none"||i.fill===null)L.on=!1;if(L.on&&i.fill){var N=c(i.fill).match(a._ISURL);if(N){L.parentNode==l&&l.removeChild(L),L.rotate=!0,L.src=N[1],L.type="tile";var O=e.getBBox(1);L.position=O.x+n+O.y,e._.fillpos=[O.x,O.y],a._preload(N[1],function(){e._.fillsize=[this.offsetWidth,this.offsetHeight]})}else L.color=a.getRGB(i.fill).hex,L.src=o,L.type="solid",a.getRGB(i.fill).error&&(t.type in{circle:1,ellipse:1}||c(i.fill).charAt()!="r")&&C(t,i.fill,L)&&(m.fill="none",m.gradient=i.fill,L.rotate=!1)}if("fill-opacity"in i||"opacity"in i){var P=((+m["fill-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+a.getRGB(i.fill).o+1||2)-1);P=h(g(P,0),1),L.opacity=P,L.src&&(L.color="none")}l.appendChild(L);var Q=l.getElementsByTagName("stroke")&&l.getElementsByTagName("stroke")[0],T=!1;!Q&&(T=Q=F("stroke"));if(i.stroke&&i.stroke!="none"||i["stroke-width"]||i["stroke-opacity"]!=null||i["stroke-dasharray"]||i["stroke-miterlimit"]||i["stroke-linejoin"]||i["stroke-linecap"])Q.on=!0;(i.stroke=="none"||i.stroke===null||Q.on==null||i.stroke==0||i["stroke-width"]==0)&&(Q.on=!1);var U=a.getRGB(i.stroke);Q.on&&i.stroke&&(Q.color=U.hex),P=((+m["stroke-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+U.o+1||2)-1);var V=(d(i["stroke-width"])||1)*.75;P=h(g(P,0),1),i["stroke-width"]==null&&(V=m["stroke-width"]),i["stroke-width"]&&(Q.weight=V),V&&V<1&&(P*=V)&&(Q.weight=1),Q.opacity=P,i["stroke-linejoin"]&&(Q.joinstyle=i["stroke-linejoin"]||"miter"),Q.miterlimit=i["stroke-miterlimit"]||8,i["stroke-linecap"]&&(Q.endcap=i["stroke-linecap"]=="butt"?"flat":i["stroke-linecap"]=="square"?"square":"round");if(i["stroke-dasharray"]){var W={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};Q.dashstyle=W[b](i["stroke-dasharray"])?W[i["stroke-dasharray"]]:o}T&&l.appendChild(Q)}if(t.type=="text"){t.paper.canvas.style.display=o;var X=t.paper.span,Y=100,Z=m.font&&m.font.match(/\d+(?:\.\d*)?(?=px)/);p=X.style,m.font&&(p.font=m.font),m["font-family"]&&(p.fontFamily=m["font-family"]),m["font-weight"]&&(p.fontWeight=m["font-weight"]),m["font-style"]&&(p.fontStyle=m["font-style"]),Z=d(m["font-size"]||Z&&Z[0])||10,p.fontSize=Z*Y+"px",t.textpath.string&&(X.innerHTML=c(t.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var $=X.getBoundingClientRect();t.W=m.w=($.right-$.left)/Y,t.H=m.h=($.bottom-$.top)/Y,t.X=m.x,t.Y=m.y+t.H/2,("x"in i||"y"in i)&&(t.path.v=a.format("m{0},{1}l{2},{1}",f(m.x*u),f(m.y*u),f(m.x*u)+1));var _=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var ba=0,bb=_.length;ba<bb;ba++)if(_[ba]in i){t._.dirty=1;break}switch(m["text-anchor"]){case"start":t.textpath.style["v-text-align"]="left",t.bbx=t.W/2;break;case"end":t.textpath.style["v-text-align"]="right",t.bbx=-t.W/2;break;default:t.textpath.style["v-text-align"]="center",t.bbx=0}t.textpath.style["v-text-kern"]=!0}},C=function(b,f,g){b.attrs=b.attrs||{};var h=b.attrs,i=Math.pow,j,k,l="linear",m=".5 .5";b.attrs.gradient=f,f=c(f).replace(a._radial_gradient,function(a,b,c){l="radial",b&&c&&(b=d(b),c=d(c),i(b-.5,2)+i(c-.5,2)>.25&&(c=e.sqrt(.25-i(b-.5,2))*((c>.5)*2-1)+.5),m=b+n+c);return o}),f=f.split(/\s*\-\s*/);if(l=="linear"){var p=f.shift();p=-d(p);if(isNaN(p))return null}var q=a._parseDots(f);if(!q)return null;b=b.shape||b.node;if(q.length){b.removeChild(g),g.on=!0,g.method="none",g.color=q[0].color,g.color2=q[q.length-1].color;var r=[];for(var s=0,t=q.length;s<t;s++)q[s].offset&&r.push(q[s].offset+n+q[s].color);g.colors=r.length?r.join():"0% "+g.color,l=="radial"?(g.type="gradientTitle",g.focus="100%",g.focussize="0 0",g.focusposition=m,g.angle=0):(g.type="gradient",g.angle=(270-p)%360),b.appendChild(g)}return 1},D=function(b,c){this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=c,this.matrix=a.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},E=a.el;D.prototype=E,E.constructor=D,E.transform=function(b){if(b==null)return this._.transform;var d=this.paper._viewBoxShift,e=d?"s"+[d.scale,d.scale]+"-1-1t"+[d.dx,d.dy]:o,f;d&&(f=b=c(b).replace(/\.{3}|\u2026/g,this._.transform||o)),a._extractTransform(this,e+b);var g=this.matrix.clone(),h=this.skew,i=this.node,j,k=~c(this.attrs.fill).indexOf("-"),l=!c(this.attrs.fill).indexOf("url(");g.translate(-0.5,-0.5);if(l||k||this.type=="image"){h.matrix="1 0 0 1",h.offset="0 0",j=g.split();if(k&&j.noRotation||!j.isSimple){i.style.filter=g.toFilter();var m=this.getBBox(),p=this.getBBox(1),q=m.x-p.x,r=m.y-p.y;i.coordorigin=q*-u+n+r*-u,z(this,1,1,q,r,0)}else i.style.filter=o,z(this,j.scalex,j.scaley,j.dx,j.dy,j.rotate)}else i.style.filter=o,h.matrix=c(g),h.offset=g.offset();f&&(this._.transform=f);return this},E.rotate=function(a,b,e){if(this.removed)return this;if(a!=null){a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this._.dirtyT=1,this.transform(this._.transform.concat([["r",a,b,e]]));return this}},E.translate=function(a,b){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this._.bbox&&(this._.bbox.x+=a,this._.bbox.y+=b),this.transform(this._.transform.concat([["t",a,b]]));return this},E.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3]),isNaN(e)&&(e=null),isNaN(f)&&(f=null)),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]])),this._.dirtyT=1;return this},E.hide=function(){!this.removed&&(this.node.style.display="none");return this},E.show=function(){!this.removed&&(this.node.style.display=o);return this},E._getBBox=function(){if(this.removed)return{};return{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&!!this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),a.eve.unbind("raphael.*.*."+this.id),a._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;this.removed=!0}},E.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c==j&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;var g=c.split(k),h={};for(var i=0,m=g.length;i<m;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return m-1?h:h[g[0]]}if(this.attrs&&d==null&&a.is(c,"array")){h={};for(i=0,m=c.length;i<m;i++)h[c[i]]=this.attr(c[i]);return h}var n;d!=null&&(n={},n[c]=d),d==null&&a.is(c,"object")&&(n=c);for(var o in n)l("raphael.attr."+o+"."+this.id,this,n[o]);if(n){for(o in this.paper.customAttributes)if(this.paper.customAttributes[b](o)&&n[b](o)&&a.is(this.paper.customAttributes[o],"function")){var p=this.paper.customAttributes[o].apply(this,[].concat(n[o]));this.attrs[o]=n[o];for(var q in p)p[b](q)&&(n[q]=p[q])}n.text&&this.type=="text"&&(this.textpath.string=n.text),B(this,n)}return this},E.toFront=function(){!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&a._tofront(this,this.paper);return this},E.toBack=function(){if(this.removed)return this;this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper));return this},E.insertAfter=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[b.length-1]),b.node.nextSibling?b.node.parentNode.insertBefore(this.node,b.node.nextSibling):b.node.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},E.insertBefore=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[0]),b.node.parentNode.insertBefore(this.node,b.node),a._insertbefore(this,b,this.paper);return this},E.blur=function(b){var c=this.node.runtimeStyle,d=c.filter;d=d.replace(r,o),+b!==0?(this.attrs.blur=b,c.filter=d+n+m+".Blur(pixelradius="+(+b||1.5)+")",c.margin=a.format("-{0}px 0 0 -{0}px",f(+b||1.5))):(c.filter=d,c.margin=0,delete this.attrs.blur)},a._engine.path=function(a,b){var c=F("shape");c.style.cssText=t,c.coordsize=u+n+u,c.coordorigin=b.coordorigin;var d=new D(c,b),e={fill:"none",stroke:"#000"};a&&(e.path=a),d.type="path",d.path=[],d.Path=o,B(d,e),b.canvas.appendChild(c);var f=F("skew");f.on=!0,c.appendChild(f),d.skew=f,d.transform(o);return d},a._engine.rect=function(b,c,d,e,f,g){var h=a._rectPath(c,d,e,f,g),i=b.path(h),j=i.attrs;i.X=j.x=c,i.Y=j.y=d,i.W=j.width=e,i.H=j.height=f,j.r=g,j.path=h,i.type="rect";return i},a._engine.ellipse=function(a,b,c,d,e){var f=a.path(),g=f.attrs;f.X=b-d,f.Y=c-e,f.W=d*2,f.H=e*2,f.type="ellipse",B(f,{cx:b,cy:c,rx:d,ry:e});return f},a._engine.circle=function(a,b,c,d){var e=a.path(),f=e.attrs;e.X=b-d,e.Y=c-d,e.W=e.H=d*2,e.type="circle",B(e,{cx:b,cy:c,r:d});return e},a._engine.image=function(b,c,d,e,f,g){var h=a._rectPath(d,e,f,g),i=b.path(h).attr({stroke:"none"}),k=i.attrs,l=i.node,m=l.getElementsByTagName(j)[0];k.src=c,i.X=k.x=d,i.Y=k.y=e,i.W=k.width=f,i.H=k.height=g,k.path=h,i.type="image",m.parentNode==l&&l.removeChild(m),m.rotate=!0,m.src=c,m.type="tile",i._.fillpos=[d,e],i._.fillsize=[f,g],l.appendChild(m),z(i,1,1,0,0,0);return i},a._engine.text=function(b,d,e,g){var h=F("shape"),i=F("path"),j=F("textpath");d=d||0,e=e||0,g=g||"",i.v=a.format("m{0},{1}l{2},{1}",f(d*u),f(e*u),f(d*u)+1),i.textpathok=!0,j.string=c(g),j.on=!0,h.style.cssText=t,h.coordsize=u+n+u,h.coordorigin="0 0";var k=new D(h,b),l={fill:"#000",stroke:"none",font:a._availableAttrs.font,text:g};k.shape=h,k.path=i,k.textpath=j,k.type="text",k.attrs.text=c(g),k.attrs.x=d,k.attrs.y=e,k.attrs.w=1,k.attrs.h=1,B(k,l),h.appendChild(j),h.appendChild(i),b.canvas.appendChild(h);var m=F("skew");m.on=!0,h.appendChild(m),k.skew=m,k.transform(o);return k},a._engine.setSize=function(b,c){var d=this.canvas.style;this.width=b,this.height=c,b==+b&&(b+="px"),c==+c&&(c+="px"),d.width=b,d.height=c,d.clip="rect(0 "+b+" "+c+" 0)",this._viewBox&&a._engine.setViewBox.apply(this,this._viewBox);return this},a._engine.setViewBox=function(b,c,d,e,f){a.eve("raphael.setViewBox",this,this._viewBox,[b,c,d,e,f]);var h=this.width,i=this.height,j=1/g(d/h,e/i),k,l;f&&(k=i/e,l=h/d,d*k<h&&(b-=(h-d*k)/2/k),e*l<i&&(c-=(i-e*l)/2/l)),this._viewBox=[b,c,d,e,!!f],this._viewBoxShift={dx:-b,dy:-c,scale:j},this.forEach(function(a){a.transform("...")});return this};var F;a._engine.initWin=function(a){var b=a.document;b.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!b.namespaces.rvml&&b.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),F=function(a){return b.createElement("<rvml:"+a+' class="rvml">')}}catch(c){F=function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},a._engine.initWin(a._g.win),a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b.container,d=b.height,e,f=b.width,g=b.x,h=b.y;if(!c)throw new Error("VML container not found.");var i=new a._Paper,j=i.canvas=a._g.doc.createElement("div"),k=j.style;g=g||0,h=h||0,f=f||512,d=d||342,i.width=f,i.height=d,f==+f&&(f+="px"),d==+d&&(d+="px"),i.coordsize=u*1e3+n+u*1e3,i.coordorigin="0 0",i.span=a._g.doc.createElement("span"),i.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",j.appendChild(i.span),k.cssText=a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",f,d),c==1?(a._g.doc.body.appendChild(j),k.left=g+"px",k.top=h+"px",k.position="absolute"):c.firstChild?c.insertBefore(j,c.firstChild):c.appendChild(j),i.renderfix=function(){};return i},a.prototype.clear=function(){a.eve("raphael.clear",this),this.canvas.innerHTML=o,this.span=a._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},a.prototype.remove=function(){a.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;return!0};var G=a.st;for(var H in E)E[b](H)&&!G[b](H)&&(G[H]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(H))}(window.Raphael)
;
/**
 * mapSvg 5.5.6 - Interactive Map Plugin
 *
 * Author - Roman S. Stepanov
 * http://codecanyon.net/user/Yatek/portfolio?ref=Yatek
 *
 * Version : 5.5.6
 * Released: March 27, 2013
 *
 * You must purchase Regular or Extended license to use mapSvg plugin.
 * Visit plugin's page @ CodeCanyon: http://codecanyon.net/item/jquery-interactive-svg-map-plugin/1694201
 * Licenses: http://codecanyon.net/licenses/regular_extended
 */


 (function( $ ) {

    var instances = {},
        globalID  = 0,
        userAgent = navigator.userAgent.toLowerCase();

    // Get plugin's path
    var scripts       = document.getElementsByTagName('script');
    var myScript      = scripts[scripts.length - 1].src.split('/');
        myScript.pop();
    var pluginJSURL   =  myScript.join('/')+'/';
        myScript.pop();
    var pluginRootURL =  myScript.join('/')+'/';

    // Check for iPad/Iphone/Andriod
    var touchDevice =
        (userAgent.indexOf("ipad") > -1) ||
        (userAgent.indexOf("iphone") > -1) ||
        (userAgent.indexOf("ipod") > -1) ||
        (userAgent.indexOf("android") > -1);

    var _browser = {};

    _browser.ie = userAgent.indexOf("msie") > -1 ? {} : false;
    if(_browser.ie)
        _browser.ie.old = (navigator.userAgent.match(/MSIE [6-8]/) !== null);

    _browser.firefox = userAgent.indexOf("firefox") > -1;

    if (!String.prototype.trim) {
        String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
    }


    // Create function for retrieving mouse coordinates
    if (touchDevice){
        var mouseCoords = function(e){
            return e.touches[0] ?
            {'x':e.touches[0].pageX, 'y':e.touches[0].pageY} :
            {'x':e.changedTouches[0].pageX, 'y':e.changedTouches[0].pageY};
        };
    }else{
        var mouseCoords = function(e){
            
            //return e.pageX ?
            //{'x':e.pageX, 'y':e.pageY} :
            //{'x':e.clientX + $('html').scrollLeft(), 'y':e.clientY + $('html').scrollTop()};
            return {'x':e.clientX + $(window).scrollLeft(), 'y':e.clientY + $(window).scrollTop()};
            
        };
    }

    // This data is needed for lat-lon to x-y conversions
    var CBK = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296, 8589934592, 17179869184, 34359738368, 68719476736, 137438953472]
    var CEK = [0.7111111111111111, 1.4222222222222223, 2.8444444444444446, 5.688888888888889, 11.377777777777778, 22.755555555555556, 45.51111111111111, 91.02222222222223, 182.04444444444445, 364.0888888888889, 728.1777777777778, 1456.3555555555556, 2912.711111111111, 5825.422222222222, 11650.844444444445, 23301.68888888889, 46603.37777777778, 93206.75555555556, 186413.51111111112, 372827.02222222224, 745654.0444444445, 1491308.088888889, 2982616.177777778, 5965232.355555556, 11930464.711111112, 23860929.422222223, 47721858.844444446, 95443717.68888889, 190887435.37777779, 381774870.75555557, 763549741.5111111]
    var CFK = [40.74366543152521, 81.48733086305042, 162.97466172610083, 325.94932345220167, 651.8986469044033, 1303.7972938088067, 2607.5945876176133, 5215.189175235227, 10430.378350470453, 20860.756700940907, 41721.51340188181, 83443.02680376363, 166886.05360752725, 333772.1072150545, 667544.214430109, 1335088.428860218, 2670176.857720436, 5340353.715440872, 10680707.430881744, 21361414.86176349, 42722829.72352698, 85445659.44705395, 170891318.8941079, 341782637.7882158, 683565275.5764316, 1367130551.1528633, 2734261102.3057265, 5468522204.611453, 10937044409.222906, 21874088818.445812, 43748177636.891624]

    // Default options
    var defaults = {
        keepSourceStyles    : false,
        loadingText         : 'Loading map...',
        //colors              : {base: "#E1F1F1", background: "#eeeeee", hover: "#548eac", selected: "#065A85", stroke: "#7eadc0"},
        colors              : {background: "#eeeeee", selected: 5, hover: 2},
        regions             : {},
        viewBox             : [],
        cursor              : 'default',
        scale               : 1,
        tooltipsMode        : 'hover',
        tooltips            : {show: 'hover', mode: 'names'},
        onClick             : null,
        mouseOver           : null,
        mouseOut            : null,
        disableAll          : false,
        hideAll             : false,
        marks               : null,
        hover_mode          : 'brightness',
        selected_mode       : 'brightness',
        hover_brightness    : 1,
        selected_brightness : 5,
        pan                 : false,
        panLimit            : true,
        panBackground       : false,
        zoom                : false,
        popover             : {width: 'auto', height:  'auto'},
        buttons             : true,
        zoomLimit           : [0,5],
        zoomDelta           : 1.2,
        zoomButtons         : {'show': true, 'location': 'right'},
        multiSelect         : false

    };

    // Default mark style
    var markOptions = {attrs: {'cursor': 'pointer', 'src': pluginRootURL+'markers/_pin_default.png'}};


/** Main Class **/
var mapSVG = function(elem, options){

    var _data;

    this.methods = {


        // destroy
        destroy : function(){
            delete instances[_data.$map.attr('id')];
            _data.$map.empty();
            return _this;
        },
        getData : function(){
          return _data;
        },
        // GET SCALE VALUE
        getScale: function(){

            var ratio_def = _data.svgDefault.width / _data.svgDefault.height;
            var ratio_new = _data.options.width / _data.options.height;
            var scale1, scale2;

            var size = _data.options.responsive ? [_data.$map.width(), _data.$map.height()] : [_data.options.width, _data.options.height];

            if(ratio_new < ratio_def ){
            // Calculate scale by height
                scale1 = _data.svgDefault.width / _data.svgDefault.viewBox[2];
                scale2 = size[0] / _data.viewBox[2];
            }else{
            // Calculate scale by width
                scale1 = _data.svgDefault.height / _data.svgDefault.viewBox[3];
                scale2 = size[1] / _data.viewBox[3];
            }

            return (1 - (scale1-scale2));
        },
        fluidResize : function(w,h){

            if(!w || !h){
                w = _data.$map.width();
                h = _data.$map.height();
            }

           _data.R.setSize(w,h);

           _data.scale = _this.getScale();
           _this.marksAdjustPosition();

           //_data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);
        },
        // GET VIEBOX [x,y,width,height]
        getViewBox : function(){
            return _data.viewBox;
        },
        // SET VIEWBOX
        setViewBox : function(v){

            if(typeof v == 'string'){
                var coords = _data.ref[v].getBBox();
                _data.viewBox = [coords.x-5, coords.y-5, coords.width+10, coords.height+10];
                var isZooming = true;
            }else{
                var d = (v && v.length==4) ? v : _data.svgDefault.viewBox;
                var isZooming = parseInt(d[2]) != _data.viewBox[2] || parseInt(d[3]) != _data.viewBox[3];
                _data.viewBox = [parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])];
            }

            _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);

            if(isZooming){
                _data.scale = _this.getScale();
                _this.marksAdjustPosition();
                if((_browser.ie && !_browser.ie.old) || _browser.firefox){
                        _this.mapAdjustStrokes();
                }

            }

            return true;
        },
        // SET VIEWBOX BY SIZE
        viewBoxSetBySize : function(width,height){

            _data._viewBox = _this.viewBoxGetBySize(width,height);
            _data.viewBox  = $.extend([],_data._viewBox);
            _data.scale    = _this.getScale();

            _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);

            _this.marksAdjustPosition();

            return _data.viewBox;
        },
        viewBoxGetBySize : function(width, height){


            var new_ratio = width / height;
            var old_ratio = _data.svgDefault.viewBox[2] / _data.svgDefault.viewBox[3];

            var vb = $.extend([],_data.svgDefault.viewBox);

            if (new_ratio != old_ratio){
                    vb[2] = width*_data.svgDefault.viewBox[2] / _data.svgDefault.width;
                    vb[3] = height*_data.svgDefault.viewBox[3] / _data.svgDefault.height;

            }

            return vb;
        },
        viewBoxReset : function(){
            _this.setViewBox();
        },
        mapAdjustStrokes : function(){
                $.each(_data.ref, function(i,region){
                    if(region.default_attr['stroke-width'])
                        region.attr( {'stroke-width': region.default_attr['stroke-width'] / _data.scale } );
                });
        },
        // ZOOM
        zoomIn: function(){
            _this.zoom(1);
        },
        zoomOut: function(){
            _this.zoom(-1);
        },
        touchZoomStart : function (touchScale){

            touchZoomStart = _data._scale;
            _data.scale  = _data.scale * zoom_k;
            zoom   = _data._scale;
            _data._scale = _data._scale * zoom_k;


            var vWidth     = _data.viewBox[2];
            var vHeight    = _data.viewBox[3];
            var newViewBox = [];

            newViewBox[2]  = _data._viewBox[2] / _data._scale;
            newViewBox[3]  = _data._viewBox[3] / _data._scale;

            newViewBox[0]  = _data.viewBox[0] + (vWidth - newViewBox[2]) / 2;
            newViewBox[1]  = viewBox[1] + (vHeight - newViewBox[3]) / 2;

            _this.setViewBox(newViewBox, true);

        },
        touchZoomMove : function(){

        },
        touchZoomEnd : function(){

        },
        zoom : function (delta, exact){

            var vWidth     = _data.viewBox[2];
            var vHeight    = _data.viewBox[3];
            var newViewBox = [];

            if(!exact){
            // check for zoom limit
                var d = delta > 0 ? 1 : -1;
                _data._zoomLevel = _data.zoomLevel;
                _data._zoomLevel += d;
                if(_data._zoomLevel > _data.options.zoomLimit[1] || _data._zoomLevel < _data.options.zoomLimit[0]) return false;

                _data.zoomLevel = _data._zoomLevel;

                var zoom_k = d * _data.options.zoomDelta;
                if (zoom_k < 1) zoom_k = -1/zoom_k;

                _data._scale         = _data._scale * zoom_k;
                newViewBox[2]  = _data._viewBox[2] / _data._scale;
                newViewBox[3]  = _data._viewBox[3] / _data._scale;
            }else{
                _data._scale         = exact;
                newViewBox[2]  = _data.touchZoomStartViewBox[2] / _data._scale;
                newViewBox[3]  = _data.touchZoomStartViewBox[3] / _data._scale;
            }

            newViewBox[0]  = _data.viewBox[0] + (vWidth - newViewBox[2]) / 2;
            newViewBox[1]  = _data.viewBox[1] + (vHeight - newViewBox[3]) / 2;

            _this.setViewBox(newViewBox, true);
        },
        //  MARK : UPDATE
        markUpdate : function(mark, data){

            if(data.attrs['src']=="")
                delete data.attrs['src'];
            if(data.attrs['href']=="")
                delete data.attrs['href'];

                var img  = new Image();

                img.onload = function(){

                    data.data.width = this.width;
                    data.data.height = this.height;
                    data.attrs.width = parseFloat(data.data.width/_data.scale).toFixed(2);
                    data.attrs.height = parseFloat(data.data.height/_data.scale).toFixed(2);

                    // we don't want href to be active in edit mode
                    if(options.editMode && data.attrs.href){
                            mark.data('href',data.attrs.href);
                            delete data.attrs.href;
                    }else if(options.editMode && !data.attrs.href){
                            mark.removeData('href');
                    }

                    mark.data(data.data);
                    mark.attr(data.attrs);
                };

                img.src  = data.attrs.src;

        },
        // MARK : DELETE
        markDelete: function(mark){
            mark.remove();
        },
        // MARK : ADD
        markAdd : function(opts, create) {

                // Join default mark options with user-defined options
                var mark = $.extend(true, {}, markOptions, opts);

                if (mark.width && mark.height){

                    return _this.markAddFinalStep(mark, create);

                }else{

                    var img = new Image();


                    img.onload = function(){

                        mark.width = this.width;
                        mark.height = this.height;

                        return _this.markAddFinalStep(mark, create);
                    };

                    img.src = mark.attrs.src;
                }
        },
        markAddFinalStep : function(mark, create){
                // We don't need to open a link in edit mode
                var markAttrs = $.extend(true, {}, mark.attrs);

                var width  = parseFloat(mark.width/_data.scale).toFixed(2);
                var height = parseFloat(mark.height/_data.scale).toFixed(2);


                // Get mark's xy OR convert lat/lon to x/y
                var xy = mark.xy ? mark.xy :
                            (mark.attrs.x ? [mark.attrs.x, mark.attrs.y] :
                                (mark.c ? _this.ll2px(mark) : false)
                             );

                if(!xy) return false;

                if(create){
                    xy[0] = xy[0]/_data.scale - mark.width/(2*_data.scale);
                    xy[1] = (xy[1]-mark.height)/_data.scale;
                }

                xy[0] = parseFloat(xy[0]).toFixed(4);
                xy[1] = parseFloat(xy[1]).toFixed(4);

                if(_data.options.editMode)
                    delete markAttrs.href;


                delete markAttrs.width;
                delete markAttrs.height;


                // Add mark (image)
                var RMark = _data.R.image(mark.attrs.src, xy[0], xy[1], width, height)
                             .attr(markAttrs)
                             .data(mark);
                RMark.mapsvg_type = 'mark';


                if(mark.id)
                    RMark.node.id = mark.id;

                if(!_data.options.editMode){
                    if(!touchDevice){
                        RMark.mousedown(function(e){
                                if(this.data('popover')){

                                    _this.showPopover(e, this.data('popover'));
                                }
                                if(_data.options.onClick)
                                    return _data.options.onClick.call(this, e, _this);

                        });

                        if(_data.options.mouseOver){
                            RMark.mouseover(function(e){
                                return _data.options.mouseOver.call(this, e, _this);
                            });
                        }
                        if(_data.options.mouseOut){
                            RMark.mouseout(function(e){
                                return _data.options.mouseOver.call(this, e, _this);
                            });
                        }

                    }else{
                        RMark.touchstart(function(e){
                                if(this.attrs.href){
                                    window.location.href = this.attrs.href;
                                }else if(this.data('popover')){
                                    _this.showPopover(e, this.data('popover'));
                                }
                                if(_data.options.onClick)
                                    return _data.options.onClick.call(this, e, _this);

                        });
                    }
                }

                _this.markEventHandlersSet(_data.options.editMode, RMark);
                _data.RMarks.push(RMark);


                // Call edit window
                if(create)
                    _data.options.marksEditHandler.call(RMark);
                else
                    _this.markAdjustPosition(RMark);


                return RMark;

        },
        marksAdjustPosition : function(mark){

            if(!mark && (!_data.RMarks || _data.RMarks.length < 1)) return false;

            // We want a marker "tip" to be on bottom side (like a pin)
            // But Raphael starts to draw an image from left top corner.
            // At the same time we don't want a mark to be scaled in size when map scales;
            // Mark always should stay the same size.
            // In this case coordinates of bottom point of image will vary with map scaling.
            // So we have to calculate the offset.

            var dx, dy;

            for (var m in _data.RMarks.items){
                var w = _data.RMarks.items[m].data('width');
                var h = _data.RMarks.items[m].data('height');
                dx = w/2 - w/(2*_data.scale);
                dy = h - h/_data.scale;
                if(_browser.ie){
                    w  = parseInt(w);
                    h  = parseInt(h);
                }

                _data.RMarks.items[m].attr({width: w/_data.scale, height: h/_data.scale}).transform('t'+dx+','+dy);
            }

        },
        markAdjustPosition : function(mark){
                var w = mark.data('width');
                var h = mark.data('height');
                var dx = w/2 - w/(2*_data.scale);
                var dy = h - h/_data.scale;
                mark.attr({width: w/(_data.scale), height: h/(_data.scale)}).transform('t'+dx+','+dy);
                //mark.transform('t'+dx+','+dy);
        },
        // GET MARK COORDINATES TRANSLATED TO 1:1 SCALE (used when saving new added marks)
        markGetDefaultCoords : function(markX, markY, markWidth, markHeight, mapScale){
            markX       = parseFloat(markX);
            markY       = parseFloat(markY);
            markWidth   = parseFloat(markWidth);
            markHeight  = parseFloat(markHeight);
            markX       = parseFloat(markX + markWidth/(2*mapScale) - markWidth/2).toFixed(2);
            markY       = parseFloat(markY + markHeight/mapScale - markHeight).toFixed(2);
            return [markX, markY];
        },
        // MARK MOVE & EDIT HANDLERS
        markMoveStart : function(){
            // storing original coordinates
            this.data('ox', parseFloat(this.attr('x')));
            this.data('oy', parseFloat(this.attr('y')));
        },
        markMove : function (dx, dy) {
            dx = dx/_data.scale;
            dy = dy/_data.scale;
            this.attr({x: this.data('ox') + dx, y: this.data('oy') + dy});
        },
        markMoveEnd : function () {
            // if coordinates are same then it was a "click" and we should start editing
            if(this.data('ox') == this.attr('x') && this.data('oy') == this.attr('y')){
               options.marksEditHandler.call(this);
            }
        },
        panStart : function (e){


                if(e.target.id == 'btnZoomIn' || e.target.id == 'btnZoomOut')
                    return false;

                e.preventDefault();
                var ce = e.touches && e.touches[0] ? e.touches[0] : e;

                _data.pan = {};

                // initial viewbox when panning started
                _data.pan.vxi = _data.viewBox[0];
                _data.pan.vyi = _data.viewBox[1];
                // mouse coordinates when panning started
                _data.pan.x  = ce.clientX;
                _data.pan.y  = ce.clientY;
                // mouse delta
                _data.pan.dx = 0;
                _data.pan.dy = 0;
                // new viewbox x/y
                _data.pan.vx = 0;
                _data.pan.vy = 0;

                if(!touchDevice)
                    $('body').on('mousemove', _this.panMove).on('mouseup', _this.panEnd);
        },
        panMove :  function (e){

                e.preventDefault();

                _data.isPanning = true;

                _data.RMap.attr({'cursor': 'move'});
                $('body').css({'cursor': 'move'});

                var ce = e.touches && e.touches[0] ? e.touches[0] : e;

                // delta x/y
                _data.pan.dx = (_data.pan.x - ce.clientX);
                _data.pan.dy = (_data.pan.y - ce.clientY);

                // new viewBox x/y
                var vx = parseInt(_data.pan.vxi + _data.pan.dx /_data.scale);
                var vy = parseInt(_data.pan.vyi + _data.pan.dy /_data.scale);

                // Limit pan to map's boundaries
                if(_data.options.panLimit){
                    if(vx < _data.svgDefault.viewBox[0])
                        vx = _data.svgDefault.viewBox[0];
                    else if(_data.viewBox[2] + vx > _data.svgDefault.viewBox[2])
                        vx = _data.svgDefault.viewBox[2]-_data.viewBox[2];

                    if(vy < _data.svgDefault.viewBox[1])
                        vy = _data.svgDefault.viewBox[1];
                    else if(_data.viewBox[3] + vy > _data.svgDefault.viewBox[3])
                        vy = _data.svgDefault.viewBox[3]-_data.viewBox[3];
                }

                _data.pan.vx = vx;
                _data.pan.vy = vy;


                // set new viewBox
                _this.setViewBox([_data.pan.vx,  _data.pan.vy, _data.viewBox[2], _data.viewBox[3]]);

        },
        panEnd : function (e){

                _data.isPanning = false;

                // call regionClickHandler if mouse did not move more than 5 pixels
                if (_data.region_clicked && Math.abs(_data.pan.dx)<5 && Math.abs(_data.pan.dy)<5)
                    _this.regionClickHandler(e, _data.region_clicked);

                $('body').css({'cursor': 'default'});
                _data.RMap.attr({'cursor': _data.options.cursor});

                _data.viewBox[0] = _data.pan.vx || _data.viewBox[0];
                _data.viewBox[1] = _data.pan.vy || _data.viewBox[1] ;

                if(!touchDevice)
                    $('body').off('mousemove', _this.panMove).off('mouseup', _this.panEnd);
        },
        // REMEMBER WHICH REGION WAS CLICKED BEFORE START PANNING
        panRegionClickHandler : function (e, region) {
                _data.region_clicked = region;
        },
        touchStart : function (e){
            e.preventDefault();
            if(_data.options.zoom && e.touches && e.touches.length == 2){
                _data.touchZoomStartViewBox = _data.viewBox;
                _data.touchZoomStart =  _data.scale;
                _data.touchZoomEnd   =  1;
            }else{
                _this.panStart(e);
                _data.isPanning = true;
            }
        },
        touchMove : function (e){
            e.preventDefault();
            if(_data.options.zoom && e.touches && e.touches.length >= 2){
                _this.zoom(null, e.scale);
                _data.isPanning = false;
            }else if(_data.isPanning){
                _this.panMove(e);
            }
        },
        touchEnd : function (e){
            e.preventDefault();
                if(_data.touchZoomStart){
                   _data.touchZoomStart  = false;
                   _data.touchZoomEnd    = false;
                }else if(_data.isPanning){
                    _this.panEnd(e);
                }
        },
        marksHide : function(){
            _data.RMarks.hide();
        },
        marksShow : function(){
            _data.RMarks.show();
        },
        // GET ALL MARKS
        marksGet : function(){
            var _marks = [];
            $.each(_data.RMarks, function(i, m){
                    if(m.attrs){
                    // If mark exist
                        var attrs = $.extend({},m.attrs);
                        if(!m.data('placed')){
                            var xy = _this.markGetDefaultCoords(m.attrs.x, m.attrs.y, m.data('width'), m.data('height'), _data.scale);
                            attrs.x = xy[0];
                            attrs.y = xy[1];
                        }

                        if(m.data('href'))
                            attrs.href = m.data('href');

                        _marks.push({
                            attrs:    attrs,
                            tooltip:  m.data('tooltip'),
                            popover:  m.data('popover'),
                            width:    m.data('width'),
                            height:   m.data('height'),
                            href:     m.data('href'),
                            placed:   true
                        });
                    }
            });
            return _marks;
        },
        // GET SELECTED REGION OR ARRAY OF SELECTED REGIONS
        getSelected : function(){
            return _data.selected_id;
        },
        // SELECT REGION
        selectRegion :    function(id){
                if(!_data.ref[id] || _data.ref[id].disabled) return false;
                
                if(_data.options.multiSelect){
                // if multi select is ON
                    var i = $.inArray(id, _data.selected_id);

                    if(i >= 0){
                    // if selected, deselect
                        _data.ref[id].attr({'fill' : _data.ref[id].default_attr.fill});
                        _data.selected_id.splice(i,1);
                        return;
                    }else{
                    // select
                        _data.selected_id.push(id);
                    }
                }else{
                // single select
                    if(_data.selected_id){
                        _data.ref[_data.selected_id].attr(_data.ref[_data.selected_id].default_attr);
                        if(_browser.ie && !_browser.ie.old)
                            _this.mapAdjustStrokes();
                    }
                        
                        
                    
                    _data.selected_id = id;
                }

                _data.ref[id].attr(_data.ref[id].selected_attr);

        },
        // UNHIGHLIGHT REGION
        unhighlightRegion :   function(id){

                if(_data.ref[id].disabled
                   || (_data.options.multiSelect && $.inArray(id,_data.selected_id)>=0)
                   || _data.selected_id == id
                   ) return false;

                _data.ref[id].attr({'fill' : _data.ref[id].default_attr.fill});
        },
        // HIGHLIGHT REGION
        highlightRegion : function(id){
                if(_data.isPanning
                    || _data.ref[id].disabled
                    || (_data.options.multiSelect && $.inArray(id,_data.selected_id)>=0)
                    || _data.selected_id == id
                   )
                    return false;

                _data.ref[id].attr(_data.ref[id].hover_attr);
        },
        // CONVERT LAT/LON TO X/Y (works only with world_high.svg map!)
        ll2px : function(mark){

                var latlng = mark.c;

                var lat = parseFloat(latlng[0]);
                var lng = parseFloat(latlng[1]);

                var czoom = 2;

                var cbk = CBK[czoom];
                //var scale = options.width/1024;
                var scale_ = 1;

                var x = Math.round(cbk + (lng * CEK[czoom]));

                var foo = Math.sin(lat * 3.14159 / 180)
                if (foo < -0.9999)
                    foo = -0.9999;
                else if (foo > 0.9999)
                    foo = 0.9999;

                var y = Math.round(cbk + (0.5 * Math.log((1+foo)/(1-foo)) * (-CFK[czoom])));

                var coordsXY  = [x-(33.8+(mark.width/2)), y-(141.7+mark.height)];

                return coordsXY;
       },
       // CHECK IF REGION IS DISABLED
       isRegionDisabled : function (name, svgfill){
            if(_data.options.regions[name] && (_data.options.regions[name].disabled || svgfill == 'none') ){
                return true;
            }else if(_data.options.disableAll || svgfill == 'none' || name == 'labels' || name == 'Labels'){
                return true;
            }else{
                return false;
            }
       },
       regionClickHandler : function(e, region){

            if(!region) return false;

            _data.region_clicked = null;
            _this.selectRegion(region.name);
            _this.hidePopover();

            if(region.popover)
                _this.showPopover(e, region.popover);

            if(_data.options.onClick)
                return _data.options.onClick.call(region, e, _this);

            if(touchDevice && region.attrs.href)
                window.location.href = region.attrs.href;

       },
       renderSVGPath : function (item, parentTransform, parentStyle){
        
          var path = _data.R.path($(item).attr('d'));          
          var rObj = _this.initRaphaelObject( path, item, parentTransform, parentStyle);

          _this.regionAdd(rObj);
       },
       renderSVGImage: function (item, parentTransform, parentStyle){

          var src = $(item).attr('xlink:href'),
              x   = $(item).attr('x') || 0,
              y   = $(item).attr('y') || 0,
              w   = $(item).attr('width') || 0,
              h   = $(item).attr('height') || 0;
          
          if (!_this.fileExists(src))
            return false;
             
          var rObj = _data.R.image(src, x, y, w, h)
         _this.initRaphaelObject( rObj, item, parentTransform, parentStyle );
          return rObj;
       },
       renderSVGPolygon : function (item, parentTransform, parentStyle){
          //var points = item.getAttribute('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var points = item.attr('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var x0 = points.shift(),
              y0 = points.shift();
          var pathdata = 'M'+x0+','+y0+' L'+points.join(' ')+'z';
          var rObj = _this.initRaphaelObject( _data.R.path(pathdata), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGPolyline : function (item, parentTransform, parentStyle){
          //var points = item.getAttribute('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var points = item.attr('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var x0 = points.shift(),
              y0 = points.shift();
          var pathdata = 'M'+x0+','+y0+' L'+points.join(' ');
          var rObj = _this.initRaphaelObject( _data.R.path(pathdata), item, parentTransform, parentStyle);
          return rObj;          
       },
       renderSVGCircle: function (item, parentTransform, parentStyle){
          var x   = $(item).attr('cx') || 0,
              y   = $(item).attr('cy') || 0;
              r   = $(item).attr('r')  || 0;
          var rObj = _this.initRaphaelObject( _data.R.circle(x,y,r), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGEllipse: function (item, parentTransform, parentStyle){
          var x   = $(item).attr('cx') || 0,
              y   = $(item).attr('cy') || 0;
              rx  = $(item).attr('rx')  || 0;
              ry  = $(item).attr('ry')  || 0;
          var rObj = _this.initRaphaelObject( _data.R.ellipse(x,y,rx,ry), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGRect: function (item, parentTransform, parentStyle){
          var x   = $(item).attr('x') || 0,
              y   = $(item).attr('y') || 0,
              w   = $(item).attr('width') || 0,
              h   = $(item).attr('height') || 0;
              r   = $(item).attr('rx') || $(item).attr('ry') || 0;
          var rObj = _this.initRaphaelObject( _data.R.rect(x,y,w,h,r), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGText : function (textObj){

            var tspans = $(textObj).find('tspan');

            var x = parseFloat($(textObj).attr('x')) || 0;
            var y = parseFloat($(textObj).attr('y')) || 0;

            tspans.each(function(i,tspan){
                var t = _this.renderSVGTspan($(tspan), {x: x, y: y});
                
                t.attr(_this.styleSVG2Raphael(textObj));
                t.attr(_this.styleSVG2Raphael($(tspan)));
                
                t.transform( _this.transformSVG2Raphael(textObj) );
                t.transform( _this.transformSVG2Raphael($(tspan)));                
            });

            if(tspans.length == 0){
                var t = _this.renderSVGTspan(textObj);
                t.attr(_this.styleSVG2Raphael(textObj));
                t.transform( _this.transformSVG2Raphael(textObj) );
            }
            
          return t;
       },
       renderSVGTspan : function (textObj, parent){
        
            parent = parent || {x: 0, y: 0};

            var x = parseFloat($(textObj).attr('x')) || parent.x;
            var y = parseFloat($(textObj).attr('y')) || parent.y;

            if($(textObj).attr('dx'))
                x += parent.x + $(textObj).attr('dx');
            if($(textObj).attr('dy'))
                y += parent.y + $(textObj).attr('dy');

            text = $(textObj).text();
            

            var rObj = _data.R.text(x, y, text).attr({'text-anchor': 'start'});

            rObj.mapsvg_type = 'text';

            $(rObj.node).css({
            	"-webkit-touch-callout": "none",
            	"-webkit-user-select": "none",
                'pointer-events': 'none'
            });
          return rObj;            
       },
       initRaphaelObject : function (rObj, svgItem, parentTransform, parentStyle){
  
          var _parentStyle        = parentStyle || {};
          var _parentTransform    = parentTransform || ''; 
          rObj.id            = $(svgItem).attr('id') || rObj.type+(globalID++);
          rObj.node.id       = rObj.id;
          rObj.name          = rObj.id;
          
          var style = _this.styleSVG2Raphael(svgItem, parentStyle);
          
          rObj.attr(style);
          var transform = _this.transformSVG2Raphael(svgItem) + _parentTransform;
          rObj.transform(transform);
          return rObj;
       },
       styleSVG2Raphael : function(svgItem, parentStyle){
            var parentStyle = parentStyle || {};
            var style       = {};
            var attrs       = $(svgItem).get(0).attributes;
            var style_attrs = ["fill","fill-opacity","opacity", "font","font-name","font-family","font-size","font-weight","stroke","stroke-lincap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width"];

            if($(svgItem).attr('style')){
                var _style = $(svgItem).attr('style').split(';');
                    $.each(_style, function(i, val){
                        
                        var p = val.split(':');
                        p[0] = p[0].trim();
                        if(p[1])
                            p[1] = p[1].trim();
                        if(p[0]=='font-size')
                            p[1] = parseInt(p[1].replace('px',''));
                        if(_this.isNumber(p[0]))
                            p[1] = parseFloat(p[1]);                        
                        style[p[0]] = p[1];
                    });
            }

            if(attrs)    
            $.each(attrs, function(i,attr){
               if ($.inArray(attr.name, style_attrs) > -1){
                    if(attr.name=='font-size'){
                        attr.value = parseInt(attr.value.replace('px',''));
                    }
                    style[attr.name] = attr.value;
               }
            });

            if(style['font-size']){
                style['font-size'] = parseInt(style['font-size']);
            }
            
            // Combine with parent styles
            var final_style = $.extend({}, parentStyle, style); 

            if(final_style['stroke']==undefined && final_style['fill']==undefined){                
                final_style['stroke'] = 'none';
                final_style['fill'] = "#000000";                
            }else if (final_style['stroke']==undefined){
                final_style['stroke'] = 'none';
            }else if(final_style['fill']==undefined){
                final_style['fill'] = 'none';
            }
            
            return final_style;
       },
       transformSVG2Raphael : function(svgItem){
        
            var _transform = $(svgItem).attr('transform');

            if(_transform){

                var tparts = _transform.split(')');
                var rtransform = [];

                for (t in tparts){
                    if(tparts[t] != ""){
                        var kv = tparts[t].split('(');

                        if (kv[0]!='matrix'){
                            kv[0] = kv[0].slice(0,1).toLowerCase();
                            rtransform.push(kv[0]+kv[1]);
                        }else{
                            m = kv[1].split(',');
                            var transform_string = Raphael.matrix(parseFloat(m[0]),parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]),parseFloat(m[4]),parseFloat(m[5])).toTransformString();
                            rtransform.push(transform_string);
                        }
                    }
                }

                return rtransform.join();
            }
            return '';        
       },
       // GET ELEMENT'S STYLES (fill, strokes etc..)
       getElementStyles : function (elem){
            if(!_browser.ie){
                return elem.style;
            }else{
                var styles = {};
                styles.getPropertyValue = function(v){
                    return styles[v] || undefined;
                };
                if($(elem).attr('style')){
                    var def_styles = $(elem).attr('style').split(';');
                    $.each(def_styles, function(i, val){
                        var p = val.split(':');
                        styles[p[0]] = p[1];
                    });
                }
                return styles;
            }
       },
       fileExists : function(url){
            if(url.substr(0,4)=="data") 
                return true;
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status!=404;
       },
       // ADD REGION (PARSE SVG DATA)
       regionAdd : function (_item){

            var name                      = _item.name;
            _data.ref[name]               = _item;
            _data.ref[name].disabled      = _this.isRegionDisabled(name, _item.attr('fill'));
            _data.ref[name].default_attr  = {};

            _data.ref[name].default_attr['fill']         = _item.attr('fill') || 'none';

            if(_data.ref[name].default_attr['fill'] && _data.ref[name].default_attr['fill'] != 'none' && _data.options.colors.base)
                _data.ref[name].default_attr['fill'] = _data.options.colors.base;


            if(_item.attr('stroke'))
                _data.ref[name].default_attr['stroke'] = _item.attr('stroke');

                
            if(_item.attr('stroke-width'))
                _data.ref[name].default_attr['stroke-width'] = parseFloat(_item.attr('stroke-width'));

            if(_data.ref[name].default_attr['stroke'] && _data.ref[name].default_attr['stroke'] != 'none' && _data.options.colors.stroke)
                    _data.ref[name].default_attr['stroke'] = _data.options.colors.stroke;
                    
            if(_data.ref[name].default_attr['stroke-width'] && _data.options.strokeWidth)
                    _data.ref[name].default_attr['stroke-width'] = parseFloat(_data.options.strokeWidth);

            _data.ref[name].selected_attr = {};
            _data.ref[name].hover_attr = {};

            // Set cursor
            if(_data.ref[name].disabled){
                _data.ref[name].default_attr.cursor = 'default';
                $(_data.ref[name].node).css({'pointer-events' :'none'});
            }else{
                _data.ref[name].default_attr.cursor = _data.options.cursor;
            }

            if(_data.options.regions[name]){
                // Set attributes (colors, href, etc..)
                if(_data.options.regions[name].attr)
                    _data.ref[name].default_attr = $.extend(true, {}, _data.ref[name].default_attr, _data.options.regions[name].attr);
                // Set tooltip
                if(_data.options.regions[name].tooltip)
                    _data.ref[name].tooltip = _data.options.regions[name].tooltip;
                // Set popover
                if(_data.options.regions[name].popover)
                    _data.ref[name].popover = _data.options.regions[name].popover;
                // Add custom data
                if(_data.options.regions[name].data)
                    _data.ref[name].data(options.regions[name].data);
            }

            if(_this.isNumber(_data.options.colors.selected))                
                _data.ref[name].selected_attr['fill'] = _this.lighten(_data.ref[name].default_attr.fill, parseFloat(_data.options.colors.selected));
            else
                _data.ref[name].selected_attr['fill'] = _data.options.colors.selected;                

            if(_this.isNumber(_data.options.colors.hover))
                _data.ref[name].hover_attr['fill'] = _this.lighten(_data.ref[name].default_attr.fill, parseFloat(_data.options.colors.hover));                
            else
                _data.ref[name].hover_attr['fill'] = _data.options.colors.hover;
                



            // If stroke is dashed, convert it to simple: - - - - -
            var dash = _item.attr('stroke-dasharray');
            if( dash && dash!='none')
                _data.ref[name].default_attr['stroke-dasharray'] = '--';

            _data.ref[name].attr(_data.ref[name].default_attr);

            // Make stroke-width always the same:
            if(!_browser.ie && !_browser.firefox)
                $(_data.ref[name].node).css({'vector-effect' : 'non-scaling-stroke'});

            // Add region to Raphael.set()
            _data.RMap.push(_data.ref[name]);

            // Should we select the region now?
            if(_data.options.regions[name] && _data.options.regions[name].selected)
                _this.selectRegion(name);
        },

        /** Lighten / Darken color
         *  Taken from http://stackoverflow.com/questions/801406/c-create-a-lighter-darker-color-based-on-a-system-color/801463#801463
         */

        lighten2: function(hexColor, factor){
                var h = (hexColor.charAt(0)=="#") ? hexColor.substring(1,7) : hexColor;
                var hsb = Raphael.rgb2hsb(parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16),parseInt(h.substring(4,6),16));
                hsb.b += .1;
                return Raphael.hsb(hsb);
        },
        lighten: function ( hexColor, delta ){

            if(!hexColor) return false;

            delta = parseInt(delta)*0.008;

            var rgb = Raphael.getRGB(hexColor);
            var hsb = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);

            var b   = hsb.b + delta;

            if(b >= 1){
                b = 1;
                hsb.s = hsb.s - delta*1.5;
            }else if (b <= 0){
                b = 0;
            }

            var new_rgb = Raphael.hsb2rgb(hsb.h, hsb.s, b);

            return new_rgb.hex;

        },
        setPan : function(on){
            if(on){
                _data.options.pan = true;
                _data.$map.on('mousedown', _this.panStart);
            }else{
                if(_data.options.pan)
                  _data.$map.off('mousedown', _this.panStart);
                _data.options.pan = false;
            }
        },
        markAddClickHandler : function(e){
            // Don't add marker if marker was clicked
            if($(e.target).is('image')) return false;
            var x = e.offsetX == undefined ? e.layerX : e.offsetX;
            var y = e.offsetY == undefined ? e.layerY : e.offsetY;
            _this.markAdd({xy: [x, y]}, true);
        },
        markEventHandlersSet : function(on, mark){

            on = _this.parseBoolean(on);

            if(on){
                if(_data.options.editMode === false)
                    mark.unhover();
                mark.drag(_this.markMove, _this.markMoveStart, _this.markMoveEnd);

            }else{
                if(_data.options.editMode)
                    mark.undrag();

                mark.hover(
                     function(){
                        if(this.data('tooltip')){
                            _data.mapTip.html( this.data('tooltip') );
                            _data.mapTip.show();
                        }
                     },
                     function(){
                        if(this.data('tooltip'))
                            _data.mapTip.hide();
                });

            }
        },
        setMarksEditMode : function(on, mark){

            on = _this.parseBoolean(on);

            if(on){
                _data.$map.on('click',_this.markAddClickHandler);
            }else{
                _data.$map.off('click',_this.markAddClickHandler);
            }

            _data.options.editMode = on;
        },
        setZoom : function (on){
            if(on){
                _data.options.zoom = true;
                _data.$map.bind('mousewheel.mapsvg',function(event, delta, deltaX, deltaY) {
                    var d = delta > 0 ? 1 : -1;
                    _this.zoom(d);
                    return false;
                });

                // Add zoom buttons
                if(_data.options.zoomButtons.show){

                    var buttons = $('<div></div>');

                    var cssBtn = {'border-radius': '3px', 'display': 'block', 'margin-bottom': '7px'};

                    var btnZoomIn = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhElEQVR4nJWTT4rqQBDGf92pSEJWmYfgQpABb+EB1NU8DyBe5M1q5iKStTCDd/AWggElC3EQJAQxbb/NJDH+mccraEh31fdVfR8pBRBF0Uuapn+AX8CZn0MDuyAI3sfj8aeaTqcvWZZ9XFdZazmdTgC4rotS6oYpCILfkmXZ6yNwt9tFKcVyucRxnBuSNE1fNfB0TWCModlsMhwOGQwGdDod8jy/J+dJP9JsjKl9W2vvlZ3lcuyiS57ntY7FvZDgum6Zk0vN7XYbay3GGMIwLItarRbGGEQErTVxHON5XkVQAEaj0b0x6fV6tXsURRwOBxzHQd9F/CPO58o2ARARdrsds9ms9CIMQ/r9PgCLxYL1eo3rulhr2e/3dQkAnueRJElp2vF4LLskScJmsynNK8A1AqjcVUohUqVEBBGpuV+E/j63CV093/sLizIBvoDny1fHcdhut8znc5RSrFar2kQX8aV933+7ZldK0Wg0iOO4BD9YpjcF8L2R/7XOvu+/TyaTz79+UqnWsVHWHAAAAABJRU5ErkJggg==" id="btnZoomIn"/>').on('click', function(e){
                        e.stopPropagation();
                        _this.zoomIn();
                    }).css(cssBtn);

                    var btnZoomOut = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6klEQVR4nKWTPW6DQBBG3w4RaLXSFs4puAe9fQHEReLKPgYN4gLxQei5RNytFraANNEKKwk29uum+N78SKMA2rbdO+c+gHdgYh0Bvowx57IsL6ppmr33/vNO6E+MMQfx3h+fCQM4544C7J4VADvh/s5rTG/LKoTANK37RIQ0TWMdBSEE8jwnyzLmef437L2n7/soiQLnHEVRPDR313VRIA8lVogTWGup6/pmhSRJAFBKxcAwDFhrfwuSJCGEwDiOqx2VUlF8I1h23ILw2h1EgOsLgqtorU/LI23BGHNSAD8fuemdtdbnqqou39SbTK6RdYDsAAAAAElFTkSuQmCC" id="btnZoomOut"/>').on('click', function(e){
                        e.stopPropagation();
                        _this.zoomOut();
                    }).css(cssBtn);

                    buttons.append(btnZoomOut).append(btnZoomIn).css({position: 'absolute', top: '15px', width: '16px', cursor: 'pointer'});

                    if(_data.options.zoomButtons.location == 'right')
                        buttons.css({'right': '15px'});
                    else if(_data.options.zoomButtons.location == 'left')
                        buttons.css({'left': '15px'});

                    _data.zoomButtons = buttons;

                    _data.$map.append(_data.zoomButtons);
                }

            }else{
                if(_data.options.zoom)
                    _data.$map.unbind('mousewheel.mapsvg');
                if(_data.zoomButtons)
                    _data.zoomButtons.hide();
                _data.options.zoom = false;
            }
        },
        setSize : function( width, height, responsive ){

            // Convert strings to numbers
            _data.options.width      = parseInt(width);
            _data.options.height     = parseInt(height);
            _data.options.responsive = _this.parseBoolean(responsive);

            // Calculate width and height
            if ((!_data.options.width && !_data.options.height)){
                _data.options.width	 = _data.svgDefault.width;
                _data.options.height = _data.svgDefault.height;
            }else if (!_data.options.width && _data.options.height){
            	_data.options.width	 = parseInt(_data.options.height * _data.svgDefault.width / _data.svgDefault.height);
            }else if (_data.options.width && !_data.options.height){
            	_data.options.height = parseInt(_data.options.width * _data.svgDefault.height/_data.svgDefault.width);
            }

            if(_data.options.responsive){
                var maxWidth  = _data.options.width;
                var maxHeight = _data.options.height;
                _data.options.width	 = _data.svgDefault.width;
                _data.options.height = _data.svgDefault.height;
            }

            _data.whRatio      = _data.options.width / _data.options.height;
            _data.scale        = _this.getScale();

            if(_data.options.responsive){

                _data.$map.css({
                    'max-width': maxWidth+'px',
                    'max-height': maxHeight+'px',
                    'width': 'auto',
                    'height': 'auto',
                    'position': 'relative'
                }).height(_data.$map.width()  / _data.whRatio);

                $(window).bind('resize.mapsvg', function(){
                    _data.$map.height(_data.$map.width() / _data.whRatio);
                });
            }else{
                _data.$map.css({
                    'width': _data.options.width+'px',
                    'height': _data.options.height+'px',
                    'max-width': 'none',
                    'max-height': 'none',
                    'position': 'relative'
                });
                $(window).unbind('resize.mapsvg');
            }

            if(!_data.options.responsive && _data.R)
                _data.R.setSize(_data.options.width, _data.options.height);

            return [_data.options.width, _data.options.height];


        },
        // Adding marks
        setMarks : function (marksArr){
            if(marksArr){
                $.each(marksArr, function(i, mark){
                        _this.markAdd(mark);
                });
            }
        },

        // Show tooltip (this function will be defined later in setTooltip method)
        showTip : function(){},
        showPopover : function(){},
        // Hide tooltip
        hideTip : function (){
            _data.mapTip.hide();
            _data.mapTip.html('');
        },
        // Set tooltip behaviour
        setTooltip : function (mode){

            // Add tooltip container
            _data.mapTip = $('<div class="map_tooltip"></div>');
            $("body").append(_data.mapTip);

            _data.mapTip.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #eee',
               'padding': '4px 7px',
               'max-width': '600px'
            });

            if(_data.options.tooltips.show == 'hover'){
                _data.$map.mousemove(function(e) {
                    _data.mapTip.css('left', e.clientX + $(window).scrollLeft()).css('top', e.clientY + $(window).scrollTop() + 30);
                });
            }

            _this.showTip = (_data.options.tooltipsMode == 'custom' ?
                function (name){
                    if(_data.ref[name].tooltip){
                        _data.mapTip.html(_data.ref[name].tooltip);
                        _data.mapTip.show();
                    }
                }: _data.options.tooltipsMode == 'names' ?
                function (name){
                        if(_data.ref[name].disabled) return false;
                        _data.mapTip.html(name.replace(/_/g, ' '));
                        _data.mapTip.show();
                }: _data.options.tooltipsMode == 'combined' ?
                function (name){
                    if(_data.ref[name].tooltip){
                        _data.mapTip.html(_data.ref[name].tooltip);
                        _data.mapTip.show();
                    }else{
                        if(_data.ref[name].disabled) return false;
                        _data.mapTip.html(name.replace(/_/g, ' '));
                        _data.mapTip.show();
                    }
                }: function(name){null;}
            );

        },
        // Set popover behaviour
        setPopover : function (on){

            if(!on) return false;

            // Add tooltip container
            $("body").prepend('<div class="map_popover"><div class="map_popover_content"></div><div class="map_popover_close">x</div></div>');

            _data.mapPopover = $('.map_popover');

            var popoverClose = _data.mapPopover.find('.map_popover_close');


            _data.mapPopover.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'width': _data.options.popover.width+(_data.options.popover.width=='auto'? '': 'px'),
               'height': _data.options.popover.height+(_data.options.popover.height=='auto'? '': 'px'),
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #ccc',
               'padding': '12px',
               '-webkit-box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)',
               'box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)'

            });

            popoverClose.css({
                'position': 'absolute',
                'top': '0',
                'right' : '5px',
                'cursor': 'pointer',
                'color': '#aaa',
                'z-index' : '1200'

            });

            _this.showPopover = function (e, content, pos){

                                    if (!pos || pos.length != 2){
                                        var m   = mouseCoords(e);
                                        var pos = [m.x, m.y];
                                    }

                                    if(content){
                                        _data.mapPopover.find('.map_popover_content').html(content);
                                        var nx = pos[0] - _data.mapPopover.outerWidth(false)/2;
                                        var ny = pos[1] - _data.mapPopover.outerHeight(false) - 7;
                                        if(nx<0) nx = 0;
                                        if(ny<0) ny = 0;

                                        if(nx+_data.mapPopover.outerWidth(false) > $(window).scrollLeft() + $(window).width()) nx = ($(window).scrollLeft() + $(window).width()) - _data.mapPopover.outerWidth(false);
                                        if(ny+_data.mapPopover.outerHeight(false) > $(window).scrollTop() + $(window).height()) ny = ($(window).scrollTop() + $(window).height()) - _data.mapPopover.outerHeight(false);
                                        if(nx < $(window).scrollLeft()) nx = $(window).scrollLeft();
                                        if(ny < $(window).scrollTop()) ny = $(window).scrollTop();

                                        _data.mapPopover.css('left', nx).css('top', ny);
                                        _data.mapPopover.show();

                                    }
                                  };
            _this.hidePopover = function(){

                _data.mapPopover.find('.map_popover_content').html('');
                _data.mapPopover.hide();

            };

            popoverClose.on('click', _this.hidePopover);

        },
        popoverOffHandler : function(e){
            if(!$(e.target).closest('#map_popover').length)
                _this.hidePopover();
        },
        isNumber : function (n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        },
        parseBoolean : function (string) {
          switch (String(string).toLowerCase()) {
            case "true":
            case "1":
            case "yes":
            case "y":
              return true;
            case "false":
            case "0":
            case "no":
            case "n":
              return false;
            default:
              return undefined;
          }
        },
        mouseOverHandler : function(){},
        mouseOutHandler : function(){},
        mouseDownHandler : function(){},
        // INIT
        init    : function(opts, elem) {

            if(!opts.source) {
                alert('mapSVG Error: Please provide a map URL');
                return false;
            }

            // Cut protocol (http: || https:) - to avoid "cross-domain" error
            if(opts.source.indexOf('http://') == 0 || opts.source.indexOf('https://') == 0)
                opts.source = "//"+opts.source.split("://").pop();

            opts.pan  = _this.parseBoolean(opts.pan);
            opts.zoom = _this.parseBoolean(opts.zoom);
            opts.responsive  = _this.parseBoolean(opts.responsive);
            opts.disableAll  = _this.parseBoolean(opts.disableAll);
            opts.multiSelect = _this.parseBoolean(opts.multiSelect);

            // If veiwBox is set as string region's name (or country name)
            // then we'll calculate veiwBox parameters later
            if(opts.viewBox && typeof opts.viewBox == 'string'){
                opts.viewBoxFind = opts.viewBox;
                delete opts.viewBox;
            }

            /** Setting _data **/
            _data  = {};

            _data.options = $.extend(true, {}, defaults, opts);

            _data.map  = elem;
            _data.$map = $(elem);
            _data.whRatio = 0;
            _data.isPanning = false;
            //_data.showTip = {};
            _data.markOptions = {};
            _data.svgDefault = {};
            _data.mouseDownHandler;
            _data.ref = {};
            _data.refLength = 0;

            _data.scale  = 1;         // absolute scale
            _data._scale = 1;         // relative scale starting from current zoom level

            _data.selected_id   =  _data.options.multiSelect ? [] : 0;
            _data.mapData       = {};
            _data.ref           = {};
            _data.marks         = [];
            _data._viewBox      = []; // initial viewBox
            _data.viewBox       = []; // current viewBox
            _data.viewBoxZoom   = [];
            _data.viewBoxFind   = undefined;
            _data.zoomLevel     = 0;
            _data.pan           = {};
            _data.zoom;
            _data.touchZoomStart;
            _data.touchZoomStartViewBox;
            _data.touchZoomEnd;
            /****/


            // Set background
            _data.$map.css({
                             'background': _data.options.colors.background,
                             'height': '100px',
                             'position' : 'relative'
                           });

            var loading = $('<div>'+_data.options.loadingText+'</div>').css({
                position: 'absolute',
                top:  '50%',
                left: '50%',
                'z-index': 1,
                padding: '7px 10px',
                'border-radius': '5px',
                '-webkit-border-radius': '5px',
                '-moz-border-radius': '5px',
                '-ms-border-radius': '5px',
                '-o-border-radius': '5px',
                'border': '1px solid #ccc',
                background: '#f5f5f2',
                color: '#999'
            });

            _data.$map.append(loading);

            loading.css({
                'margin-left': function () {
                    return -($(this).outerWidth(false) / 2)+'px';
                },
                'margin-top': function () {
                    return -($(this).outerHeight(false) / 2)+'px';
                }
            });


            // GET the map by ajax request
            $.ajax({
                url: _data.options.source,
                contentType: "image/svg+xml; charset=utf-8",
                //dataType: (_browser.ie) ? 'text' : 'xml', // check if IE
                beforeSend: function(x) {
                        if(x && x.overrideMimeType) {
                            x.overrideMimeType("image/svg+xml; charset=utf-8");
                        }
                    },
                success:  function(xmlData){

                    $data = $(xmlData);

                    // Default width/height/viewBox from SVG
                    var svgTag               = $data.find('svg');
                    _data.svgDefault.width   = parseFloat(svgTag.attr('width').replace(/px/g,''));
                    _data.svgDefault.height  = parseFloat(svgTag.attr('height').replace(/px/g,''));
                    _data.svgDefault.viewBox = svgTag.attr('viewBox') ? svgTag.attr('viewBox').split(' ') : [0,0, _data.svgDefault.width, _data.svgDefault.height];

                    $.each(_data.svgDefault.viewBox, function(i,v){
                        _data.svgDefault.viewBox[i] = parseInt(v);
                    });

                    _data._viewBox  = (_data.options.viewBox.length==4) ? _data.options.viewBox : _data.svgDefault.viewBox;

                    $.each(_data._viewBox, function(i,v){
                        _data._viewBox[i] = parseInt(v);
                    });


                    // Set size
                    _this.setSize(_data.options.width, _data.options.height, _data.options.responsive);

                    // Attach Raphael to given jQuery element

                    // IE 7&8 doesn't support responsive size so we just set
                    // width and height in pixels, and then resize it on window.resize event.
                    // For all other cool browsers we just set width and height
                    // to 100% to simply fit DIV container.
                    if(_browser.ie && _browser.ie.old){

                        _data.R = Raphael(_data.$map.attr('id'), _data.options.width, _data.options.height);
                        _data.scale = _this.getScale();

                        if(_data.options.responsive)
                            $(window).on('resize', _this.fluidResize);

                    }else{
                        _data.R = Raphael(_data.$map.attr('id'), '100%', '100%');

                        if(_data.options.responsive){
                            $(window).on('resize', function(e){
                                _data.scale = _this.getScale();
                                _this.marksAdjustPosition();
                            });
                        }
                    }

                    // Adding moving sticky draggable image on background
                    if(_data.options.panBackground)
                        _data.background = _data.R.rect(_data.svgDefault.viewBox[0],_data.svgDefault.viewBox[1],_data.svgDefault.viewBox[2],_data.svgDefault.viewBox[3]).attr({fill: _data.options.colors.background});

                	_data.RMap     = _data.R.set();
                    _data.RMarks   = _data.R.set();

                    // Render each SVG element
                    
                    var parse = function(_item, parentTransform, parentStyle){
                        var type = $(_item).get(0).tagName;
                        
                        switch (type){
                            case 'path':
                                _this.renderSVGPath(_item, parentTransform, parentStyle);
                                break;
                            case 'polygon':
                                _this.renderSVGPolygon(_item, parentTransform, parentStyle);
                                break;
                            case 'polyline':
                                _this.renderSVGPolyline(_item, parentTransform, parentStyle);
                                break;
                            case 'circle':
                                _this.renderSVGCircle(_item, parentTransform, parentStyle);
                                break;
                            case 'ellipse':
                                _this.renderSVGEllipse(_item, parentTransform, parentStyle);
                                break;
                            case 'rect':                            
                                _this.renderSVGRect(_item, parentTransform, parentStyle);
                                break;
                            case 'image':
                                _this.renderSVGImage(_item, parentTransform, parentStyle);
                                break;
                            case 'text':                                
                                _this.renderSVGText(_item, parentTransform, parentStyle);
                                break;
                            default:
                                null;
                                break;
                        }                        
                    };                 
                    
                    var traverse = function (node, parentTransformString, parentStyle){
                        
                        var children = $(node).children();
                        
                        if (children.length){// && !$(node).is('text')) {
                            
                            var nodes = [];
                            
                            parentTransformString = parentTransformString || "";
                            parentTransformString = _this.transformSVG2Raphael(node) + parentTransformString;
                            parentStyle = parentStyle || {};
                            
                            $(node).children().each(function(i,n){
                              var _parentStyle = _this.styleSVG2Raphael(n, parentStyle);
                              traverse($(n), parentTransformString, _parentStyle);
                            });
                            
                        }// else{                
                            parse($(node), parentTransformString, parentStyle);
                        //} 
                            
                    };
                    
                    traverse($data.find('svg'));
                    
                    // Set viewBox
                    var v = _data.options.viewBoxFind || _data._viewBox;
                    _this.setViewBox(v);

                    // If there are markers, put them to the map
                    _this.setMarks(_data.options.marks);
                    _this.setMarksEditMode(_data.options.editMode);

                    // Set panning
                    _this.setPan(_data.options.pan);

                    // Set zooming by mouswheel
                    _this.setZoom(_data.options.zoom);

                    // Set tooltips
                    _this.setTooltip(_data.options.tooltips.mode);

                    // Set popovers
                    _this.setPopover(_data.options.popover);


                    if(_data.options.responsive && _browser.ie && _browser.ie.old)
                        _this.fluidResize();


                    if((_browser.ie && !_browser.ie.old) || _browser.firefox)
                            _this.mapAdjustStrokes();


                    //Create event handlers
                    var funcStr = '';

                    /*
                     * Now let's add event handlers.
                     * Please note that we don't need mouseOver / mouseOut on mobile devices (iPad etc..)
                     */
                    if(!touchDevice){
                        // 1. MouseOver
                        funcStr = 'methods.highlightRegion(this.name);';
                        if(_data.options.tooltips.show == 'hover')
                            funcStr += 'methods.showTip(this.name);';
                        if(_data.options.mouseOver)
                            funcStr += 'return options.mouseOver.call(this, e, methods);';

                        _this.mouseOverHandler = new Function('e, methods, options', funcStr);

                        // 2. MouseOut
                        funcStr = '';
                        funcStr += 'methods.unhighlightRegion(this.name);';
                        if(_data.options.tooltips.show == 'hover')
                            funcStr += 'methods.hideTip();';
                        if(_data.options.mouseOut)
                            funcStr += 'return options.mouseOut.call(this, e, methods);';
                        _this.mouseOutHandler = new Function('e, methods, options', funcStr);
                    }

                    // 3. MouseDown
                    funcStr = '';
                    funcStr = 'methods.regionClickHandler.call(mapObj, e, this);';
                    _this.mouseDownHandler = new Function('e, methods', funcStr);


                    /* EVENTS */
                    if(!touchDevice){
                    	_data.RMap
                            .mouseover( function(e){_this.mouseOverHandler.call(this, e, _this, options);} )
                            .mouseout(  function(e){_this.mouseOutHandler.call(this, e, _this, options);} );
                    }

                    if(!_data.options.pan){
                        _data.RMap.mousedown( function(e){
                            //_this.mouseDownHandler.call(this, e, methods);}
                            _this.regionClickHandler.call(_this, e, this);
                         });
                        _data.RMap.touchstart(
                            function(e){
                                e.preventDefault();
                                _this.regionClickHandler.call(_this, e, this);
                            }
                        );
                    }else{
                        if(!touchDevice){
                            _data.RMap.mousedown( function(e){
                                // While panning we just remember which region was clicked
                                // by panRegionClickHandler method, and then trigger
                                // regionClickHandler on that region when panning finishes
                                e.preventDefault();

                                _this.panRegionClickHandler.call(_this, e, this);
                            });
                        }else{
                            _data.RMap.touchstart(
                                function(e){
                                    _this.panRegionClickHandler.call(_this, e, this);
                                }
                            );
                            _data.R.canvas.addEventListener('touchstart', function(e) {
                                _this.touchStart(e);
                            }, false);
                            _data.R.canvas.addEventListener('touchmove', function(e) {
                                _this.touchMove(e);
                            }, false);
                            _data.R.canvas.addEventListener('touchend', function(e) {
                                _this.touchEnd(e);
                            }, false);
                        }
                    }
                    loading.hide();
                    } // end of AJAX callback
                });// end of AJAX



        return _this;

        } // end of init

   }; // end of methods

   var _this = this.methods;

  }; // end of mapSVG class


  /** $.FN **/
  $.fn.mapSvg = function( opts ) {

    var id = $(this).attr('id');

    if(typeof opts == 'object' && instances[id] === undefined){
        instances[id] = new mapSVG(this, opts);
        return instances[id].methods.init(opts, this);
    }else if(instances[id]){
        return instances[id].methods;
    }else{
        return $(this);
    }

  }; // end of $.fn.mapSvg

})( jQuery );
$(document).ready(function() {
	var currentLocation = [geoip_latitude(), geoip_longitude()];

	$('#map').mapSvg({
	    source: "/assets/australia.svg",    // Path to SVG map
	    colors: {
	                base: "#730D45",
	                background: "#fff",
	                hover: "#F27405",
	                selected: "#FA1451",
	                disabled: "#ffffff",
	                stroke: "#FA1451"
	            },
	    regions :    {
	           'QLD':  {tooltip: 'QLD Population: 2 384 179', attr: {href: '/qld'}, selected: true},
	           'NSW': {tooltip: 'NSW Population: 4 009 318'},
	           'NT': {tooltip: 'NT Population: 327 152'},
	           'ACT': {tooltip: 'ACT Population: 327 152'},
	           'TAS': {tooltip: 'TAS Population: 327 152'},
	           'SA': {tooltip: 'SA Population: 979 949'},
	           'VIC': {tooltip: 'VIC Population: 3 180 184'},
	           'WA': {tooltip: 'WA Population: 1 204 001',popover: ' Brazil is the largest country in South America.' }
	          },
	  marks:     [
	            { c: currentLocation,
	             tooltip: 'You are here!'
	                +geoip_city()+''
	                +geoip_country_name()+''
	                +'Coordinates: '+currentLocation
	            }],
	    tooltipsMode:    'custom',
	    zoom: 1,
	    pan: 1,
	    responsive: 1
	});
});
/**
* @preserve CanvasJS v1.3.0 Beta 3 - http://canvasjs.com/ 
* Copyright 2013 fenopix
*/

/*
* CanvasJS follows Dual Licensing Model as mentioned below. 
* 
* ---------------------Free for Non-Commercial Use--------------------
* 
* For non-commercial purposes you can use the software for free under Creative Commons Attribution-NonCommercial 3.0 License. Refer to the following link for further details on the same.
*     http://creativecommons.org/licenses/by-nc/3.0/deed.en_US
* 
* ---------------------Commercial License--------------------
* Commercial use of CanvasJS requires you to purchase a license. Without a commercial license you can use it for evaluation purposes only. Please refer to the following link for further details.
*     http://canvasjs.com/
* 
*/

/* jshint -W099 */ //Ignore warning "Mixed Spaces and Tabs"

(function () {

	var isDebugMode = false;

	var isCanvasSupported = !!document.createElement("canvas").getContext;
	//isCanvasSupported = false;

	//Default values for all Chart Elements that can be set by the user. CanvasJSObject.setOptions looks into this while setting the default/user-defined values.
	var defaultOptions = {
		Chart: {
			width: 500,
			height: 400,
			zoomEnabled: false,
			backgroundColor: "white",
			theme: "theme1",
			animationEnabled: isCanvasSupported ? true : false,
			colorSet: "colorSet1",
			culture: "en"
		},

		CultureInfo: {
			decimalSeparator: ".",
			digitGroupSeparator: ",",
			zoomText: "Zoom",
			panText: "Pan",
			resetText: "Reset",
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		},

		Title: {
			padding: 0,
			text: null,
			verticalAlign: "top",//top, center, bottom
			horizontalAlign: "center",//left, center, right
			fontSize: 20,//in pixels
			fontFamily: "Armata",
			fontWeight: "normal", //normal, bold, bolder, lighter,
			fontColor: "#FA1451",
			fontStyle: "normal", // normal, italic, oblique

			borderThickness: 0,
			borderColor: "black",
			cornerRadius: 0,
			backgroundColor: null,
			margin: 5
			//toolTipContent: null//string - To be implemented (TBI)
		},
		DataSeries: {
			name: null,
			dataPoints: null,
			label: "",
			bevelEnabled: false,

			cursor: null,

			indexLabel: "",
			indexLabelPlacement: "outside",  //inside, outside       
			indexLabelOrientation: "horizontal",
			indexLabelFontColor: "#FA1451",
			indexLabelFontSize: 12,
			indexLabelFontStyle: "normal", //   italic ,oblique, normal 
			indexLabelFontFamily: "Armata", 	// fx: Arial Verdana "Courier New" Serif 
			indexLabelFontWeight: "normal", 	// bold ,bolder, lighter, normal 
			indexLabelBackgroundColor: null,
			indexLabelLineColor: "#808080",
			indexLabelLineThickness: 1,

			lineThickness: 2,

			color: null,

			startAngle: 0,

			type: "column", //line, column, bar, area, scatter stackedColumn, stackedBar, stackedArea, stackedColumn100, stackedBar100, stackedArea100, pie, doughnut
			xValueType: "number", //number, dateTime
			axisYType: "primary",

			xValueFormatString: null,
			yValueFormatString: null,

			showInLegend: null,
			legendMarkerType: null,
			legendMarkerColor: null,
			legendText: null,

			markerType: "circle", //none, circle, square, cross, triangle, line
			markerColor: null,
			markerSize: null,
			markerBorderColor: null,
			markerBorderThickness: null,
			//animationEnabled: true,
			mouseover: null,
			mouseout: null,
			mousemove: null,
			click: null,
			toolTipContent: null
		},

		Axis: {
			minimum: null, //Minimum value to be shown on the Axis
			maximum: null, //Minimum value to be shown on the Axis
			interval: null, // Interval for tick marks and grid lines
			intervalType: null, //number, millisecond, second, minute, hour, day, month, year

			title: null, // string
			titleFontColor: "black",
			titleFontSize: 20,
			titleFontFamily: "arial",
			titleFontWeight: "normal",
			titleFontStyle: "normal",

			labelAngle: 0,
			labelFontFamily: "arial",
			labelFontColor: "black",
			labelFontSize: 12,
			labelFontWeight: "normal",
			labelFontStyle: "normal",
			labelAutoFit: false,
			labelWrap: true,
			labelMaxWidth: null,//null for auto

			prefix: "",
			suffix: "",

			includeZero: true, //Applies only for axisY. Ignored in axisX.

			tickLength: 5,
			tickColor: "black",
			tickThickness: 1,

			lineColor: "black",
			lineThickness: 1,

			gridColor: "A0A0A0",
			gridThickness: 0,

			interlacedColor: null,

			valueFormatString: null,

			margin: 2
		},

		Legend: {
			name: null,
			borderThickness: 0,
			borderColor: "black",
			cornerRadius: 0,
			verticalAlign: "center",
			horizontalAlign: "right",
			//dockInsidePlotArea: false,

			fontSize: 14,//in pixels
			fontFamily: "Calibri",
			fontWeight: "normal", //normal, bold, bolder, lighter,
			fontColor: "black",
			fontStyle: "normal" // normal, italic, oblique
		},

		ToolTip: {
			enabled: true,
			borderColor: null,
			shared: false,
			animationEnabled: true,
			content: null
		},

		//Private
		TextBlock: {
			x: 0,
			y: 0,
			width: null,//read only
			height: null,//read only
			maxWidth: null,
			maxHeight: null,
			padding: 0,
			angle: 0,
			text: "",
			horizontalAlign: "center",//left, center, right
			fontSize: 12,//in pixels
			fontFamily: "Calibri",
			fontWeight: "normal", //normal, bold, bolder, lighter,
			fontColor: "black",
			fontStyle: "normal", // normal, italic, oblique

			borderThickness: 0,
			borderColor: "black",
			cornerRadius: 0,
			backgroundColor: null,
			textBaseline: "top"
		}
	}

	//#region Cultures

	var cultures = {
		"en": {
			//Derives from the default options
		}//,
		//"es": {
		//    decimalSeparator: ",",
		//    digitGroupSeparator: ".",
		//    zoomText: "zoom",
		//    panText: "pan",
		//    resetText: "reset",
		//    days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
		//}
	}

	//#endregion Cultures

	//#region Themes

	var colorSets = {

		"colorSet1": [
			"#006FB9",
			"#CB0F32",
			"#000",
			//"#96C412",
			"#F27405",
			"#A2D1CF",
			//"#D8C641",
			"#C8B631",
			"#6DBCEB",
			//"#4A4946",
			"#52514E",
			"#4F81BC",
			"#A064A1",
			"#F79647"
		],
		"colorSet2": [
			"#4F81BC",
			"#C0504E",
			"#9BBB58",
			"#23BFAA",
			//"#FAA586",
			"#8064A1",
			"#4AACC5",
			"#F79647"
			//"#FFC000",
			//"#7F6084"
		],
		"colorSet3": [
			"#8CA1BC",
			"#36845C",
			"#017E82",
			"#8CB9D0",
			"#708C98",
			"#94838D",
			"#F08891",
			"#0366A7",
			"#008276",
			"#EE7757",
			"#E5BA3A",
			"#F2990B",
			"#03557B",
			"#782970"
		]//,
		//"colorSet4": [
		//    "#3698C5",
		//    "#009B8D",
		//    "#F1D691",
		//    "#F8B90C",
		//    "#0081B8",
		//    "#5B5A96",
		//    "#ACBDD1",
		//    "#88A891",
		//    "#39969D",
		//    "#AECEDD",
		//    "#A0B2BC",
		//    "#BBAEB7",
		//    "#A0C65F",
		//    "#EEA6AA",
		//    "#3798C5"
		//],
		//"colorSet5": [
		//    "#88ADBF",
		//    "#84C336",
		//    "#7B91C3",
		//    "#4661EE",
		//    "#EC5657",
		//    "#1BCDD1",
		//    "#8FAABB",
		//    "#B08BEB",
		//    "#3EA0DD",
		//    "#F5A52A",
		//    "#23BFAA",
		//    "#FAA586",
		//    "#EB8CC6"
		//]

	};

	var themes =
		{
			"theme1": {
				Chart:
					{
						colorSet: colorSets[0]
					},
				Title: {
					fontFamily: "Calibri, Optima, Candara, Verdana, Geneva, sans-serif", fontSize: 33,
					fontColor: "#3A3A3A",
					fontWeight: "bold",
					verticalAlign: "top",
					margin: 10
				},
				Axis: {
					titleFontSize: 26,
					//titleFontColor: "rgb(98,98,98)",
					titleFontColor: "#666666",
					//titleFontFamily: "arial black",
					//titleFontFamily: "Verdana, Geneva, Calibri, sans-serif",
					titleFontFamily: "Calibri, Optima, Candara, Verdana, Geneva, sans-serif",
					//titleFontWeight: "bold",

					//labelFontFamily: "Times New Roman, Times, serif",
					labelFontFamily: "Calibri, Optima, Candara, Verdana, Geneva, sans-serif",
					//labelFontFamily: "Helvetica Neue, Helvetica",
					labelFontSize: 18,
					labelFontColor: "grey",
					//labelFontWeight: "bold",
					tickColor: "#BBBBBB",
					tickThickness: 2,
					gridThickness: 2,
					gridColor: "#BBBBBB",
					lineThickness: 2,
					lineColor: "#BBBBBB"
				},
				Legend: {
					verticalAlign: "bottom",
					horizontalAlign: "center",
					fontFamily: "monospace, sans-serif,arial black"
				},
				DataSeries: {
					//bevelEnabled: true,
					indexLabelFontColor: "grey",
					//indexLabelFontFamily: "Trebuchet MS, monospace, Courier New, Courier",
					indexLabelFontFamily: "Calibri, Optima, Candara, Verdana, Geneva, sans-serif",
					//indexLabelFontWeight: "bold",
					indexLabelFontSize: 18,
					indexLabelLineColor: "lightgrey",
					indexLabelLineThickness: 2
				}
			},

			"theme2": {
				Chart:
					{
						colorSet: "colorSet2"
					},
				Title: {
					fontFamily: "impact, charcoal, arial black, sans-serif", fontSize: 32,//fontColor: "rgb(58,58,58)",
					fontColor: "#333333",
					//fontFamily: "arial black", fontSize: 30,//fontColor: "rgb(58,58,58)",
					//fontFamily: "arial black",
					//fontFamily: "Helvetica Neue, Helvetica", fontSize: 35,// fontColor: "rgb(58,58,58)",
					//fontWeight: "bold",
					verticalAlign: "top",
					margin: 10
				},
				Axis: {
					titleFontSize: 22,
					titleFontColor: "rgb(98,98,98)",
					//titleFontFamily: "arial black",
					titleFontFamily: "monospace, sans-serif,arial black",
					titleFontWeight: "bold",


					labelFontFamily: "monospace, Courier New, Courier",
					//labelFontFamily: "Helvetica Neue, Helvetica",
					labelFontSize: 16,
					labelFontColor: "grey",
					labelFontWeight: "bold",
					tickColor: "grey",
					tickThickness: 2,
					gridThickness: 2,
					gridColor: "grey",
					lineThickness: 0
				},
				Legend: {
					verticalAlign: "bottom",
					horizontalAlign: "center",
					fontFamily: "monospace, sans-serif,arial black"
				},
				DataSeries: {
					indexLabelFontColor: "grey",
					//indexLabelFontFamily: "Trebuchet MS, monospace, Courier New, Courier",
					indexLabelFontFamily: "Courier New, Courier, monospace",
					indexLabelFontWeight: "bold",
					indexLabelFontSize: 18,
					indexLabelLineColor: "lightgrey",
					indexLabelLineThickness: 2
				}
			},

			"theme3": {
				Chart:
					{
						colorSet: "colorSet1"
					},
				Title: {
					//fontFamily: "impact, charcoal, arial black, sans-serif", fontSize: 30,//fontColor: "rgb(58,58,58)",
					//fontFamily: "arial black", fontSize: 30,//fontColor: "rgb(58,58,58)",
					//fontFamily: "arial black",
					fontFamily: "Candara, Optima, Trebuchet MS, Helvetica Neue, Helvetica, Trebuchet MS, serif", fontSize: 32,
					//fontFamily: "Palatino Linotype, Book Antiqua, Palatino, serif", fontSize: 30,
					//fontFamily: "Lucida Sans Unicode, Lucida Grande, Trebuchet MS, sans-serif", fontSize: 30,
					fontColor: "rgb(68,78,58)",
					fontColor: "#3A3A3A",
					fontWeight: "bold",
					verticalAlign: "top",
					margin: 10
				},
				Axis: {
					titleFontSize: 22,
					titleFontColor: "rgb(98,98,98)",
					//titleFontFamily: "arial black",
					titleFontFamily: "Verdana, Geneva, Calibri, sans-serif",
					//titleFontWeight: "bold",

					//labelFontFamily: "Times New Roman, Times, serif",
					labelFontFamily: "Calibri, Optima, Candara, Verdana, Geneva, sans-serif",
					//labelFontFamily: "Helvetica Neue, Helvetica",
					labelFontSize: 18,
					labelFontColor: "grey",
					//labelFontWeight: "bold",
					tickColor: "grey",
					tickThickness: 2,
					gridThickness: 2,
					gridColor: "grey",
					lineThickness: 2,
					lineColor: "grey"
				},
				Legend: {
					verticalAlign: "bottom",
					horizontalAlign: "center",
					fontFamily: "monospace, sans-serif,arial black"
				},
				DataSeries: {
					bevelEnabled: true,
					indexLabelFontColor: "grey",
					//indexLabelFontFamily: "Trebuchet MS, monospace, Courier New, Courier",
					indexLabelFontFamily: "Candara, Optima, Calibri, Verdana, Geneva, sans-serif",
					//indexLabelFontWeight: "bold",
					indexLabelFontSize: 18,
					indexLabelLineColor: "lightgrey",
					indexLabelLineThickness: 2
				}
			}
		}

	//#endregion Themes

	var constants = {
		numberDuration: 1,
		yearDuration: 1000 * 60 * 60 * 24 * 364,
		monthDuration: 1000 * 60 * 60 * 24 * 30,
		weekDuration: 1000 * 60 * 60 * 24 * 7,
		dayDuration: 1000 * 60 * 60 * 24,
		hourDuration: 1000 * 60 * 60,
		minuteDuration: 1000 * 60,
		secondDuration: 1000,
		millisecondDuration: 1,

		dayOfWeekFromInt: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	};

	//#region Static Methods

	function extend(Child, Parent) {
		Child.prototype = inherit(Parent.prototype)
		Child.prototype.constructor = Child
		Child.parent = Parent.prototype
	}

	function inherit(proto) {
		function F() { }
		F.prototype = proto
		return new F
	}

	function addToDateTime(dateTime, num, type) {

		if (type === "millisecond")
			dateTime.setMilliseconds(dateTime.getMilliseconds() + 1 * num);
		else if (type === "second")
			dateTime.setSeconds(dateTime.getSeconds() + 1 * num);
		else if (type === "minute")
			dateTime.setMinutes(dateTime.getMinutes() + 1 * num);
		else if (type === "hour")
			dateTime.setHours(dateTime.getHours() + 1 * num);
		else if (type === "day")
			dateTime.setDate(dateTime.getDate() + 1 * num);
		else if (type === "week")
			dateTime.setDate(dateTime.getDate() + 7 * num);
		else if (type === "month")
			dateTime.setMonth(dateTime.getMonth() + 1 * num);
		else if (type === "year")
			dateTime.setFullYear(dateTime.getFullYear() + 1 * num);

		return dateTime;
	}

	function convertToNumber(num, type) {
		return constants[type + "Duration"] * num;
	}

	function pad(value, length) {
		var isNegative = false;
		if (value < 0) {
			isNegative = true;
			value *= -1;
		}

		value = "" + value;
		length = !length ? 1 : length;

		while (value.length < length) value = "0" + value;

		return isNegative ? "-" + value : value;
	}

	function trimString(str) {
		var str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		while (ws.test(str.charAt(--i))) { };
		return str.slice(0, i + 1);
	}

	function extendCtx(context) {
		context.roundRect = function (x, y, width, height, radius, borderThickness, backgroundColor, borderColor) {
			///<signature>
			///<summary>Creates a rounded rectangle with given fill/stroke parameters</summary>
			///<param name="x" type="number">x value</param>
			///<param name="y" type="number">y value</param>
			///<param name="width" type="number">Border Width</param>
			///<param name="height" type="number">Border Height</param>
			///<param name="radius" type="number">Border CornerRadius</param>
			///<param name="borderThickness" type="number">Border Thickess</param>
			///<param name="backgroundColor" type="number">Background Color</param>
			///<param name="borderColor" type="number">Border Color</param>
			///</signature>

			if (backgroundColor) {
				this.fillStyle = backgroundColor;
			}

			if (borderColor) {
				this.strokeStyle = borderColor
			}

			if (typeof stroke == "undefined") {
				stroke = true;
			}
			if (typeof radius === "undefined") {
				radius = 5;
			}

			this.lineWidth = borderThickness;

			this.beginPath();
			this.moveTo(x + radius, y);
			this.lineTo(x + width - radius, y);
			this.quadraticCurveTo(x + width, y, x + width, y + radius);
			this.lineTo(x + width, y + height - radius);
			this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			this.lineTo(x + radius, y + height);
			this.quadraticCurveTo(x, y + height, x, y + height - radius);
			this.lineTo(x, y + radius);
			this.quadraticCurveTo(x, y, x + radius, y);
			this.closePath();

			if (backgroundColor) {
				this.fill();
			}

			if (borderColor && borderThickness > 0) {
				this.stroke();
			}
		}
	}

	function compareNumbers(a, b) {
		return a - b;
	}

	function compareDataPointX(dataPoint1, dataPoint2) {
		return dataPoint1.x - dataPoint2.x;
	}

	function intToHexColorString(num) {
		var r = ((num & 0xFF0000) >> 16).toString(16);
		var g = ((num & 0x00FF00) >> 8).toString(16);
		var b = ((num & 0x0000FF) >> 0).toString(16);

		r = r.length < 2 ? "0" + r : r;
		g = g.length < 2 ? "0" + g : g;
		b = b.length < 2 ? "0" + b : b;

		return "#" + r + g + b;
	}

	function RGBToInt(r, g, b) {
		var num = (r << 16) | (g << 8) | (b);

		return num;
	}

	function intToRGB(num) {
		var rgb = [];
		var r = ((num & 0xFF0000) >> 16);
		var g = ((num & 0x00FF00) >> 8);
		var b = ((num & 0x0000FF) >> 0);

		//r = r.length < 2 ? "0" + r : r;
		//g = g.length < 2 ? "0" + g : g;
		//b = b.length < 2 ? "0" + b : b;

		rgb[0] = r;
		rgb[1] = g
		rgb[2] = b;

		return rgb;
	}

	//userCapture is optional. Defaults to false
	function addEvent(obj, eventType, fn, useCapture) {
		if (obj.addEventListener) {
			obj.addEventListener(eventType, fn, useCapture || false);
		}
		else if (obj.attachEvent) {
			obj.attachEvent("on" + eventType, function (e) {
				var e = e || window.event;
				e.preventDefault = e.preventDefault || function () { e.returnValue = false }
				e.stopPropagation = e.stopPropagation || function () { e.cancelBubble = true }
				fn.call(obj, e);
			});
		} else
			return false;
	}

	//#region formatting functions/methods
	var dateFormat = function () {
		var reg = /D{1,4}|M{1,4}|Y{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|f{1,3}|t{1,2}|T{1,2}|K|z{1,3}|"[^"]*"|'[^']*'/g;

		var defDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var defShortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		var defMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var defShortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
		var timezoneClip = /[^-+\dA-Z]/g;

		return function (dt, formatString, cultureInfo) {

			var days = cultureInfo ? cultureInfo.days : defDays;
			var months = cultureInfo ? cultureInfo.months : defMonths;

			var shortDays = cultureInfo ? cultureInfo.shortDays : defShortDays;
			var shortMonths = cultureInfo ? cultureInfo.shortMonths : defShortMonths;

			var result = "";
			var utc = false;

			dt = dt && dt.getTime ? dt : dt ? new Date(dt) : new Date;
			if (isNaN(dt)) throw SyntaxError("invalid date");

			if (formatString.slice(0, 4) == "UTC:") {
				formatString = formatString.slice(4);
				utc = true;
			}

			var pre = utc ? "getUTC" : "get";
			var date = dt[pre + "Date"]();
			var day = dt[pre + "Day"]();
			var month = dt[pre + "Month"]();
			var year = dt[pre + "FullYear"]();
			var hours = dt[pre + "Hours"]();
			var minutes = dt[pre + "Minutes"]();
			var seconds = dt[pre + "Seconds"]();
			var milliseconds = dt[pre + "Milliseconds"]();
			var offset = utc ? 0 : dt.getTimezoneOffset();

			result = formatString.replace(reg, function (key) {

				switch (key) {

					case "D":
						return date;
					case "DD":
						return pad(date, 2);
					case "DDD":
						return shortDays[day];
					case "DDDD":
						return days[day];


					case "M":
						return month + 1;
					case "MM":
						return pad(month + 1, 2);
					case "MMM":
						return shortMonths[month];
					case "MMMM":
						return months[month];


					case "Y":
						return parseInt(String(year).slice(-2));
					case "YY":
						return pad(String(year).slice(-2), 2);
					case "YYY":
						return pad(String(year).slice(-3), 3);
					case "YYYY":
						return pad(year, 4);


					case "h":
						return hours % 12 || 12;
					case "hh":
						return pad(hours % 12 || 12, 2);


					case "H":
						return hours;
					case "HH":
						return pad(hours, 2);

					case "m":
						return minutes;
					case "mm":
						return pad(minutes, 2);


					case "s":
						return seconds;
					case "ss":
						return pad(seconds, 2);

					case "f":
						return String(milliseconds).slice(0, 1);
					case "ff":
						return pad(String(milliseconds).slice(0, 2), 2);
					case "fff":
						return pad(String(milliseconds).slice(0, 3), 3);


					case "t":
						return hours < 12 ? "a" : "p";
					case "tt":
						return hours < 12 ? "am" : "pm";
					case "T":
						return hours < 12 ? "A" : "P";
					case "TT":
						return hours < 12 ? "AM" : "PM";


					case "K":
						return utc ? "UTC" : (String(dt).match(timezone) || [""]).pop().replace(timezoneClip, ""); // Time Zone;
					case "z":
						return (offset > 0 ? "-" : "+") + Math.floor(Math.abs(offset) / 60); // Hour Offset from UTC without padding
					case "zz":
						return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60), 2); // Hour Offset from UTC with padding
					case "zzz":
						return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60), 2) + pad(Math.abs(offset) % 60, 2) // Hour and Minute Offset from UTC with padding

					default:
						return key.slice(1, key.length - 1);

				}
			});

			return result;
		}
	}();


	var numberFormat = function (v, fs, cultureInfo) {
		v = Number(v);
		var isNegative = v < 0 ? true : false;
		if (isNegative) v *= -1;

		decimalSeparator = cultureInfo ? cultureInfo.decimalSeparator : ".";
		digitGroupSeparator = cultureInfo ? cultureInfo.digitGroupSeparator : ",";

		var vString = "";
		fs = String(fs);
		var multiplier = 1;
		var temp;
		var result = "";

		var matches = "";
		var decimalPosition = -1;
		var fsBeforeDecimal = [];
		var fsAfterDecimal = [];
		var noPhBeforeDecimal = 0; // Number of Placeholders before Decimal
		var noPhAfterDecimal = 0; // Number of Placeholders after Decimal
		var noComma = 0;
		var multiplier = 1;
		var isScientificNotation = false;
		var exponent = 0;

		var matches = fs.match(/"[^"]*"|'[^']*'|[eE][+-]*[0]+|[,]+[.]|‰|./g);
		//window.console.log(matches + " = " + matches.length);

		for (var i = 0; matches && i < matches.length; i++) {
			var match = matches[i];

			if (match === "." && decimalPosition < 0) {
				decimalPosition = i;
				continue;
			} else if (match === "%") {
				multiplier *= 100;
			} else if (match === "‰") {
				multiplier *= 1000;
				continue;
			} else if (match[0] === "," && match[match.length - 1] === ".") {
				multiplier /= Math.pow(1000, match.length - 1);
				decimalPosition = i + match.length - 1;
				continue;
			} else if ((match[0] === "E" || match[0] === "e") && match[match.length - 1] === "0") {
				isScientificNotation = true;
			}

			if (decimalPosition < 0) {
				fsBeforeDecimal.push(match);
				if (match === "#" || match === "0")
					noPhBeforeDecimal++;
				else if (match === ",")
					noComma++;
			}
			else {
				fsAfterDecimal.push(match);
				if (match === "#" || match === "0")
					noPhAfterDecimal++;
			}
		}

		if (isScientificNotation) {
			var integer = Math.floor(v);
			exponent = (integer === 0 ? "" : String(integer)).length - noPhBeforeDecimal;
			multiplier /= Math.pow(10, exponent);
		}

		v *= multiplier;

		if (decimalPosition < 0)
			decimalPosition = i;

		vString = v.toFixed(noPhAfterDecimal);
		var split = vString.split(".");
		//window.console.log(split);
		var vStringBeforeDecimal = (split[0] + "").split("");
		var vStringAfterDecimal = (split[1] + "").split("");

		if (vStringBeforeDecimal && vStringBeforeDecimal[0] === "0")
			vStringBeforeDecimal.shift();

		//window.console.log(fsBeforeDecimal + "<---------->" + fsAfterDecimal + " &        " + vStringBeforeDecimal + "<---------->" + vStringAfterDecimal);

		var noPhProcessed = 0;
		var noDigitsAdded = 0;
		var noCommaAdded = 0;
		var commaDistance = 0;
		var distanceFromLastComma = 0;

		while (fsBeforeDecimal.length > 0) {
			var match = fsBeforeDecimal.pop();

			if (match === "#" || match === "0") {
				noPhProcessed++;

				if (noPhProcessed === noPhBeforeDecimal) {
					var digits = vStringBeforeDecimal;
					vStringBeforeDecimal = [];

					if (match === "0") {
						//var totalDigits = result.match(/[0-9]/g).length;
						var toPad = noPhBeforeDecimal - noDigitsAdded - (digits ? digits.length : 0);

						while (toPad > 0) {
							digits.unshift("0");
							toPad--;
						}
					}

					while (digits.length > 0) {
						result = digits.pop() + result;
						distanceFromLastComma++;

						if (distanceFromLastComma % commaDistance === 0 && noCommaAdded === noComma && digits.length > 0)
							result = digitGroupSeparator + result;
					}

					if (isNegative)
						result = "-" + result;

				} else {
					if (vStringBeforeDecimal.length > 0) {
						result = vStringBeforeDecimal.pop() + result;
						noDigitsAdded++;
						distanceFromLastComma++;
					}
					else if (match === "0") {
						result = "0" + result;
						noDigitsAdded++;
						distanceFromLastComma++;
					}

					if (distanceFromLastComma % commaDistance === 0 && noCommaAdded === noComma && vStringBeforeDecimal.length > 0)
						result = digitGroupSeparator + result;
				}


			} else if ((match[0] === "E" || match[0] === "e") && match[match.length - 1] === "0" && /[eE][+-]*[0]+/.test(match)) {
				if (exponent < 0)
					match = match.replace("+", "").replace("-", "");
				else
					match = match.replace("-", "")

				result += match.replace(/[0]+/, function ($0) {
					return pad(exponent, $0.length);
				});


			} else {
				if (match === ",") {
					noCommaAdded++;
					commaDistance = distanceFromLastComma;
					distanceFromLastComma = 0;

					if (vStringBeforeDecimal.length > 0)
						result = digitGroupSeparator + result;
				} else if (match.length > 1 && ((match[0] === "\"" && match[match.length - 1] === "\"") || (match[0] === "'" && match[match.length - 1] === "'"))) {
					result = match.slice(1, match.length - 1) + result;
				}
				else
					result = match + result;
			}
		}

		var charCount = 0;

		while (fsAfterDecimal.length > 0) {
			match = fsAfterDecimal.shift();

			if (match === "#" || match === "0") {
				if (vStringAfterDecimal.length > 0 && Number(vStringAfterDecimal.join("")) !== 0) {
					result += (charCount++ === 0 ? decimalSeparator : "") + vStringAfterDecimal.shift();
				}
				else if (match === "0") {
					result += (charCount++ === 0 ? decimalSeparator : "") + "0";
				}
			} else if (match.length > 1 && ((match[0] === "\"" && match[match.length - 1] === "\"") || (match[0] === "'" && match[match.length - 1] === "'"))) {
				result += (charCount++ === 0 ? decimalSeparator : "") + match.slice(1, match.length - 1);
			} else if ((match[0] === "E" || match[0] === "e") && match[match.length - 1] === "0" && /[eE][+-]*[0]+/.test(match)) {
				if (exponent < 0)
					match = match.replace("+", "").replace("-", "");
				else
					match = match.replace("-", "")
				result += match.replace(/[0]+/, function ($0) {
					return pad(exponent, $0.length);
				});
			} else {
				result += (charCount++ === 0 ? decimalSeparator : "") + match;
			}
		}

		//window.console.log(result);
		return result;
	}

	//#endregion formatting functions/methods

	function getObjectId(x, y, ctx) {
		x *= devicePixelBackingStoreRatio;
		y *= devicePixelBackingStoreRatio;
		var pixels = ctx.getImageData(x, y, 2, 2).data;
		var isObject = true;

		for (var i = 0; i < 4; i++) {

			if (pixels[i] !== pixels[i + 4] | pixels[i] !== pixels[i + 8] | pixels[i] !== pixels[i + 12]) {
				isObject = false;
				break;
			}
		}

		if (isObject) {
			return RGBToInt(pixels[0], pixels[1], pixels[2]);
		} else {
			return 0;
		}

		//window.console.log(pixels);
	}

	//extracts mouse coordinates from the event parameters
	var getMouseCoordinates = function (ev) {
		var x = 0;
		var y = 0;

		if (!ev) var ev = window.event;

		if (ev.offsetX || ev.offsetX === 0) {
			x = ev.offsetX;
			y = ev.offsetY;
		} else if (ev.layerX || ev.layerX == 0) { // Firefox
			x = ev.layerX;
			y = ev.layerY;
		}
		else {
			x = ev.pageX - ev.target.offsetLeft;
			y = ev.pageY - ev.target.offsetTop;
		}

		return { x: x, y: y };
	}

	function getFontString(prefix, object, fallbackObject) {
		var fontString = "";

		var fontStyleString = prefix ? prefix + "FontStyle" : "fontStyle";
		var fontWeightString = prefix ? prefix + "FontWeight" : "fontWeight";
		var fontSizeString = prefix ? prefix + "FontSize" : "fontSize";
		var fontFamilyString = prefix ? prefix + "FontFamily" : "fontFamily";

		fontString += object[fontStyleString] ? object[fontStyleString] + " " : fallbackObject && fallbackObject[fontStyleString] ? fallbackObject[fontStyleString] + " " : "";
		fontString += object[fontWeightString] ? object[fontWeightString] + " " : fallbackObject && fallbackObject[fontWeightString] ? fallbackObject[fontWeightString] + " " : "";
		fontString += object[fontSizeString] ? object[fontSizeString] + "px " : fallbackObject && fallbackObject[fontSizeString] ? fallbackObject[fontSizeString] + "px " : "";
		fontString += object[fontFamilyString] ? object[fontFamilyString] + " " : fallbackObject && fallbackObject[fontFamilyString] ? fallbackObject[fontFamilyString] + " " : "";

		return fontString;
	}

	function getProperty(propertyName, object, fallbackObject) {

		var value = propertyName in object ? object[propertyName] : fallbackObject[propertyName];

		return value;
	}

	var optimizeForHiDPI = true;
	//optimizeForHiDPI = false;

	var devicePixelRatio = window.devicePixelRatio || 1;
	var backingStoreRatio = 1;
	var devicePixelBackingStoreRatio = optimizeForHiDPI ? devicePixelRatio / backingStoreRatio : 1;



	function setCanvasSize(canvas, width, height) {

		if (isCanvasSupported && !!optimizeForHiDPI) {
			var ctx = canvas.getContext("2d");
			backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
								ctx.mozBackingStorePixelRatio ||
								ctx.msBackingStorePixelRatio ||
								ctx.oBackingStorePixelRatio ||
								ctx.backingStorePixelRatio || 1;


			devicePixelBackingStoreRatio = devicePixelRatio / backingStoreRatio;

			canvas.width = width * devicePixelBackingStoreRatio;
			canvas.height = height * devicePixelBackingStoreRatio;

			if (devicePixelRatio !== backingStoreRatio) {

				canvas.style.width = width + 'px';
				canvas.style.height = height + 'px';

				ctx.scale(devicePixelBackingStoreRatio, devicePixelBackingStoreRatio);

			}

			//window.alert(backingStoreRatio);
			//window.alert(devicePixelRatio);

		} else {
			canvas.width = width;
			canvas.height = height;
		}

	}


	function createCanvas(width, height) {
		var canvas = document.createElement("canvas");

		setCanvasSize(canvas, width, height);

		if (!isCanvasSupported && typeof (G_vmlCanvasManager) !== "undefined") {
			G_vmlCanvasManager.initElement(canvas);
		}

		return canvas;
	}
	//#endregion Static Methods

	//#region Class Definitions

	//#region Class CanvasJSObject
	function CanvasJSObject(defaultsKey, options, theme) {
		this._defaultsKey = defaultsKey;

		currentTheme = {};

		if (theme && themes[theme] && themes[theme][defaultsKey])
			currentTheme = themes[theme][defaultsKey];

		this._options = options ? options : {};
		this.setOptions(this._options, currentTheme);
	};
	CanvasJSObject.prototype.setOptions = function (options, currentTheme) {

		if (!defaultOptions[this._defaultsKey]) {
			if (isDebugMode && window.console)
				console.log("defaults not set");
		}
		else {
			var defaults = defaultOptions[this._defaultsKey];

			for (prop in defaults) {
				if (options && prop in options)
					this[prop] = options[prop];
				else if (currentTheme && prop in currentTheme)
					this[prop] = currentTheme[prop]
				else this[prop] = defaults[prop];

				//if (typeof this[prop] === "function") {
				//    alert("function");
				//    this[prop] = this[prop]();
				//}
			}
		}
	}

	//Stores values in _oldOptions so that it can be tracked for any changes
	CanvasJSObject.prototype.trackChanges = function (option) {
		if (!this._options._oldOptions)
			this._options._oldOptions = {};

		this._options._oldOptions[option] = this._options[option];
	}

	CanvasJSObject.prototype.isBeingTracked = function (option) {
		if (!this._options._oldOptions)
			this._options._oldOptions = {};

		if (this._options._oldOptions[option])
			return true;
		else
			return false;
	}

	CanvasJSObject.prototype.hasOptionChanged = function (option) {
		if (!this._options._oldOptions)
			this._options._oldOptions = {};

		//if (!this._options._oldOptions[option])
		//    this._options._oldOptions[option] = null;

		var hasChanged = !(this._options._oldOptions[option] === this._options[option]);

		return hasChanged;
	}
	//#endregion Class CanvasJSObject

	//#region Class Chart
	function Chart(containerId, options) {
		options = options || {};

		Chart.parent.constructor.call(this, "Chart", options, options.theme ? options.theme : "theme1");

		var that = this;


		this._containerId = containerId;
		this._objectsInitialized = false;
		this.ctx = null;
		this.overlaidCanvasCtx = null;
		this._indexLabels = [];
		this._panTimerId = 0;
		this._lastTouchEventType = "";
		this.panEnabled = false;
		this._defaultCursor = "default";
		this.plotArea = { canvas: null, ctx: null, x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 };
		this._dataInRenderedOrder = [];

		//this._maxZIndex = 0;

		this._container = document.getElementById(this._containerId);

		if (!this._container)
			return;

		this._container.innerHTML = "";

		var width = 0;
		var height = 0;

		if (this._options.width)
			width = this.width;
		else
			width = this._container.clientWidth > 0 ? this._container.clientWidth : this.width;

		if (this._options.height)
			height = this.height;
		else
			height = this._container.clientHeight > 0 ? this._container.clientHeight : this.height;

		this.width = width;
		this.height = height;

		this._canvasJSContainer = document.createElement("div");
		this._canvasJSContainer.style.position = "relative";
		if (!isCanvasSupported) {
			this._canvasJSContainer.style.height = "0px";//In IE6 toolTip doesn't show at proper position if not set.
		}
		this._container.appendChild(this._canvasJSContainer);


		this.canvas = createCanvas(width, height);
		this.canvas.style.position = "absolute";
		if (this.canvas.getContext) {
			this.canvas.style.background = this.backgroundColor;
			this._canvasJSContainer.appendChild(this.canvas);
			this.ctx = this.canvas.getContext("2d");
			this.ctx.textBaseline = "top";
			extendCtx(this.ctx);
		} else
			return;

		//this.canvas.style.cursor = "pointer";

		if (!isCanvasSupported) {
			this.plotArea.canvas = createCanvas(width, height);
			this.plotArea.canvas.style.position = "absolute";
			this.plotArea.canvas.setAttribute("class", "plotAreaCanvas");
			this._canvasJSContainer.appendChild(this.plotArea.canvas);

			this.plotArea.ctx = this.plotArea.canvas.getContext("2d");
		} else {
			this.plotArea.ctx = this.ctx;
		}

		this.overlaidCanvas = createCanvas(width, height);
		this.overlaidCanvas.style.position = "absolute";
		this._canvasJSContainer.appendChild(this.overlaidCanvas);
		this.overlaidCanvasCtx = this.overlaidCanvas.getContext("2d");
		this.overlaidCanvasCtx.textBaseline = "top";

		this._eventManager = new EventManager(this);

		this._toolBar = document.createElement("div");
		this._toolBar.style.position = "absolute";
		this._toolBar.style.top = "0px";
		this._toolBar.style.right = "0px";
		this._canvasJSContainer.appendChild(this._toolBar);

		if (this.zoomEnabled) {
			this._zoomButton = document.createElement("button");
			this._zoomButton.appendChild(document.createTextNode("Pan"));
			this._toolBar.appendChild(this._zoomButton);
			addEvent(this._zoomButton, "click", function () {
				if (that.zoomEnabled) {
					that.zoomEnabled = false;
					that.panEnabled = true;

					that._zoomButton.innerHTML = that._cultureInfo.zoomText;

					//that._defaultCursor = "move";
					//that.overlaidCanvas.style.cursor = that._defaultCursor;
				} else {
					that.zoomEnabled = true;
					that.panEnabled = false;

					that._zoomButton.innerHTML = that._cultureInfo.panText;

					//that._defaultCursor = "default";
					//that.overlaidCanvas.style.cursor = that._defaultCursor;
				}
				that.render();
			});


			//this._panButton = document.createElement("button");
			//this._panButton.appendChild(document.createTextNode("Pan"));
			//this._toolBar.appendChild(this._panButton);
			//this._panButton.addEventListener("click", function () {
			//    that.zoomEnabled = false;
			//    that.panEnabled = true;
			//    that.render();
			//}, false);
		}

		if (this.zoomEnabled) {

			this._resetButton = document.createElement("button");
			this._resetButton.appendChild(document.createTextNode("Reset"));
			this._toolBar.appendChild(this._resetButton);

			if (this._options.zoomEnabled) {
				this.zoomEnabled = true;
				this.panEnabled = false;
			} else {
				this.zoomEnabled = false;
				this.panEnabled = false;
			}

			this.overlaidCanvas.style.cursor = that._defaultCursor;

			addEvent(this._resetButton, "click", function () {

				that._toolTip.hide();

				if (that.zoomEnabled || that.panEnabled) {
					that.zoomEnabled = true;
					that.panEnabled = false;
					that._zoomButton.innerHTML = that._cultureInfo.panText;

					that._defaultCursor = "default";
					that.overlaidCanvas.style.cursor = that._defaultCursor;
				} else {
					that.zoomEnabled = false;
					that.panEnabled = false;
				}

				if (that._options.axisX && that._options.axisX.minimum)
					that.sessionVariables.axisX.internalMinimum = that._options.axisX.minimum;
				else
					that.sessionVariables.axisX.internalMinimum = null;

				if (that._options.axisX && that._options.axisX.maximum)
					that.sessionVariables.axisX.internalMaximum = that._options.axisX.maximum;
				else
					that.sessionVariables.axisX.internalMaximum = null;

				that.resetOverlayedCanvas();

				that.render();
			});
		}

		addEvent(window, "resize", function () {
			//this._container.addEventListener("DOMSubtreeModified", function () {

			var width = 0;
			var height = 0;

			if (that._options.width)
				width = that.width;
			else
				that.width = width = that._container.clientWidth > 0 ? that._container.clientWidth : that.width;

			if (that._options.height)
				height = that.height;
			else
				that.height = height = that._container.clientHeight > 0 ? that._container.clientHeight : that.height;

			if (that.canvas.width !== width * devicePixelBackingStoreRatio || that.canvas.height !== height * devicePixelBackingStoreRatio) {
				that.renderCount--;

				//that.canvas.width = width;
				//that.canvas.height = height;
				setCanvasSize(that.canvas, width, height);

				//that.overlaidCanvas.width = width;
				//that.overlaidCanvas.height = height;
				setCanvasSize(that.overlaidCanvas, width, height);
				setCanvasSize(that._eventManager.ghostCanvas, width, height);


				that.render();
			}
		});

		this._toolBar.style.display = "none";

		this.bounds = { x1: 0, y1: 0, x2: this.width, y2: this.height };

		var that = this;

		addEvent(this.overlaidCanvas, 'click', function (e) {
			that._mouseEventHandler(e);
		});

		addEvent(this.overlaidCanvas, 'mousemove', function (e) {
			that._mouseEventHandler(e);
		});

		addEvent(this.overlaidCanvas, 'mouseup', function (e) {
			that._mouseEventHandler(e);
		});

		addEvent(this.overlaidCanvas, 'mousedown', function (e) {
			that._mouseEventHandler(e);
		});

		addEvent(this.overlaidCanvas, 'mouseout', function (e) {
			that._mouseEventHandler(e);
		});


		addEvent(this.overlaidCanvas, window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart", function (e) {
			that._touchEventHandler(e);
		});

		addEvent(this.overlaidCanvas, window.navigator.msPointerEnabled ? "MSPointerMove" : 'touchmove', function (e) {
			that._touchEventHandler(e);
		});

		addEvent(this.overlaidCanvas, window.navigator.msPointerEnabled ? "MSPointerUp" : 'touchend', function (e) {
			that._touchEventHandler(e);
		});

		addEvent(this.overlaidCanvas, window.navigator.msPointerEnabled ? "MSPointerCancel" : 'touchcancel', function (e) {
			that._touchEventHandler(e);
		});



		this._toolTip = new ToolTip(this, this._options.toolTip, this.theme);

		this.layoutManager = new LayoutManager(this);
		this.data = null;
		this.axisX = null;
		this.axisY = null;
		this.axisY2 = null;
		this.renderCount = 0;

		if (this.creditText && this.creditHref) {
			this._creditLink = document.createElement("a");
			this._creditLink.setAttribute("style", "outline:none;margin:0px;position:absolute;right:3px;top:" + (height - 14) + "px;color:dimgrey;text-decoration:none;font-size:10px;font-family:Lucida Grande, Lucida Sans Unicode, Arial, sans-serif");

			this._creditLink.setAttribute("tabIndex", -1);
			this._creditLink.setAttribute("href", this.creditHref);
			this._creditLink.innerHTML = this.creditText;
			this._creditLink.setAttribute("target", "_blank");

			//this._creditLink.style.


			//var creditLinkString = "<a style='' href='" + (this.creditHref.indexOf("http://") === 0 ? this.creditHref : "http://" + this.creditHref) + "'>" + this.creditHref + "</a>";
			//var xmlDoc;


			//if (window.DOMParser) {
			//    var parser = new DOMParser();
			//    xmlDoc = parser.parseFromString(creditLinkString, "text/xml");
			//    this._creditLink = xmlDoc.firstChild;
			//}
			//else // Internet Explorer
			//{
			//    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			//    xmlDoc.async = false;
			//    xmlDoc.loadXML(creditLinkString);
			//    this._creditLink = xmlDoc.firstChild;
			//}
			this._canvasJSContainer.appendChild(this._creditLink);
		}


		this.sessionVariables = {
			axisX: {
				internalMinimum: null,
				internalMaximum: null
			},
			axisY: {
				internalMinimum: null,
				internalMaximum: null
			},
			axisY2: {
				internalMinimum: null,
				internalMaximum: null
			}
		};
	};
	extend(Chart, CanvasJSObject);

	// initialize chart objects
	Chart.prototype._initialize = function () {
		///<signature>
		///<summary>Initializes Chart objects/state. Creates DataSeries class instance for each DataSeries provided by ther user. Sets the Axis Type based on the user data</summary>
		///</signature>
		//this.width = this.width;

		this._selectedColorSet = typeof (colorSets[this.colorSet]) !== "undefined" ? colorSets[this.colorSet] : colorSets["colorSet1"];

		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.beginPath();

		this.axisX = null;
		this.axisY = null;
		this.axisY2 = null;
		this._indexLabels = [];
		this._dataInRenderedOrder = [];

		this._events = [];
		if (this._eventManager)
			this._eventManager.reset();

		this.plotInfo = {
			//xMin: Infinity, xMax: -Infinity,
			//yMin: Infinity, yMax: -Infinity,
			//viewPortXMin: Infinity, viewPortXMax: -Infinity,
			//viewPortYMin: Infinity, viewPortYMax: -Infinity,
			//xMinDiff: Infinity,
			axisPlacement: null,
			axisXValueType: null,
			plotTypes: []//array of plotType: {type:"", axisYType: "primary", dataSeriesIndexes:[]}
		};

		this.layoutManager.reset();

		this._cultureInfo = new CultureInfo(this, this._options.culture);

		this.data = [];
		var dataSeriesIndex = 0;

		for (var series = 0; series < this._options.data.length; series++) {
			//for (series in this._options.data) {

			dataSeriesIndex++;

			if (!(!this._options.data[series].type || Chart._supportedChartTypes.indexOf(this._options.data[series].type) >= 0))
				continue;

			var dataSeries = new DataSeries(this, this._options.data[series], this.theme, dataSeriesIndex - 1, ++this._eventManager.lastObjectId);
			if (dataSeries.name === null)
				dataSeries.name = "DataSeries " + (dataSeriesIndex);

			if (dataSeries.color === null) {
				if (this._options.data.length > 1) {
					dataSeries._colorSet = [this._selectedColorSet[dataSeries.index % this._selectedColorSet.length]];
					dataSeries.color = this._selectedColorSet[dataSeries.index % this._selectedColorSet.length];
				} else {
					if (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline" || dataSeries.type === "area" || dataSeries.type === "splineArea" || dataSeries.type === "stackedArea" || dataSeries.type === "stackedArea100") {
						dataSeries._colorSet = [this._selectedColorSet[0]];
					}
					else
						dataSeries._colorSet = this._selectedColorSet;
				}
			} else {
				dataSeries._colorSet = [dataSeries.color];
			}

			if (dataSeries.markerSize === null) {
				if (((dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline") && dataSeries.dataPoints.length < this.width / 16) || dataSeries.type === "scatter") {
					//if (dataSeries.type === "line") {
					dataSeries.markerSize = 8;
				}
			}

			if (dataSeries.type === "bubble" || dataSeries.type === "scatter") {
				dataSeries.dataPoints.sort(compareDataPointX)
			}

			//if (dataSeries.markerBorderThickness === null && dataSeries.type === "scatter") {
			//    dataSeries.markerBorderThickness = 2;
			//}

			//if (dataSeries.markerType === null) {
			//    if (dataSeries.type === "line" & dataSeries.dataPoints.length < 500) {
			//        dataSeries.markerType = "circle";
			//    }
			//}

			this.data.push(dataSeries);

			var seriesAxisPlacement = dataSeries.axisPlacement;

			//if (isDebugMode && window.console)
			//    window.console.log(dataSeries.type);

			var errorMessage;

			if (seriesAxisPlacement === "normal") {

				if (this.plotInfo.axisPlacement === "xySwapped") {
					errorMessage = "You cannot combine \"" + dataSeries.type + "\" with bar chart";
				} else if (this.plotInfo.axisPlacement === "none") {
					errorMessage = "You cannot combine \"" + dataSeries.type + "\" with pie chart";
				} else if (this.plotInfo.axisPlacement === null)
					this.plotInfo.axisPlacement = "normal";
			}
			else if (seriesAxisPlacement === "xySwapped") {

				if (this.plotInfo.axisPlacement === "normal") {
					errorMessage = "You cannot combine \"" + dataSeries.type + "\" with line, area, column or pie chart";
				} else if (this.plotInfo.axisPlacement === "none") {
					errorMessage = "You cannot combine \"" + dataSeries.type + "\" with pie chart";
				} else if (this.plotInfo.axisPlacement === null)
					this.plotInfo.axisPlacement = "xySwapped";
			}
			else if (seriesAxisPlacement == "none") {

				if (this.plotInfo.axisPlacement === "normal") {
					errorMessage = "You cannot combine \"" + dataSeries.type + "\" with line, area, column or bar chart";
				} else if (this.plotInfo.axisPlacement === "xySwapped") {
					errorMessage = "You cannot combine \"" + dataSeries.type + "\" with bar chart";
				} else if (this.plotInfo.axisPlacement === null)
					this.plotInfo.axisPlacement = "none";
			}

			if (errorMessage && window.console) {
				window.console.log(errorMessage);
				return;
			}
		}

		//if (isDebugMode && window.console) {
		//    window.console.log("xMin: " + this.plotInfo.viewPortXMin + "; xMax: " + this.plotInfo.viewPortXMax + "; yMin: " + this.plotInfo.yMin + "; yMax: " + this.plotInfo.yMax);
		//}

		this._objectsInitialized = true;
	}

	Chart._supportedChartTypes = ["line", "stepLine", "spline", "column", "area", "splineArea", "bar", "bubble", "scatter",
		"stackedColumn", "stackedColumn100", "stackedBar", "stackedBar100",
		"stackedArea", "stackedArea100",
		"pie", "doughnut"
	];

	//indexOf is not supported in IE8-
	if (!Chart._supportedChartTypes.indexOf) {
		Chart._supportedChartTypes.indexOf = function (elt /*, from*/) {
			var len = this.length >>> 0;

			var from = Number(arguments[1]) || 0;
			from = (from < 0)
				 ? Math.ceil(from)
				 : Math.floor(from);
			if (from < 0)
				from += len;

			for (; from < len; from++) {
				if (from in this &&
					this[from] === elt)
					return from;
			}
			return -1;
		};
	}

	Chart.prototype.render = function () {
		//var dt = Date.now();

		this._initialize();

		//Create Primary and Secondary axis and assign them to the series
		for (var i = 0; i < this.data.length; i++) {

			if (this.plotInfo.axisPlacement === "normal" || this.plotInfo.axisPlacement === "xySwapped") {
				if (!this.data[i].axisYType || this.data[i].axisYType === "primary") {
					if (!this.axisY) {

						if (this.plotInfo.axisPlacement === "normal") {
							this.axisY = new Axis(this, this._options.axisY, "axisY", "left");
						}
						else if (this.plotInfo.axisPlacement === "xySwapped") {
							this.axisY = new Axis(this, this._options.axisY, "axisY", "bottom");
						}
					}
					this.data[i].axisY = this.axisY;
				}
				else if (this.data[i].axisYType === "secondary") {
					if (!this.axisY2) {
						if (this.plotInfo.axisPlacement === "normal") {
							this.axisY2 = new Axis(this, this._options.axisY2, "axisY", "right");
						}
						else if (this.plotInfo.axisPlacement === "xySwapped") {
							this.axisY2 = new Axis(this, this._options.axisY2, "axisY", "top");
						}
					}
					this.data[i].axisY = this.axisY2;
				}

				if (!this.axisX) {
					if (this.plotInfo.axisPlacement === "normal") {
						this.axisX = new Axis(this, this._options.axisX, "axisX", "bottom");
					} else if (this.plotInfo.axisPlacement === "xySwapped") {
						this.axisX = new Axis(this, this._options.axisX, "axisX", "left");
					}
				}

				this.data[i].axisX = this.axisX;
			}
		}

		this._processData();// Categorises the dataSeries and calculates min, max and other values

		if (this._options.title) {
			this._title = new Title(this, this._options.title);
			this._title.render();
		}

		this.legend = new Legend(this, this._options.legend, this.theme);
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].showInLegend)
				this.legend.dataSeries.push(this.data[i]);
		}
		this.legend.render();

		//TBI: Revisit and check if the functionality is enough.
		if (this.plotInfo.axisPlacement === "normal" || this.plotInfo.axisPlacement === "xySwapped") {
			var freeSpace = this.layoutManager.getFreeSpace();

			//window.alert(freeSpace.width + "; " + freeSpace.height);
			//window.alert(this.width + "; " + this.height);
			//window.alert(this._canvasJSContainer.clientWidth + "; " + this._canvasJSContainer.clientHeight);


			Axis.setLayoutAndRender(this.axisX, this.axisY, this.axisY2, this.plotInfo.axisPlacement, this.layoutManager.getFreeSpace());
		} else if (this.plotInfo.axisPlacement === "none") {
			//In case of charts with axis this method is called inside setLayoutAndRender
			this.preparePlotArea();
		}
		else {
			return;
		}

		for (var i = 0; i < this.plotInfo.plotTypes.length; i++) {
			var plotType = this.plotInfo.plotTypes[i];

			for (var j = 0; j < plotType.plotUnits.length; j++) {

				var plotUnit = plotType.plotUnits[j];

				if (plotUnit.type === "line")
					this.renderLine(plotUnit);
				else if (plotUnit.type === "stepLine")
					this.renderStepLine(plotUnit);
				else if (plotUnit.type === "spline")
					this.renderSpline(plotUnit);
				else if (plotUnit.type === "column")
					this.renderColumn(plotUnit);
				else if (plotUnit.type === "bar")
					this.renderBar(plotUnit);
				else if (plotUnit.type === "area")
					this.renderArea(plotUnit);
				else if (plotUnit.type === "splineArea")
					this.renderSplineArea(plotUnit);
				else if (plotUnit.type === "stackedColumn")
					this.renderStackedColumn(plotUnit);
				else if (plotUnit.type === "stackedColumn100")
					this.renderStackedColumn100(plotUnit);
				else if (plotUnit.type === "stackedBar")
					this.renderStackedBar(plotUnit);
				else if (plotUnit.type === "stackedBar100")
					this.renderStackedBar100(plotUnit);
				else if (plotUnit.type === "stackedArea")
					this.renderStackedArea(plotUnit);
				else if (plotUnit.type === "stackedArea100")
					this.renderStackedArea100(plotUnit);
				else if (plotUnit.type === "bubble")
					this.renderBubble(plotUnit);
				else if (plotUnit.type === "scatter")
					this.renderScatter(plotUnit);
				else if (plotUnit.type === "pie")
					this.renderPie(plotUnit);
				else if (plotUnit.type === "doughnut")
					this.renderPie(plotUnit);

				for (var k = 0; k < plotUnit.dataSeriesIndexes.length; k++) {
					this._dataInRenderedOrder.push(this.data[plotUnit.dataSeriesIndexes[k]]);
				}
			}
		}

		if (this._indexLabels.length > 0)
			this.renderIndexLabels();

		this.attachPlotAreaEventHandlers();

		if (!this.zoomEnabled && !this.panEnabled && this._toolBar.style.display !== "none") {
			this._toolBar.style.display = "none";
		}

		this._toolTip._updateToolTip();

		this.renderCount++;

		//if (window.console) {
		//    window.console.log(new Date().getTime() - dt);
		//}

		if (isDebugMode) {

			var that = this;
			setTimeout(function () {
				var ghostCanvasCopy = document.getElementById("ghostCanvasCopy");

				if (ghostCanvasCopy) {
					//console.log(ghostCanvasCopy.clientWidth);
					setCanvasSize(ghostCanvasCopy, that.width, that.height);
					var ghostCanvasCopyCtx = ghostCanvasCopy.getContext("2d");

					//ghostCanvasCopyCtx.scale(1, 1);
					//var imageData = this._eventManager.ghostCtx.getImageData(0, 0, this._container.clientWidth, this._container.clientHeight);
					//this._eventManager.ghostCtx.drawImage(this._eventManager.ghostCanvas, 0, 0);
					//this.ctx.drawImage(this._eventManager.ghostCanvas, 0, 0);

					ghostCanvasCopyCtx.drawImage(that._eventManager.ghostCanvas, 0, 0);
					//that._canvasJSContainer.appendChild(that._eventManager.ghostCanvas);
					//that.overlaidCanvasCtx.drawImage(that._eventManager.ghostCanvas, 0, 0);
				}
			}, 2000);
		}
	}

	Chart.prototype.attachPlotAreaEventHandlers = function () {

		//this._toolBar.style.display = "inline";

		this.attachEvent({
			context: this,
			chart: this,
			mousedown: this._plotAreaMouseDown,
			mouseup: this._plotAreaMouseUp,
			mousemove: this._plotAreaMouseMove,
			cursor: this.zoomEnabled ? "col-resize" : "move",
			cursor: this.panEnabled ? "move" : "default",
			capture: true,
			bounds: this.plotArea
		});

	}

	Chart.prototype.categoriseDataSeries = function () {
		var dataSeries = "";

		for (var i = 0; i < this.data.length; i++) {
			dataSeries = this.data[i]
			if (!dataSeries.dataPoints || dataSeries.dataPoints.length === 0)
				continue;

			if (Chart._supportedChartTypes.indexOf(dataSeries.type) >= 0) {

				var plotType = null;
				var plotTypeExists = false;

				var plotUnit = null;
				var plotUnitExists = false;

				for (var j = 0; j < this.plotInfo.plotTypes.length; j++) {
					if (this.plotInfo.plotTypes[j].type === dataSeries.type) {
						plotTypeExists = true;
						var plotType = this.plotInfo.plotTypes[j];
						break;
					}
				}

				if (!plotTypeExists) {
					plotType = {
						type: dataSeries.type,
						totalDataSeries: 0,
						plotUnits: []
					};
					this.plotInfo.plotTypes.push(plotType)
				}

				for (var j = 0; j < plotType.plotUnits.length; j++) {
					if (plotType.plotUnits[j].axisYType === dataSeries.axisYType) {
						plotUnitExists = true;
						var plotUnit = plotType.plotUnits[j];
						break;
					}
				}

				if (!plotUnitExists) {
					plotUnit = {
						type: dataSeries.type,
						previousDataSeriesCount: 0, //to be set next
						index: plotType.plotUnits.length,
						plotType: plotType,
						axisYType: dataSeries.axisYType,
						axisY: dataSeries.axisYType === "primary" ? this.axisY : this.axisY2,
						axisX: this.axisX,
						dataSeriesIndexes: [] //index of dataSeries
					}
					plotType.plotUnits.push(plotUnit);
				}

				plotType.totalDataSeries++;

				plotUnit.dataSeriesIndexes.push(i);
			}
		}

		for (var i = 0; i < this.plotInfo.plotTypes.length; i++) {
			var plotType = this.plotInfo.plotTypes[i];
			var previousDataSeriesCount = 0;

			for (var j = 0; j < plotType.plotUnits.length; j++) {

				plotType.plotUnits[j].previousDataSeriesCount = previousDataSeriesCount;

				previousDataSeriesCount += plotType.plotUnits[j].dataSeriesIndexes.length;
			}
		}
	}

	Chart.prototype.assignIdToDataPoints = function () {

		for (var i = 0; i < this.data.length; i++) {
			var dataSeries = this.data[i];

			var length = dataSeries.dataPoints.length;

			for (var j = 0; j < length; j++) {
				dataSeries.dataPointIds[j] = ++this._eventManager.lastObjectId;
			}
		}
	}

	Chart.prototype._processData = function () {
		this.assignIdToDataPoints();
		this.categoriseDataSeries();

		for (var i = 0; i < this.plotInfo.plotTypes.length; i++) {
			var plotType = this.plotInfo.plotTypes[i];

			for (var j = 0; j < plotType.plotUnits.length; j++) {

				var plotUnit = plotType.plotUnits[j];

				if (plotUnit.type === "line" || plotUnit.type === "stepLine" || plotUnit.type === "spline" || plotUnit.type === "column" || plotUnit.type === "area" || plotUnit.type === "splineArea" || plotUnit.type === "bar" || plotUnit.type === "bubble" || plotUnit.type === "scatter")
					this._processMultiseriesPlotUnit(plotUnit);
				else if (plotUnit.type === "stackedColumn" || plotUnit.type === "stackedBar" || plotUnit.type === "stackedArea")
					this._processStackedPlotUnit(plotUnit);
				else if (plotUnit.type === "stackedColumn100" || plotUnit.type === "stackedBar100" || plotUnit.type === "stackedArea100")
					this._processStacked100PlotUnit(plotUnit);
			}
		}

	}

	Chart.prototype._processMultiseriesPlotUnit = function (plotUnit) {
		if (!plotUnit.dataSeriesIndexes || plotUnit.dataSeriesIndexes.length < 1)
			return;

		var axisYDataInfo = plotUnit.axisY.dataInfo;
		var axisXDataInfo = plotUnit.axisX.dataInfo;
		var dataPointX, dataPointY;
		var isDateTime = false;


		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {
			var dataSeries = this.data[plotUnit.dataSeriesIndexes[j]];
			var i = 0;
			var isFirstDPInViewPort = false;
			var isLastDPInViewPort = false;

			if (dataSeries.axisPlacement === "normal" || dataSeries.axisPlacement === "xySwapped") {

				var plotAreaXMin = this.sessionVariables.axisX.internalMinimum ? this.sessionVariables.axisX.internalMinimum : (this._options.axisX && this._options.axisX.minimum) ? this._options.axisX.minimum : -Infinity;
				var plotAreaXMax = this.sessionVariables.axisX.internalMaximum ? this.sessionVariables.axisX.internalMaximum : (this._options.axisX && this._options.axisX.maximum) ? this._options.axisX.maximum : Infinity;
			}


			if (dataSeries.dataPoints[i].x && dataSeries.dataPoints[i].x.getTime || dataSeries.xValueType === "dateTime") {
				isDateTime = true;
			}

			for (i = 0; i < dataSeries.dataPoints.length; i++) {

				if (typeof dataSeries.dataPoints[i].x === "undefined") {
					dataSeries.dataPoints[i].x = i;
				}

				if (dataSeries.dataPoints[i].x.getTime) {
					isDateTime = true;
					dataPointX = dataSeries.dataPoints[i].x.getTime();//dataPointX is used so that getTime is called only once in case of dateTime values
				}
				else
					dataPointX = dataSeries.dataPoints[i].x;

				dataPointY = dataSeries.dataPoints[i].y;


				if (dataPointX < axisXDataInfo.min)
					axisXDataInfo.min = dataPointX;
				if (dataPointX > axisXDataInfo.max)
					axisXDataInfo.max = dataPointX;

				if (dataPointY < axisYDataInfo.min)
					axisYDataInfo.min = dataPointY;

				if (dataPointY > axisYDataInfo.max)
					axisYDataInfo.max = dataPointY;


				if (i > 0) {
					var xDiff = dataPointX - dataSeries.dataPoints[i - 1].x;
					xDiff < 0 && (xDiff = xDiff * -1); //If Condition shortcut

					if (axisXDataInfo.minDiff > xDiff && xDiff !== 0) {
						axisXDataInfo.minDiff = xDiff;
					}
				}

				// This section makes sure that partially visible dataPoints are included in the begining
				if (dataPointX < plotAreaXMin && !isFirstDPInViewPort) {
					continue;
				} else if (!isFirstDPInViewPort) {
					isFirstDPInViewPort = true;

					if (i > 0) {
						i -= 2;
						continue;
					}
				}

				// This section makes sure that partially visible dataPoints are included at the end
				if (dataPointX > plotAreaXMax && !isLastDPInViewPort) {
					isLastDPInViewPort = true;
				} else if (dataPointX > plotAreaXMax && isLastDPInViewPort) {
					continue;
				}

				if (dataSeries.dataPoints[i].label)
					plotUnit.axisX.labels[dataPointX] = dataSeries.dataPoints[i].label;


				if (dataPointX < axisXDataInfo.viewPortMin)
					axisXDataInfo.viewPortMin = dataPointX;
				if (dataPointX > axisXDataInfo.viewPortMax)
					axisXDataInfo.viewPortMax = dataPointX;

				if (dataPointY < axisYDataInfo.viewPortMin)
					axisYDataInfo.viewPortMin = dataPointY;
				if (dataPointY > axisYDataInfo.viewPortMax)
					axisYDataInfo.viewPortMax = dataPointY;
			}

			this.plotInfo.axisXValueType = dataSeries.xValueType = isDateTime ? "dateTime" : "number";
		}

		//this.dataPoints.sort(compareDataPointX);
		//this.dataPoints.sort(function (dataPoint1, dataPoint2) { return dataPoint1.x - dataPoint2.x; });
	}

	Chart.prototype._processStackedPlotUnit = function (plotUnit) {
		if (!plotUnit.dataSeriesIndexes || plotUnit.dataSeriesIndexes.length < 1)
			return;

		var axisYDataInfo = plotUnit.axisY.dataInfo;
		var axisXDataInfo = plotUnit.axisX.dataInfo;

		var dataPointX, dataPointY;
		var isDateTime = false;

		var dataPointYPositiveSums = [];
		var dataPointYNegativeSums = [];

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {
			var dataSeries = this.data[plotUnit.dataSeriesIndexes[j]];
			var i = 0;
			var isFirstDPInViewPort = false;
			var isLastDPInViewPort = false;

			if (dataSeries.axisPlacement === "normal" || dataSeries.axisPlacement === "xySwapped") {

				var plotAreaXMin = this.sessionVariables.axisX.internalMinimum ? this.sessionVariables.axisX.internalMinimum : (this._options.axisX && this._options.axisX.minimum) ? this._options.axisX.minimum : -Infinity;
				var plotAreaXMax = this.sessionVariables.axisX.internalMaximum ? this.sessionVariables.axisX.internalMaximum : (this._options.axisX && this._options.axisX.maximum) ? this._options.axisX.maximum : Infinity;
			}


			if (dataSeries.dataPoints[i].x && dataSeries.dataPoints[i].x.getTime || dataSeries.xValueType === "dateTime") {
				isDateTime = true;
			}

			for (i = 0; i < dataSeries.dataPoints.length; i++) {

				// Requird when no x values are provided 
				if (typeof dataSeries.dataPoints[i].x === "undefined") {
					dataSeries.dataPoints[i].x = i;
				}

				if (dataSeries.dataPoints[i].x.getTime) {
					isDateTime = true;
					dataPointX = dataSeries.dataPoints[i].x.getTime();//dataPointX is used so that getTime is called only once in case of dateTime values
				}
				else
					dataPointX = dataSeries.dataPoints[i].x;

				dataPointY = dataSeries.dataPoints[i].y;



				if (dataPointX < axisXDataInfo.min)
					axisXDataInfo.min = dataPointX;
				if (dataPointX > axisXDataInfo.max)
					axisXDataInfo.max = dataPointX;

				if (i > 0) {
					var xDiff = dataPointX - dataSeries.dataPoints[i - 1].x;
					xDiff < 0 && (xDiff = xDiff * -1); //If Condition shortcut

					if (axisXDataInfo.minDiff > xDiff && xDiff !== 0) {
						axisXDataInfo.minDiff = xDiff;
					}
				}

				// This section makes sure that partially visible dataPoints are included in the begining
				if (dataPointX < plotAreaXMin && !isFirstDPInViewPort) {
					continue;
				} else if (!isFirstDPInViewPort) {
					isFirstDPInViewPort = true;

					if (i > 0) {
						i -= 2;
						continue;
					}
				}

				// This section makes sure that partially visible dataPoints are included at the end
				if (dataPointX > plotAreaXMax && !isLastDPInViewPort) {
					isLastDPInViewPort = true;
				} else if (dataPointX > plotAreaXMax && isLastDPInViewPort) {
					continue;
				}


				if (dataSeries.dataPoints[i].label)
					plotUnit.axisX.labels[dataPointX] = dataSeries.dataPoints[i].label;

				if (dataPointX < axisXDataInfo.viewPortMin)
					axisXDataInfo.viewPortMin = dataPointX;
				if (dataPointX > axisXDataInfo.viewPortMax)
					axisXDataInfo.viewPortMax = dataPointX;

				if (dataPointY >= 0) {
					if (dataPointYPositiveSums[dataPointX])
						dataPointYPositiveSums[dataPointX] += dataPointY;
					else
						dataPointYPositiveSums[dataPointX] = dataPointY;
				} else {
					if (dataPointYNegativeSums[dataPointX])
						dataPointYNegativeSums[dataPointX] += dataPointY;
					else
						dataPointYNegativeSums[dataPointX] = dataPointY;
				}
			}

			this.plotInfo.axisXValueType = dataSeries.xValueType = isDateTime ? "dateTime" : "number";
		}

		for (i in dataPointYPositiveSums) {

			if (isNaN(i)) {
				continue;
			}
			var ySum = dataPointYPositiveSums[i];

			if (ySum < axisYDataInfo.min)
				axisYDataInfo.min = ySum;

			if (ySum > axisYDataInfo.max)
				axisYDataInfo.max = ySum;

			if (i < axisXDataInfo.viewPortMin || i > axisXDataInfo.viewPortMax)
				continue;

			if (ySum < axisYDataInfo.viewPortMin)
				axisYDataInfo.viewPortMin = ySum;
			if (ySum > axisYDataInfo.viewPortMax)
				axisYDataInfo.viewPortMax = ySum;
		}

		for (i in dataPointYNegativeSums) {

			if (isNaN(i)) {
				continue;
			}

			var ySum = dataPointYNegativeSums[i];

			if (ySum < axisYDataInfo.min)
				axisYDataInfo.min = ySum;

			if (ySum > axisYDataInfo.max)
				axisYDataInfo.max = ySum;

			if (i < axisXDataInfo.viewPortMin || i > axisXDataInfo.viewPortMax)
				continue;

			if (ySum < axisYDataInfo.viewPortMin)
				axisYDataInfo.viewPortMin = ySum;
			if (ySum > axisYDataInfo.viewPortMax)
				axisYDataInfo.viewPortMax = ySum;
		}


		//this.dataPoints.sort(compareDataPointX);
		//this.dataPoints.sort(function (dataPoint1, dataPoint2) { return dataPoint1.x - dataPoint2.x; });

		//window.console.log("viewPortYMin: " + plotInfo.viewPortYMin + "; viewPortYMax: " + plotInfo.viewPortYMax);
	}

	Chart.prototype._processStacked100PlotUnit = function (plotUnit) {
		if (!plotUnit.dataSeriesIndexes || plotUnit.dataSeriesIndexes.length < 1)
			return;

		var axisYDataInfo = plotUnit.axisY.dataInfo;
		var axisXDataInfo = plotUnit.axisX.dataInfo;

		var dataPointX, dataPointY;
		var isDateTime = false;
		var containsPositiveY = false;
		var containsNegativeY = false;

		var dataPointYSums = [];

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {
			var dataSeries = this.data[plotUnit.dataSeriesIndexes[j]];
			var i = 0;
			var isFirstDPInViewPort = false;
			var isLastDPInViewPort = false;

			if (dataSeries.axisPlacement === "normal" || dataSeries.axisPlacement === "xySwapped") {

				var plotAreaXMin = this.sessionVariables.axisX.internalMinimum ? this.sessionVariables.axisX.internalMinimum : (this._options.axisX && this._options.axisX.minimum) ? this._options.axisX.minimum : -Infinity;
				var plotAreaXMax = this.sessionVariables.axisX.internalMaximum ? this.sessionVariables.axisX.internalMaximum : (this._options.axisX && this._options.axisX.maximum) ? this._options.axisX.maximum : Infinity;
			}


			if (dataSeries.dataPoints[i].x && dataSeries.dataPoints[i].x.getTime || dataSeries.xValueType === "dateTime") {
				isDateTime = true;
			}

			for (i = 0; i < dataSeries.dataPoints.length; i++) {

				// Requird when no x values are provided 
				if (typeof dataSeries.dataPoints[i].x === "undefined") {
					dataSeries.dataPoints[i].x = i;
				}

				if (dataSeries.dataPoints[i].x.getTime) {
					isDateTime = true;
					dataPointX = dataSeries.dataPoints[i].x.getTime();//dataPointX is used so that getTime is called only once in case of dateTime values
				}
				else
					dataPointX = dataSeries.dataPoints[i].x;

				dataPointY = dataSeries.dataPoints[i].y;



				if (dataPointX < axisXDataInfo.min)
					axisXDataInfo.min = dataPointX;
				if (dataPointX > axisXDataInfo.max)
					axisXDataInfo.max = dataPointX;

				if (i > 0) {
					var xDiff = dataPointX - dataSeries.dataPoints[i - 1].x;
					xDiff < 0 && (xDiff = xDiff * -1); //If Condition shortcut

					if (axisXDataInfo.minDiff > xDiff && xDiff !== 0) {
						axisXDataInfo.minDiff = xDiff;
					}
				}

				// This section makes sure that partially visible dataPoints are included in the begining
				if (dataPointX < plotAreaXMin && !isFirstDPInViewPort) {
					continue;
				} else if (!isFirstDPInViewPort) {
					isFirstDPInViewPort = true;

					if (i > 0) {
						i -= 2;
						continue;
					}
				}

				// This section makes sure that partially visible dataPoints are included at the end
				if (dataPointX > plotAreaXMax && !isLastDPInViewPort) {
					isLastDPInViewPort = true;
				} else if (dataPointX > plotAreaXMax && isLastDPInViewPort) {
					continue;
				}

				if (dataSeries.dataPoints[i].label)
					plotUnit.axisX.labels[dataPointX] = dataSeries.dataPoints[i].label;

				if (dataPointX < axisXDataInfo.viewPortMin)
					axisXDataInfo.viewPortMin = dataPointX;
				if (dataPointX > axisXDataInfo.viewPortMax)
					axisXDataInfo.viewPortMax = dataPointX;

				if (dataPointY >= 0) {
					containsPositiveY = true;
				} else {
					containsNegativeY = true;
				}

				if (dataPointYSums[dataPointX])
					dataPointYSums[dataPointX] += Math.abs(dataPointY);
				else
					dataPointYSums[dataPointX] = Math.abs(dataPointY);
			}

			this.plotInfo.axisXValueType = dataSeries.xValueType = isDateTime ? "dateTime" : "number";
		}


		if (containsPositiveY && !containsNegativeY) {
			axisYDataInfo.max = 99;
			axisYDataInfo.min = 1;
		} else if (containsPositiveY && containsNegativeY) {
			axisYDataInfo.max = 99;
			axisYDataInfo.min = -99;
		} else if (!containsPositiveY && containsNegativeY) {
			axisYDataInfo.max = -1;
			axisYDataInfo.min = -99;
		}

		axisYDataInfo.viewPortMin = axisYDataInfo.min;
		axisYDataInfo.viewPortMax = axisYDataInfo.max;

		plotUnit.dataPointYSums = dataPointYSums;

		//this.dataPoints.sort(compareDataPointX);
		//this.dataPoints.sort(function (dataPoint1, dataPoint2) { return dataPoint1.x - dataPoint2.x; });

		//window.console.log("viewPortYMin: " + plotInfo.viewPortYMin + "; viewPortYMax: " + plotInfo.viewPortYMax);
	}

	Chart.prototype.getDataPointAtXY = function (mouseX, mouseY, getClosest) {

		getClosest = getClosest || false;
		var results = [];

		for (var i = this._dataInRenderedOrder.length - 1; i >= 0; i--) {
			var dataSeries = this._dataInRenderedOrder[i];

			var result = null;

			result = dataSeries.getDataPointAtXY(mouseX, mouseY, getClosest);
			if (result)
				results.push(result);
		}

		var closestResult = null;
		var onlyLineAreaTypes = false;

		for (var m = 0; m < results.length; m++) {

			if (results[m].dataSeries.type === "line" || results[m].dataSeries.type === "stepLine" || results[m].dataSeries.type === "area") {
				var markerSize = getProperty("markerSize", results[m].dataPoint, results[m].dataSeries) || 8;
				if (results[m].distance <= markerSize / 2) {
					onlyLineAreaTypes = true;
					break;
				}
			}
		}

		for (m = 0; m < results.length; m++) {

			if (onlyLineAreaTypes && results[m].dataSeries.type !== "line" && results[m].dataSeries.type !== "stepLine" && results[m].dataSeries.type !== "area")
				continue;

			if (!closestResult) {
				closestResult = results[m];
			} else if (results[m].distance <= closestResult.distance) {
				closestResult = results[m];
			}
		}

		return closestResult;
	}


	/// <summary>Calculates Font Size based on standardSize and Chart Size</summary>
	/// <param name="standardSize" type="Number">Standard font size for a Chart with min(width,height) = 400px</param>
	/// <returns type="Number">The area.</returns>
	Chart.prototype.getAutoFontSize = function (standardSize) {

		var fontSizeScaleFactor = standardSize / 400;

		return Math.min(this.width, this.height) * fontSizeScaleFactor;
	}

	//#region Events

	Chart.prototype.resetOverlayedCanvas = function () {
		//var width = this.overlaidCanvas.width;
		//this.overlaidCanvas.width = 0;
		//this.overlaidCanvas.width = width;
		this.overlaidCanvasCtx.clearRect(0, 0, this.width, this.height);
	}

	Chart.prototype.attachEvent = function (param) {
		this._events.push(param);
	}

	Chart.prototype._touchEventHandler = function (ev) {
		if (!ev.changedTouches)
			return;

		var mouseEvents = [];
		var touches = ev.changedTouches;
		first = touches ? touches[0] : ev;

		switch (ev.type) {
			case "touchstart": case "MSPointerDown": mouseEvents = ["mousemove", "mousedown"]; break;
			case "touchmove": case "MSPointerMove": mouseEvents = ["mousemove"]; break;
			case "touchend": case "MSPointerUp": mouseEvents = (this._lastTouchEventType === "touchstart" || this._lastTouchEventType === "MSPointerDown") ? ["mouseup", "click"] : ["mouseup"];
				break;
			default: return;
		}

		this._lastTouchEventType = ev.type;

		for (var i = 0; i < mouseEvents.length; i++) {

			var type = mouseEvents[i];
			var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, window, 1,
									  first.screenX, first.screenY,
									  first.clientX, first.clientY, false,
									  false, false, false, 0/*left*/, null);

			first.target.dispatchEvent(simulatedEvent);

			if (ev.preventManipulation) {
				//alert("preventManipulation");
				ev.preventManipulation();
			}

			if (ev.preventDefault) {
				//alert("preventDefault");
				ev.preventDefault();
			}
		}
	}

	Chart.prototype._mouseEventHandler = function (ev) {
		// stop panning and zooming so we can draw
		if (ev.preventManipulation) {
			//alert("preventManipulation");
			ev.preventManipulation();
		}

		// we are handling this event
		if (ev.preventDefault) {
			//alert("preventDefault");
			ev.preventDefault();
		}

		//IE8- uses srcElement instead of target. So instead of checking this condition everytime, its better to create a reference called target.
		if (typeof (ev.target) === "undefined" && ev.srcElement)
			ev.target = ev.srcElement;

		//console.log(ev.type);

		var xy = getMouseCoordinates(ev);
		var type = ev.type;
		var eventParam;
		var rightclick;

		if (!ev) var e = window.event;
		if (ev.which) rightclick = (ev.which == 3);
		else if (ev.button) rightclick = (ev.button == 2);

		//window.console.log(type + " --> x: " + xy.x + "; y:" + xy.y);

		//if (type === "mouseout") {
		//    this._toolTip.hide();
		//}

		if (isDebugMode && window.console) {
			window.console.log(type + " --> x: " + xy.x + "; y:" + xy.y);
			if (rightclick)
				window.console.log(ev.which);

			if (type === "mouseup")
				window.console.log("mouseup");
		}

		if (rightclick)
			return;

		//if (this.plotInfo.axisPlacement === "xySwapped") {
		//    //var temp = xy.x;
		//    //xy.x = xy.y;
		//    //xy.y = temp;
		//    xy = {x: xy.y, y: xy.x};
		//}

		if (Chart.capturedEventParam) {
			eventParam = Chart.capturedEventParam;

			if (type === "mouseup") {
				Chart.capturedEventParam = null;

				if (eventParam.chart.overlaidCanvas.releaseCapture)
					eventParam.chart.overlaidCanvas.releaseCapture();
				else
					document.body.removeEventListener("mouseup", eventParam.chart._mouseEventHandler, false);

			}

			if (eventParam.hasOwnProperty(type))
				eventParam[type].call(eventParam.context, xy.x, xy.y);



		}
		else if (this._events) {

			for (var i = 0; i < this._events.length; i++) {
				if (!this._events[i].hasOwnProperty(type))
					continue;

				eventParam = this._events[i];
				var bounds = eventParam.bounds;

				if (xy.x >= bounds.x1 && xy.x <= bounds.x2 && xy.y >= bounds.y1 && xy.y <= bounds.y2) {
					eventParam[type].call(eventParam.context, xy.x, xy.y);

					if (type === "mousedown" && eventParam.capture === true) {
						Chart.capturedEventParam = eventParam;

						if (this.overlaidCanvas.setCapture)
							this.overlaidCanvas.setCapture();
						else {
							document.body.addEventListener("mouseup", this._mouseEventHandler, false);
							//addEvent(document.body, "mouseup", this._mouseEventHandler);
						}
					} else if (type === "mouseup") {
						if (eventParam.chart.overlaidCanvas.releaseCapture)
							eventParam.chart.overlaidCanvas.releaseCapture();
						else
							document.body.removeEventListener("mouseup", this._mouseEventHandler, false);
					}

					break;
				}
				else
					eventParam = null;
			}

			if (eventParam && eventParam.cursor) {
				ev.target.style.cursor = eventParam.cursor;
			}
			else
				ev.target.style.cursor = this._defaultCursor;

			//eventParam = 
		}

		if (this._toolTip && this._toolTip.enabled) {

			var plotArea = this.plotArea;

			if (xy.x < plotArea.x1 || xy.x > plotArea.x2 || xy.y < plotArea.y1 || xy.y > plotArea.y2)
				this._toolTip.hide();
		}


		if ((!this.isDrag || !this.zoomEnabled) && this._eventManager) {
			this._eventManager.mouseEventHandler(ev);
			//this._updateToolTip(ev.x, ev.y);            
		}

		//if (this._toolTip.enabled)
		//    this._toolTip.mouseMoveHandler(ev.x, ev.y);
	}

	Chart.prototype._plotAreaMouseDown = function (x, y) {
		this.isDrag = true;

		if (this.plotInfo.axisPlacement !== "none") {
			this.dragStartPoint = { x: x, y: y, xMinimum: this.axisX.minimum, xMaximum: this.axisX.maximum };
		} else {
			this.dragStartPoint = { x: x, y: y };
		}

	}

	Chart.prototype._plotAreaMouseUp = function (x, y) {

		if (this.plotInfo.axisPlacement === "normal" || this.plotInfo.axisPlacement === "xySwapped") {
			if (this.isDrag) {

				var dragDelta = 0;
				var dragValue = 0;
				var axisXProps = this.axisX.lineCoordinates;

				if (this.plotInfo.axisPlacement === "xySwapped") {
					dragDelta = y - this.dragStartPoint.y;
					dragValue = Math.abs(this.axisX.maximum - this.axisX.minimum) / axisXProps.height * dragDelta;
				}
				else {
					dragDelta = this.dragStartPoint.x - x;
					dragValue = Math.abs(this.axisX.maximum - this.axisX.minimum) / axisXProps.width * dragDelta;
				}

				if (Math.abs(dragDelta) > 2) {
					if (this.panEnabled) {

						var reRender = false;
						var overFlow = 0;

						//If the user has panned beyond the minimum/maximum value of axisX, then take it back to minimum/maximum.
						if (this.axisX.sessionVariables.internalMinimum < this.axisX._absoluteMinimum) {

							overFlow = this.axisX._absoluteMinimum - this.axisX.sessionVariables.internalMinimum;

							this.axisX.sessionVariables.internalMinimum += overFlow;
							this.axisX.sessionVariables.internalMaximum += overFlow;
							reRender = true;
						} else if (this.axisX.sessionVariables.internalMaximum > this.axisX._absoluteMaximum) {

							overFlow = this.axisX.sessionVariables.internalMaximum - this.axisX._absoluteMaximum;
							this.axisX.sessionVariables.internalMaximum -= overFlow;
							this.axisX.sessionVariables.internalMinimum -= overFlow;

							reRender = true;
						}
						//}


						//this.overlaidCanvas.style.cursor = this._defaultCursor;


						if (reRender)
							this.render();

					} else if (this.zoomEnabled) {

						this.resetOverlayedCanvas();

						//alert("mouse UP");
						if (!this.dragStartPoint)
							return;

						if (this.plotInfo.axisPlacement === "xySwapped") {
							//In Pixels
							var selectedRegion = { y1: Math.min(this.dragStartPoint.y, y), y2: Math.max(this.dragStartPoint.y, y) };

							if (Math.abs(selectedRegion.y1 - selectedRegion.y2) > 1) {
								var axisXProps = this.axisX.lineCoordinates;

								var minX = this.axisX.maximum - (this.axisX.maximum - this.axisX.minimum) / axisXProps.height * (selectedRegion.y2 - axisXProps.y1);
								var maxX = this.axisX.maximum - (this.axisX.maximum - this.axisX.minimum) / axisXProps.height * (selectedRegion.y1 - axisXProps.y1);

								minX = Math.max(minX, this.axisX.dataInfo.min);
								maxX = Math.min(maxX, this.axisX.dataInfo.max);

								if (Math.abs((maxX - minX) / this.axisX.dataInfo.minDiff) >= 4 / 500 * this.height) {

									this.axisX.sessionVariables.internalMinimum = minX;
									this.axisX.sessionVariables.internalMaximum = maxX;

									this.render();
								}
							}
						} else if (this.plotInfo.axisPlacement === "normal") {
							var selectedRegion = { x1: Math.min(this.dragStartPoint.x, x), x2: Math.max(this.dragStartPoint.x, x) };

							if (Math.abs(selectedRegion.x1 - selectedRegion.x2) > 1) {
								var axisXProps = this.axisX.lineCoordinates;

								var minX = (this.axisX.maximum - this.axisX.minimum) / axisXProps.width * (selectedRegion.x1 - axisXProps.x1) + this.axisX.minimum;
								var maxX = (this.axisX.maximum - this.axisX.minimum) / axisXProps.width * (selectedRegion.x2 - axisXProps.x1) + this.axisX.minimum;

								minX = Math.max(minX, this.axisX.dataInfo.min);
								maxX = Math.min(maxX, this.axisX.dataInfo.max);

								if (Math.abs((maxX - minX) / this.axisX.dataInfo.minDiff) >= 5 / 500 * this.width) {

									this.axisX.sessionVariables.internalMinimum = minX;
									this.axisX.sessionVariables.internalMaximum = maxX;

									this.render();
								}
							}
						}
					}

					if (this.zoomEnabled && this._toolBar.style.display === "none") {
						this._toolBar.style.display = "inline";
						this._zoomButton.innerHTML = this._cultureInfo.panText;
						this._resetButton.innerHTML = this._cultureInfo.resetText;
					}
				}
			}

		}

		this.isDrag = false;

		//this.dragStartPoint = null;
	}

	Chart.prototype._plotAreaMouseMove = function (x, y) {
		if (this.isDrag && this.plotInfo.axisPlacement !== "none") {

			var dragDelta = 0;
			var dragValue = 0;
			var axisXProps = this.axisX.lineCoordinates;

			if (this.plotInfo.axisPlacement === "xySwapped") {
				dragDelta = y - this.dragStartPoint.y;
				dragValue = Math.abs(this.axisX.maximum - this.axisX.minimum) / axisXProps.height * dragDelta;
			}
			else {
				dragDelta = this.dragStartPoint.x - x;
				dragValue = Math.abs(this.axisX.maximum - this.axisX.minimum) / axisXProps.width * dragDelta;
			}

			if (Math.abs(dragDelta) > 2 && Math.abs(dragDelta) < 8 && (this.panEnabled || this.zoomEnabled)) {
				this._toolTip.hide();
			} else if (this._toolTip.enabled && !this.panEnabled && !this.zoomEnabled) {
				this._toolTip.mouseMoveHandler(x, y);
			}

			if (Math.abs(dragDelta) > 2 && (this.panEnabled || this.zoomEnabled)) {
				if (this.panEnabled) {

					this.axisX.sessionVariables.internalMinimum = this.dragStartPoint.xMinimum + dragValue;
					this.axisX.sessionVariables.internalMaximum = this.dragStartPoint.xMaximum + dragValue;

					var overFlow = 0;

					// This is to stop the user from dragging chart beyond some limit (this.axisX._absoluteMinimum - this.axisX.interval)
					if (this.axisX.sessionVariables.internalMinimum < this.axisX._absoluteMinimum - convertToNumber(this.axisX.interval, this.axisX.intervalType)) {

						overFlow = (this.axisX._absoluteMinimum - convertToNumber(this.axisX.interval, this.axisX.intervalType)) - this.axisX.sessionVariables.internalMinimum;
						this.axisX.sessionVariables.internalMinimum += overFlow;
						this.axisX.sessionVariables.internalMaximum += overFlow;
					} else if (this.axisX.sessionVariables.internalMaximum > this.axisX._absoluteMaximum + convertToNumber(this.axisX.interval, this.axisX.intervalType)) {
						overFlow = this.axisX.sessionVariables.internalMaximum - (this.axisX._absoluteMaximum + convertToNumber(this.axisX.interval, this.axisX.intervalType));
						this.axisX.sessionVariables.internalMaximum -= overFlow;
						this.axisX.sessionVariables.internalMinimum -= overFlow;
					}

					//this.dragStartPoint.x = x;

					//this.render();
					var that = this;

					clearTimeout(this._panTimerId);
					this._panTimerId = setTimeout(function () {
						that.render();
					}, 0);

				} else if (this.zoomEnabled) {
					var plotAreaBounds = this.plotArea;

					this.resetOverlayedCanvas();

					var alpha = this.overlaidCanvasCtx.globalAlpha;

					this.overlaidCanvasCtx.globalAlpha = .7;
					this.overlaidCanvasCtx.fillStyle = "#A0ABB8";

					if (this.plotInfo.axisPlacement === "xySwapped") {
						this.overlaidCanvasCtx.fillRect(plotAreaBounds.x1, this.dragStartPoint.y, plotAreaBounds.x2 - plotAreaBounds.x1, y - this.dragStartPoint.y);
					}
					else if (this.plotInfo.axisPlacement === "normal") {
						this.overlaidCanvasCtx.fillRect(this.dragStartPoint.x, plotAreaBounds.y1, x - this.dragStartPoint.x, plotAreaBounds.y2 - plotAreaBounds.y1);
					}

					this.overlaidCanvasCtx.globalAlpha = alpha;
				}
			}

			//if (dragDelta > 5) {
			//    this._toolTip.hide();
			//    return;
			//} else if (this._toolTip.enabled)
			//    this._toolTip.mouseMoveHandler(x, y);

		} else if (this._toolTip.enabled)
			this._toolTip.mouseMoveHandler(x, y);
	}

	//#endregion Events

	Chart.prototype.preparePlotArea = function () {

		var plotArea = this.plotArea;

		var yAxis = this.axisY ? this.axisY : this.axisY2;

		if (!isCanvasSupported && (plotArea.x1 > 0 || plotArea.y1 > 0)) {
			plotArea.ctx.translate(plotArea.x1, plotArea.y1);
		}

		if (this.axisX && yAxis) {
			plotArea.x1 = this.axisX.lineCoordinates.x1 < this.axisX.lineCoordinates.x2 ? this.axisX.lineCoordinates.x1 : yAxis.lineCoordinates.x1;
			plotArea.y1 = (this.axisX.lineCoordinates.y1 < yAxis.lineCoordinates.y1 ? this.axisX.lineCoordinates.y1 : yAxis.lineCoordinates.y1);

			plotArea.x2 = (this.axisX.lineCoordinates.x2 > yAxis.lineCoordinates.x2 ? this.axisX.lineCoordinates.x2 : yAxis.lineCoordinates.x2);
			plotArea.y2 = this.axisX.lineCoordinates.y2 > this.axisX.lineCoordinates.y1 ? this.axisX.lineCoordinates.y2 : yAxis.lineCoordinates.y2;

			plotArea.width = plotArea.x2 - plotArea.x1;
			plotArea.height = plotArea.y2 - plotArea.y1;
			//plotArea = { x1: x1, y1: y1, x2: x2, y2: y2, width: x2 - x1, height: y2 - y1 };
		} else {
			//ToDo: @sunil
			var freeSpace = this.layoutManager.getFreeSpace();
			plotArea.x1 = freeSpace.x1;
			plotArea.x2 = freeSpace.x2;
			plotArea.y1 = freeSpace.y1;
			plotArea.y2 = freeSpace.y2;

			plotArea.width = freeSpace.width;
			plotArea.height = freeSpace.height;
		}

		if (!isCanvasSupported) {

			plotArea.canvas.width = plotArea.width;
			plotArea.canvas.height = plotArea.height;

			plotArea.canvas.style.left = plotArea.x1 + "px";
			plotArea.canvas.style.top = plotArea.y1 + "px";

			if (plotArea.x1 > 0 || plotArea.y1 > 0) {
				plotArea.ctx.translate(-plotArea.x1, -plotArea.y1);
			}
		}
	}

	Chart.prototype.getPixelCoordinatesOnPlotArea = function (x, y) {
		return { x: this.axisX.getPixelCoordinatesOnAxis(x).x, y: this.axisY.getPixelCoordinatesOnAxis(y).y }
		//return { x: 5, y: 10 };
	}

	//#region Render Methods

	Chart.prototype.renderIndexLabels = function () {
		var ctx = this.plotArea.ctx;

		ctx.textBaseline = "middle";
		var plotArea = this.plotArea;

		for (var i = 0; i < this._indexLabels.length; i++) {

			var indexLabel = this._indexLabels[i];

			var x, y, angle;

			ctx.fillStyle = getProperty("indexLabelFontColor", indexLabel.dataPoint, indexLabel.dataSeries);
			ctx.font = getFontString("indexLabel", indexLabel.dataPoint, indexLabel.dataSeries);
			var indexLabelText = this.replaceKeywordsWithValue(getProperty("indexLabel", indexLabel.dataPoint, indexLabel.dataSeries), indexLabel.dataPoint, indexLabel.dataSeries);
			var textSize = { width: ctx.measureText(indexLabelText).width, height: getProperty("indexLabelFontSize", indexLabel.dataPoint, indexLabel.dataSeries) };
			var placement = getProperty("indexLabelPlacement", indexLabel.dataPoint, indexLabel.dataSeries);
			var orientation = getProperty("indexLabelOrientation", indexLabel.dataPoint, indexLabel.dataSeries);
			var angle = 0;

			var yMinLimit = 0;
			var yMaxLimit = 0;
			var xMinLimit = 0;
			var xMaxLimit = 0;

			//So that indexLabel is skipped once the point is outside of plotArea
			if (indexLabel.point.x < plotArea.x1 || indexLabel.point.x > plotArea.x2 || indexLabel.point.y < plotArea.y1 || indexLabel.point.y > plotArea.y2)
				continue;

			if (indexLabel.chartType === "column" || indexLabel.chartType === "stackedColumn" || indexLabel.chartType === "stackedColumn100"
				|| indexLabel.chartType === "bar" || indexLabel.chartType === "stackedBar" || indexLabel.chartType === "stackedBar100") {

				var width = Math.abs(indexLabel.bounds.x1, indexLabel.bounds.x2)
				var height = Math.abs(indexLabel.bounds.y1, indexLabel.bounds.y2)

				if (this.plotInfo.axisPlacement === "normal") {

					if (placement === "outside") {

						yMinLimit = plotArea.y1;
						yMaxLimit = plotArea.y2;

					} else if (placement === "inside") {

						yMinLimit = indexLabel.bounds.y1;
						yMaxLimit = indexLabel.bounds.y2;

					}

					if (orientation === "horizontal") {
						x = indexLabel.point.x - textSize.width / 2;

						if (indexLabel.dataPoint.y >= 0)
							y = Math.min((Math.max(indexLabel.point.y - textSize.height / 2 - 5, yMinLimit + textSize.height / 2 + 5)), yMaxLimit - textSize.height / 2 - 5);
						else
							y = Math.max((Math.min(indexLabel.point.y + textSize.height / 2 + 5, yMaxLimit - textSize.height / 2)), yMinLimit + textSize.height / 2 + 5);
					}
					else if (orientation === "vertical") {
						x = indexLabel.point.x;
						if (indexLabel.dataPoint.y >= 0)
							y = Math.min(Math.max(indexLabel.point.y - 5, yMinLimit + textSize.width + 5), yMaxLimit);
						else
							y = Math.max(Math.min(indexLabel.point.y + textSize.width + 5, yMaxLimit - 5), yMinLimit);

						angle = -90;
					}

				} else if (this.plotInfo.axisPlacement === "xySwapped") {

					if (placement === "outside") {

						xMinLimit = plotArea.x1;
						xMaxLimit = plotArea.x2;

					} else if (placement === "inside") {

						xMinLimit = indexLabel.bounds.x1;
						xMaxLimit = indexLabel.bounds.x2;

					}

					if (orientation === "horizontal") {
						y = indexLabel.point.y;

						if (indexLabel.dataPoint.y >= 0)
							x = Math.max((Math.min(indexLabel.point.x + 5, xMaxLimit - textSize.width)), xMinLimit);
						else
							x = Math.min((Math.max(indexLabel.point.x - textSize.width - 5, xMinLimit)), xMaxLimit);
					}
					else if (orientation === "vertical") {
						y = indexLabel.point.y + textSize.width / 2;

						if (indexLabel.dataPoint.y >= 0)
							x = Math.max(Math.min(indexLabel.point.x + textSize.height / 2 + 5, xMaxLimit - textSize.height / 2), xMinLimit);
						else
							x = Math.min(Math.max(indexLabel.point.x - textSize.height / 2 - 5, xMinLimit + textSize.height / 2), xMaxLimit + textSize.height / 2);

						angle = -90;
					}

				}

			} else {

				if (orientation === "horizontal") {

					x = indexLabel.point.x - textSize.width / 2;

					if (indexLabel.dataPoint.y >= 0)
						y = Math.max(indexLabel.point.y - textSize.height / 2 - 5, plotArea.y1 + textSize.height / 2);
					else
						y = Math.min(indexLabel.point.y + textSize.height / 2 + 5, plotArea.y2 - textSize.height / 2);

				} else if (orientation === "vertical") {

					x = indexLabel.point.x;

					if (indexLabel.dataPoint.y >= 0)
						y = Math.max(indexLabel.point.y - 5, plotArea.y1 + textSize.width);
					else
						y = Math.min(indexLabel.point.y + textSize.width + 5, plotArea.y2);

					angle = -90;
				}

			}

			ctx.save();

			ctx.translate(x, y);
			ctx.rotate(Math.PI / 180 * angle);

			ctx.fillText(indexLabelText, 0, 0);

			ctx.restore();
		}
	}

	Chart.prototype.renderLine = function (plotUnit) {

		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;
		if (totalDataSeries <= 0)
			return;

		var ghostCtx = this._eventManager.ghostCtx;
		//var ghostCtx = this.overlaidCanvasCtx;

		ctx.save();

		var plotArea = this.plotArea;

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		var markers = [];

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			ctx.lineWidth = dataSeries.lineThickness;
			var dataPoints = dataSeries.dataPoints;

			var seriesId = dataSeries.id;
			this._eventManager.objectMap[seriesId] = { objectType: "dataSeries", dataSeriesIndex: dataSeriesIndex };
			var hexColor = intToHexColorString(seriesId);
			ghostCtx.strokeStyle = hexColor;
			//ghostCtx.lineWidth = dataSeries.lineThickness;
			ghostCtx.lineWidth = dataSeries.lineThickness > 0 ? Math.max(dataSeries.lineThickness, 4) : 0;

			colorSet = dataSeries._colorSet;
			color = colorSet[0];
			ctx.strokeStyle = color;

			var isFirstDataPointInPlotArea = true;
			var i = 0, x, y;
			var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number back and forth.

			//if (!dataSeries._options.markerSize && dataSeries.dataPoints.length < 1000)
			//    dataSeries.markerSize = 8;

			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				//dataSeries.noDataPointsInPlotArea = 0

				for (i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax)
						continue;

					//if (!isFinite(dataPoints[i].y))
					//    continue;

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x, y1: y };


					//dataSeries.noDataPointsInPlotArea++;

					if (isFirstDataPointInPlotArea) {
						ctx.beginPath();
						ctx.moveTo(x, y);

						if (isCanvasSupported) {
							ghostCtx.beginPath();
							ghostCtx.moveTo(x, y);
						}

						isFirstDataPointInPlotArea = false;
					} else {

						ctx.lineTo(x, y);

						if (isCanvasSupported)
							ghostCtx.lineTo(x, y);

						if (i % 500 == 0) {
							ctx.stroke();
							ctx.beginPath();
							ctx.moveTo(x, y);

							if (isCanvasSupported) {
								ghostCtx.stroke();
								ghostCtx.beginPath();
								ghostCtx.moveTo(x, y);
							}
						}
					}

					//Render Marker
					if (dataPoints[i].markerSize > 0 || dataSeries.markerSize > 0) {

						var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
						markers.push(markerProps);

						if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
							dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
						}

						var markerColor = intToHexColorString(id);

						//window.console.log("index: " + i + "; id: " + id + "; hex: " + markerColor);

						if (isCanvasSupported) {
							markers.push({
								x: x, y: y, ctx: ghostCtx,
								type: markerProps.type,
								size: markerProps.size,
								color: markerColor,
								borderColor: markerColor,
								borderThickness: markerProps.borderThickness
							});
						}
					}

					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "line",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x, y: y },
							color: color
						});

					}

				}

				ctx.stroke();

				if (isCanvasSupported)
					ghostCtx.stroke();

				//if (!dataSeries._options.markerSize && dataSeries.noDataPointsInPlotArea > plotArea.width / 16)
				//    continue;

				//if (dataSeries.markerType && dataSeries.markerSize > 0) {
				//    for (i = 0; i < dataPoints.length; i++) {

				//        dataPoints[i].getTime ? dataPointX = dataPoints[i].x.getTime() : dataPointX = dataPoints[i].x;

				//        if (dataPointX < this.plotInfo.viewPortXMin || dataPointX > this.plotInfo.viewPortXMax)
				//            continue;

				//        x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
				//        y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

				//        markers.push({ x: x, y: y, ctx: ctx, type: dataSeries.markerType, size: dataSeries.markerSize, color: color, borderColor: dataSeries.markerBorderColor, borderThickness: dataSeries.markerBorderThickness });
				//    }
				//}
			}

		}


		RenderHelper.drawMarkers(markers);
		ctx.restore();

		ctx.beginPath();

		if (isCanvasSupported)
			ghostCtx.beginPath();
	}

	Chart.prototype.renderStepLine = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;
		if (totalDataSeries <= 0)
			return;

		var ghostCtx = this._eventManager.ghostCtx;
		//var ghostCtx = this.overlaidCanvasCtx;

		ctx.save();

		var plotArea = this.plotArea;

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		var markers = [];

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			ctx.lineWidth = dataSeries.lineThickness;
			var dataPoints = dataSeries.dataPoints;

			var seriesId = dataSeries.id;
			this._eventManager.objectMap[seriesId] = { objectType: "dataSeries", dataSeriesIndex: dataSeriesIndex };
			var hexColor = intToHexColorString(seriesId);
			ghostCtx.strokeStyle = hexColor;
			//ghostCtx.lineWidth = dataSeries.lineThickness;
			ghostCtx.lineWidth = dataSeries.lineThickness > 0 ? Math.max(dataSeries.lineThickness, 4) : 0;

			colorSet = dataSeries._colorSet;
			color = colorSet[0];
			ctx.strokeStyle = color;

			var isFirstDataPointInPlotArea = true;
			var i = 0, x, y;
			var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number back and forth.

			//if (!dataSeries._options.markerSize && dataSeries.dataPoints.length < 1000)
			//    dataSeries.markerSize = 8;

			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				//dataSeries.noDataPointsInPlotArea = 0

				for (i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax)
						continue;

					//if (!isFinite(dataPoints[i].y))
					//    continue;

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					var prevY = y;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x, y1: y };


					//dataSeries.noDataPointsInPlotArea++;

					if (isFirstDataPointInPlotArea) {
						ctx.beginPath();
						ctx.moveTo(x, y);

						if (isCanvasSupported) {
							ghostCtx.beginPath();
							ghostCtx.moveTo(x, y);
						}

						isFirstDataPointInPlotArea = false;
					} else {

						ctx.lineTo(x, prevY);
						if (isCanvasSupported)
							ghostCtx.lineTo(x, prevY);

						ctx.lineTo(x, y);
						if (isCanvasSupported)
							ghostCtx.lineTo(x, y);

						if (i % 500 == 0) {
							ctx.stroke();
							ctx.beginPath();
							ctx.moveTo(x, y);

							if (isCanvasSupported) {
								ghostCtx.stroke();
								ghostCtx.beginPath();
								ghostCtx.moveTo(x, y);
							}
						}
					}

					//Render Marker
					if (dataPoints[i].markerSize > 0 || dataSeries.markerSize > 0) {

						var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
						markers.push(markerProps);

						if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
							dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
						}

						var markerColor = intToHexColorString(id);

						//window.console.log("index: " + i + "; id: " + id + "; hex: " + markerColor);
						if (isCanvasSupported) {
							markers.push({
								x: x, y: y, ctx: ghostCtx,
								type: markerProps.type,
								size: markerProps.size,
								color: markerColor,
								borderColor: markerColor,
								borderThickness: markerProps.borderThickness
							});
						}
					}

					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "stepLine",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x, y: y },
							color: color
						});

					}

				}

				ctx.stroke();
				if (isCanvasSupported)
					ghostCtx.stroke();
			}
		}


		RenderHelper.drawMarkers(markers);
		ctx.restore();

		ctx.beginPath();

		if (isCanvasSupported)
			ghostCtx.beginPath();
	}

	function getBezierPoints(points, tension) {
		var bezierPoints = [];

		for (var i = 0; i < points.length; i++) {

			if (i == 0) {
				bezierPoints.push(points[0]);
				continue;
			}

			var i1, i2, pointIndex;

			pointIndex = i - 1;
			i1 = pointIndex === 0 ? 0 : pointIndex - 1;
			i2 = pointIndex === points.length - 1 ? pointIndex : pointIndex + 1;

			var drv1 = { x: (points[i2].x - points[i1].x) / tension, y: (points[i2].y - points[i1].y) / tension }
			var cp1 = { x: points[pointIndex].x + drv1.x / 3, y: points[pointIndex].y + drv1.y / 3 }
			bezierPoints[bezierPoints.length] = cp1;


			pointIndex = i;
			i1 = pointIndex === 0 ? 0 : pointIndex - 1;
			i2 = pointIndex === points.length - 1 ? pointIndex : pointIndex + 1;

			var drv2 = { x: (points[i2].x - points[i1].x) / tension, y: (points[i2].y - points[i1].y) / tension }
			var cp2 = { x: points[pointIndex].x - drv2.x / 3, y: points[pointIndex].y - drv2.y / 3 }
			bezierPoints[bezierPoints.length] = cp2;

			bezierPoints[bezierPoints.length] = points[i];
		}

		return bezierPoints;
	}

	Chart.prototype.renderSpline = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;
		if (totalDataSeries <= 0)
			return;

		var ghostCtx = this._eventManager.ghostCtx;

		ctx.save();

		var plotArea = this.plotArea;

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		var markers = [];

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			ctx.lineWidth = dataSeries.lineThickness;
			var dataPoints = dataSeries.dataPoints;

			var seriesId = dataSeries.id;
			this._eventManager.objectMap[seriesId] = { objectType: "dataSeries", dataSeriesIndex: dataSeriesIndex };
			var hexColor = intToHexColorString(seriesId);
			ghostCtx.strokeStyle = hexColor;
			//ghostCtx.lineWidth = dataSeries.lineThickness;
			ghostCtx.lineWidth = dataSeries.lineThickness > 0 ? Math.max(dataSeries.lineThickness, 4) : 0;

			colorSet = dataSeries._colorSet;
			color = colorSet[0];
			ctx.strokeStyle = color;

			var isFirstDataPointInPlotArea = true;
			var i = 0, x, y;
			var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number back and forth.

			//if (!dataSeries._options.markerSize && dataSeries.dataPoints.length < 1000)
			//    dataSeries.markerSize = 8;

			var pixels = [];

			if (dataPoints.length > 0) {

				for (i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax)
						continue;

					//if (!isFinite(dataPoints[i].y))
					//    continue;

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x, y1: y };


					pixels[pixels.length] = { x: x, y: y };


					//Add Markers
					if (dataPoints[i].markerSize > 0 || dataSeries.markerSize > 0) {

						var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
						markers.push(markerProps);

						if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
							dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
						}

						var markerColor = intToHexColorString(id);

						//window.console.log("index: " + i + "; id: " + id + "; hex: " + markerColor);
						if (isCanvasSupported) {
							markers.push({
								x: x, y: y, ctx: ghostCtx,
								type: markerProps.type,
								size: markerProps.size,
								color: markerColor,
								borderColor: markerColor,
								borderThickness: markerProps.borderThickness
							});
						}
					}

					//Add Labels
					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "spline",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x, y: y },
							color: color
						});

					}

				}
			}

			var bp = getBezierPoints(pixels, 2);

			if (bp.length > 0) {
				ctx.beginPath();
				if (isCanvasSupported)
					ghostCtx.beginPath();

				ctx.moveTo(bp[0].x, bp[0].y);
				if (isCanvasSupported)
					ghostCtx.moveTo(bp[0].x, bp[0].y);

				for (var i = 0; i < bp.length - 3; i += 3) {

					ctx.bezierCurveTo(bp[i + 1].x, bp[i + 1].y, bp[i + 2].x, bp[i + 2].y, bp[i + 3].x, bp[i + 3].y);

					if (isCanvasSupported)
						ghostCtx.bezierCurveTo(bp[i + 1].x, bp[i + 1].y, bp[i + 2].x, bp[i + 2].y, bp[i + 3].x, bp[i + 3].y);

					if (i > 0 && i % 3000 === 0) {
						ctx.stroke();
						ctx.beginPath();
						ctx.moveTo(bp[i + 3].x, bp[i + 3].y);

						if (isCanvasSupported) {
							ghostCtx.stroke();
							ghostCtx.beginPath();
							ghostCtx.moveTo(bp[i + 3].x, bp[i + 3].y);
						}
					}
				}

				ctx.stroke();

				if (isCanvasSupported)
					ghostCtx.stroke();
			}

		}


		RenderHelper.drawMarkers(markers);
		ctx.restore();

		ctx.beginPath();

		if (isCanvasSupported)
			ghostCtx.beginPath();
	}

	var drawRect = function (ctx, x1, y1, x2, y2, color, top, bottom, left, right) {
		//alert("top"+ top + "bottom" + bottom + " lt" + left+ "rt" + right )
		var a1 = x1, a2 = x2, b1 = y1, b2 = y2, edgeY, edgeX;
		if (x2 - x1 > 15 && y2 - y1 > 15)
			var bevelDepth = 8;
		else
			var bevelDepth = 0.35 * Math.min((x2 - x1), (y2 - y1));
		//alert(a1 + "" + a2);
		color2 = "rgba(255, 255, 255, .4)";
		color3 = "rgba(255, 255, 255, 0.1)";
		//color1 = "rgba(" + r + "," + g + ", " + b + ",1)";
		color1 = color;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.save();
		ctx.fillStyle = color1;
		//  ctx.moveTo(x1, y1);
		ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
		ctx.restore();
		//   ctx.beginPath();
		if (top === true) {
			// alert(x1 + "" + x2 + " " + bevelDepth);
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x1 + bevelDepth, y1 + bevelDepth);
			ctx.lineTo(x2 - bevelDepth, y1 + bevelDepth);
			ctx.lineTo(x2, y1);
			ctx.closePath();
			var grd = ctx.createLinearGradient((x2 + x1) / 2, b1 + bevelDepth, (x2 + x1) / 2, b1);
			grd.addColorStop(0, color1);
			grd.addColorStop(1, color2);
			ctx.fillStyle = grd;
			ctx.fill();
			//              ctx.stroke();
			ctx.restore();
		}


		if (bottom === true) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x1, y2);
			ctx.lineTo(x1 + bevelDepth, y2 - bevelDepth);
			ctx.lineTo(x2 - bevelDepth, y2 - bevelDepth);
			ctx.lineTo(x2, y2);
			ctx.closePath();
			var grd = ctx.createLinearGradient((x2 + x1) / 2, b2 - bevelDepth, (x2 + x1) / 2, b2);
			grd.addColorStop(0, color1);
			grd.addColorStop(1, color2);
			ctx.fillStyle = grd;
			//       ctx.stroke();
			ctx.fill();
			ctx.restore();
		}

		if (left === true) {
			//   alert(x1)
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x1, y1)
			ctx.lineTo(x1 + bevelDepth, y1 + bevelDepth);
			ctx.lineTo(x1 + bevelDepth, y2 - bevelDepth);
			ctx.lineTo(x1, y2);
			ctx.closePath();
			var grd = ctx.createLinearGradient(a1 + bevelDepth, (y2 + y1) / 2, a1, (y2 + y1) / 2);
			grd.addColorStop(0, color1);
			grd.addColorStop(1, color3);
			ctx.fillStyle = grd;
			ctx.fill();
			//     ctx.stroke();
			ctx.restore();
		}


		if (right === true) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x2, y1)
			ctx.lineTo(x2 - bevelDepth, y1 + bevelDepth);
			ctx.lineTo(x2 - bevelDepth, y2 - bevelDepth);
			ctx.lineTo(x2, y2);
			var grd = ctx.createLinearGradient(a2 - bevelDepth, (y2 + y1) / 2, a2, (y2 + y1) / 2);
			grd.addColorStop(0, color1);
			grd.addColorStop(1, color3);
			ctx.fillStyle = grd;
			grd.addColorStop(0, color1);
			grd.addColorStop(1, color3);
			ctx.fillStyle = grd;
			ctx.fill();
			ctx.closePath();
			//          ctx.stroke();
			ctx.restore();
		}
		//	

	}

	Chart.prototype.renderColumn = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number from dataTime everytime it is used.

		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = (this.width * .15);
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.width / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / plotUnit.plotType.totalDataSeries * .9) << 0;

		ctx.save();
		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}
		//ctx.beginPath();

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;

			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;

			// Reducing pixelPerUnit by 1 just to overcome any problems due to rounding off of pixels.
			dataSeries.maxWidthInX = barWidth / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);

			//var offsetX = barWidth * plotUnit.index << 0;


			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				var bevelEnabled = (barWidth > 5) && dataSeries.bevelEnabled ? true : false;

				for (i = 0; i < dataPoints.length; i++) {

					dataPoints[i].getTime ? dataPointX = dataPoints[i].x.getTime() : dataPointX = dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var x1 = x - (plotUnit.plotType.totalDataSeries * barWidth / 2) + ((plotUnit.previousDataSeriesCount + j) * barWidth) << 0;
					var x2 = x1 + barWidth << 0;
					var y1;
					var y2;

					if (dataPoints[i].y >= 0) {
						y1 = y;

						y2 = yZeroToPixel;

						if (y1 > y2) {
							var temp = y1;
							y1 = y2;
							y2 = y1;
						}

					} else {
						y2 = y;

						y1 = yZeroToPixel;

						if (y1 > y2) {
							var temp = y1;
							y1 = y2;
							y2 = y1;
						}
					}

					color = dataPoints[i].color ? dataPoints[i].color : dataSeries._colorSet[i % dataSeries._colorSet.length];
					drawRect(ctx, x1, y1, x2, y2, color, bevelEnabled && (dataPoints[i].y >= 0), (dataPoints[i].y < 0) && bevelEnabled, false, false);

					//if (dataSeries.markerType && dataSeries.markerSize > 0) {
					//    RenderHelper.drawMarker(x1 + (x2 - x1) / 2, y, ctx, dataSeries.markerType, dataSeries.markerSize, color, dataSeries.markerBorderColor, dataSeries.markerBorderThickness ? dataSeries.markerBorderThickness : 1);
					//}

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x1, y1: y1, x2: x2, y2: y2 };

					color = intToHexColorString(id);
					if (isCanvasSupported)
						drawRect(this._eventManager.ghostCtx, x1, y1, x2, y2, color, false, false, false, false);

					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "column",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x1 + (x2 - x1) / 2, y: dataPoints[i].y >= 0 ? y1 : y2 },
							bounds: { x1: x1, y1: Math.min(y1, y2), x2: x2, y2: Math.max(y1, y2) },
							color: color
						});

					}
				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderStackedColumn = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var offsetPositiveY = [];
		var offsetNegativeY = [];

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number everytime it is accessed.

		//var yZeroToPixel = (axisYProps.y2 - axisYProps.height / rangeY * Math.abs(0 - plotUnit.axisY.minimum) + .5) << 0;
		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.width * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.width / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / plotUnit.plotType.plotUnits.length * .9) << 0;

		ctx.save();
		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];
			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;

			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;


			// Reducing pixelPerUnit by 1 just to overcome any problems due to rounding off of pixels.
			dataSeries.maxWidthInX = barWidth / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);


			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				var bevelEnabled = (barWidth > 5) && dataSeries.bevelEnabled ? true : false;

				ctx.strokeStyle = "#4572A7 ";

				for (i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;


					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var x1 = x - (plotUnit.plotType.plotUnits.length * barWidth / 2) + (plotUnit.index * barWidth) << 0;
					var x2 = x1 + barWidth << 0;
					var y1;
					var y2;


					if (dataPoints[i].y >= 0) {
						var offset = offsetPositiveY[dataPointX] ? offsetPositiveY[dataPointX] : 0;

						y1 = y - offset;
						y2 = yZeroToPixel - offset;

						offsetPositiveY[dataPointX] = offset + (y2 - y1);

					} else {
						var offset = offsetNegativeY[dataPointX] ? offsetNegativeY[dataPointX] : 0;

						y2 = y + offset;
						y1 = yZeroToPixel + offset;

						offsetNegativeY[dataPointX] = offset + (y2 - y1);
					}

					color = dataPoints[i].color ? dataPoints[i].color : dataSeries._colorSet[i % dataSeries._colorSet.length];

					drawRect(ctx, x1, y1, x2, y2, color, bevelEnabled && (dataPoints[i].y >= 0), (dataPoints[i].y < 0) && bevelEnabled, false, false);

					//if (dataSeries.markerType && dataSeries.markerSize > 0) {
					//    RenderHelper.drawMarker(x1 + (x2 - x1)/2, y1, ctx, dataSeries.markerType, dataSeries.markerSize, color, dataSeries.markerBorderColor, dataSeries.markerBorderThickness ? dataSeries.markerBorderThickness : 1);
					//}

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x1, y1: y1, x2: x2, y2: y2 };
					color = intToHexColorString(id);

					if (isCanvasSupported)
						drawRect(this._eventManager.ghostCtx, x1, y1, x2, y2, color, false, false, false, false);


					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "stackedColumn",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x, y: dataPoints[i].y >= 0 ? y1 : y2 },
							bounds: { x1: x1, y1: Math.min(y1, y2), x2: x2, y2: Math.max(y1, y2) },
							color: color
						});

					}
				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderStackedColumn100 = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var offsetPositiveY = [];
		var offsetNegativeY = [];

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number everytime it is accessed.

		//var yZeroToPixel = (axisYProps.y2 - axisYProps.height / rangeY * Math.abs(0 - plotUnit.axisY.minimum) + .5) << 0;
		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.width * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.width / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / plotUnit.plotType.plotUnits.length * .9) << 0;

		ctx.save();
		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;


			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;

			dataSeries.maxWidthInX = barWidth / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);


			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				var bevelEnabled = (barWidth > 5) && dataSeries.bevelEnabled ? true : false;

				//ctx.strokeStyle = "#4572A7 ";

				for (i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;


					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;

					var yPercent;
					if (plotUnit.dataPointYSums[dataPointX] !== 0)
						yPercent = dataPoints[i].y / plotUnit.dataPointYSums[dataPointX] * 100;
					else
						yPercent = 0;

					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (yPercent - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var x1 = x - (plotUnit.plotType.plotUnits.length * barWidth / 2) + (plotUnit.index * barWidth) << 0;
					var x2 = x1 + barWidth << 0;
					var y1;
					var y2;


					if (dataPoints[i].y >= 0) {
						var offset = offsetPositiveY[dataPointX] ? offsetPositiveY[dataPointX] : 0;

						y1 = y - offset;
						y2 = yZeroToPixel - offset;

						offsetPositiveY[dataPointX] = offset + (y2 - y1);

					} else {
						var offset = offsetNegativeY[dataPointX] ? offsetNegativeY[dataPointX] : 0;

						y2 = y + offset;
						y1 = yZeroToPixel + offset;

						offsetNegativeY[dataPointX] = offset + (y2 - y1);
					}


					color = dataPoints[i].color ? dataPoints[i].color : dataSeries._colorSet[i % dataSeries._colorSet.length];
					drawRect(ctx, x1, y1, x2, y2, color, bevelEnabled && (dataPoints[i].y >= 0), (dataPoints[i].y < 0) && bevelEnabled, false, false);

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x1, y1: y1, x2: x2, y2: y2 };
					color = intToHexColorString(id);

					if (isCanvasSupported)
						drawRect(this._eventManager.ghostCtx, x1, y1, x2, y2, color, false, false, false, false);


					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "stackedColumn100",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x, y: dataPoints[i].y >= 0 ? y1 : y2 },
							bounds: { x1: x1, y1: Math.min(y1, y2), x2: x2, y2: Math.max(y1, y2) },
							color: color
						});

					}
				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderBar = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number from dataTime everytime it is used.

		//In case of Bar Chart, yZeroToPixel is x co-ordinate!
		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.height * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		//var barWidth = (((plotArea.height / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / totalDataSeries * .9) << 0;

		var barWidth = (((plotArea.height / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / plotUnit.plotType.totalDataSeries * .9) << 0;


		ctx.save();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;


			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;


			dataSeries.maxWidthInX = barWidth / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);


			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				var bevelEnabled = (barWidth > 5) && dataSeries.bevelEnabled ? true : false;

				ctx.strokeStyle = "#4572A7 ";

				for (i = 0; i < dataPoints.length; i++) {

					dataPoints[i].getTime ? dataPointX = dataPoints[i].x.getTime() : dataPointX = dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					//x and y are pixel co-ordinates of point and should not be confused with X and Y values
					y = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					x = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;


					var y1 = (y - (plotUnit.plotType.totalDataSeries * barWidth / 2) + ((plotUnit.previousDataSeriesCount + j) * barWidth)) << 0;
					var y2 = y1 + barWidth << 0;
					var x1;
					var x2;

					if (dataPoints[i].y >= 0) {
						x1 = yZeroToPixel;
						x2 = x;
					} else {
						x1 = x;
						x2 = yZeroToPixel;
					}

					//drawRect(ctx, x1, y1, plotArea.x2, y2, "#EEEEEE", false, false, false, false);
					//drawRect(ctx, x1, y1, plotArea.x2, y2, "#BDCED3", false, false, false, false);

					color = dataPoints[i].color ? dataPoints[i].color : dataSeries._colorSet[i % dataSeries._colorSet.length];
					//color = "#1B4962";
					drawRect(ctx, x1, y1, x2, y2, color, bevelEnabled, false, false, false);


					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x1, y1: y1, x2: x2, y2: y2 };
					color = intToHexColorString(id);

					if (isCanvasSupported)
						drawRect(this._eventManager.ghostCtx, x1, y1, x2, y2, color, false, false, false, false);


					this._indexLabels.push({
						chartType: "bar",
						dataPoint: dataPoints[i],
						dataSeries: dataSeries,
						point: { x: dataPoints[i].y >= 0 ? x2 : x1, y: y1 + (y2 - y1) / 2 },
						bounds: { x1: Math.min(x1, x2), y1: y1, x2: Math.max(x1, x2), y2: y2 },
						color: color
					});
				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderStackedBar = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var offsetPositiveY = [];
		var offsetNegativeY = [];

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number everytime it is accessed.

		//var yZeroToPixel = (axisYProps.y2 - axisYProps.height / rangeY * Math.abs(0 - plotUnit.axisY.minimum) + .5) << 0;
		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.width * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.height / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / plotUnit.plotType.plotUnits.length * .9) << 0;

		ctx.save();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;

			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;

			dataSeries.maxWidthInX = barWidth / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);

			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				var bevelEnabled = (barWidth > 5) && dataSeries.bevelEnabled ? true : false;

				ctx.strokeStyle = "#4572A7 ";

				for (i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;


					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					y = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					x = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					//var x1 = x - (plotUnit.plotType.plotUnits.length * barWidth / 2) + (plotUnit.index * barWidth) << 0;

					var y1 = y - (plotUnit.plotType.plotUnits.length * barWidth / 2) + (plotUnit.index * barWidth) << 0;
					var y2 = y1 + barWidth << 0;
					var x1;
					var x2;

					if (dataPoints[i].y >= 0) {
						var offset = offsetPositiveY[dataPointX] ? offsetPositiveY[dataPointX] : 0;

						x1 = yZeroToPixel + offset;
						x2 = x + offset;

						offsetPositiveY[dataPointX] = offset + (x2 - x1);

					} else {
						var offset = offsetNegativeY[dataPointX] ? offsetNegativeY[dataPointX] : 0;

						x1 = x - offset;
						x2 = yZeroToPixel - offset;

						offsetNegativeY[dataPointX] = offset + (x2 - x1);
					}


					color = dataPoints[i].color ? dataPoints[i].color : dataSeries._colorSet[i % dataSeries._colorSet.length];
					drawRect(ctx, x1, y1, x2, y2, color, bevelEnabled, false, false, false);

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x1, y1: y1, x2: x2, y2: y2 };
					color = intToHexColorString(id);

					if (isCanvasSupported)
						drawRect(this._eventManager.ghostCtx, x1, y1, x2, y2, color, false, false, false, false);


					this._indexLabels.push({
						chartType: "stackedBar",
						dataPoint: dataPoints[i],
						dataSeries: dataSeries,
						point: { x: dataPoints[i].y >= 0 ? x2 : x1, y: y },
						bounds: { x1: Math.min(x1, x2), y1: y1, x2: Math.max(x1, x2), y2: y2 },
						color: color
					});
				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderStackedBar100 = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var offsetPositiveY = [];
		var offsetNegativeY = [];

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number everytime it is accessed.

		//var yZeroToPixel = (axisYProps.y2 - axisYProps.height / rangeY * Math.abs(0 - plotUnit.axisY.minimum) + .5) << 0;
		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.width * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.height / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / plotUnit.plotType.plotUnits.length * .9) << 0;

		ctx.save();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;

			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;


			dataSeries.maxWidthInX = barWidth / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);

			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);

				var bevelEnabled = (barWidth > 5) && dataSeries.bevelEnabled ? true : false;

				ctx.strokeStyle = "#4572A7 ";

				for (i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;


					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					y = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;

					var yPercent;
					if (plotUnit.dataPointYSums[dataPointX] !== 0)
						yPercent = dataPoints[i].y / plotUnit.dataPointYSums[dataPointX] * 100;
					else
						yPercent = 0;

					x = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (yPercent - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var y1 = y - (plotUnit.plotType.plotUnits.length * barWidth / 2) + (plotUnit.index * barWidth) << 0;
					var y2 = y1 + barWidth << 0;
					var x1;
					var x2;


					if (dataPoints[i].y >= 0) {
						var offset = offsetPositiveY[dataPointX] ? offsetPositiveY[dataPointX] : 0;

						x1 = yZeroToPixel + offset;
						x2 = x + offset;

						offsetPositiveY[dataPointX] = offset + (x2 - x1);

					} else {
						var offset = offsetNegativeY[dataPointX] ? offsetNegativeY[dataPointX] : 0;

						x1 = x - offset;
						x2 = yZeroToPixel - offset;

						offsetNegativeY[dataPointX] = offset + (x2 - x1);
					}


					color = dataPoints[i].color ? dataPoints[i].color : dataSeries._colorSet[i % dataSeries._colorSet.length];
					drawRect(ctx, x1, y1, x2, y2, color, bevelEnabled, false, false, false);

					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x1, y1: y1, x2: x2, y2: y2 };
					color = intToHexColorString(id);

					if (isCanvasSupported)
						drawRect(this._eventManager.ghostCtx, x1, y1, x2, y2, color, false, false, false, false);


					this._indexLabels.push({
						chartType: "stackedBar100",
						dataPoint: dataPoints[i],
						dataSeries: dataSeries,
						point: { x: dataPoints[i].y >= 0 ? x2 : x1, y: y },
						bounds: { x1: Math.min(x1, x2), y1: y1, x2: Math.max(x1, x2), y2: y2 },
						color: color
					});
				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderArea = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var ghostCtx = this._eventManager.ghostCtx;

		var axisXProps = plotUnit.axisX.lineCoordinates;
		var axisYProps = plotUnit.axisY.lineCoordinates;
		var markers = [];

		var plotArea = this.plotArea;
		ctx.save();

		if (isCanvasSupported)
			ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			ghostCtx.beginPath();
			ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];

			var dataPoints = dataSeries.dataPoints;

			var seriesId = dataSeries.id;
			this._eventManager.objectMap[seriesId] = { objectType: "dataSeries", dataSeriesIndex: dataSeriesIndex };

			var hexColor = intToHexColorString(seriesId);
			ghostCtx.fillStyle = hexColor;
			//ghostCtx.lineWidth = dataSeries.lineThickness;
			//ghostCtx.lineWidth = 20;

			markers = [];

			var isFirstDataPointInPlotArea = true;
			var i = 0, x, y;
			var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number back and forth.

			var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;
			var baseY;

			var startPoint = null;

			if (dataPoints.length > 0) {
				//ctx.strokeStyle = "#4572A7 ";                
				color = dataSeries._colorSet[i % dataSeries._colorSet.length];
				//ctx.strokeStyle = "red";
				ctx.fillStyle = color;

				for (; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					if (isFirstDataPointInPlotArea) {
						ctx.beginPath();
						ctx.moveTo(x, y);
						startPoint = { x: x, y: y };

						if (isCanvasSupported) {
							ghostCtx.beginPath();
							ghostCtx.moveTo(x, y);
						}

						isFirstDataPointInPlotArea = false;
					}
					else {

						ctx.lineTo(x, y);

						if (isCanvasSupported)
							ghostCtx.lineTo(x, y);

						if (i % 250 == 0) {

							if (plotUnit.axisY.minimum <= 0 && plotUnit.axisY.maximum >= 0) {
								baseY = yZeroToPixel;
							}
							else if (plotUnit.axisY.maximum < 0)
								baseY = axisYProps.y1;
							else if (plotUnit.axisY.minimum > 0)
								baseY = axisXProps.y2;

							ctx.lineTo(x, baseY);
							ctx.lineTo(startPoint.x, baseY);
							ctx.closePath();
							ctx.fill();
							ctx.beginPath();
							ctx.moveTo(x, y);

							if (isCanvasSupported) {
								ghostCtx.lineTo(x, baseY);
								ghostCtx.lineTo(startPoint.x, baseY);
								ghostCtx.closePath();
								ghostCtx.fill();
								ghostCtx.beginPath();
								ghostCtx.moveTo(x, y);
							}

							startPoint = { x: x, y: y };
						}
					}


					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x, y1: y };

					//Render Marker
					if (dataPoints[i].markerSize !== 0) {
						if (dataPoints[i].markerSize > 0 || dataSeries.markerSize > 0) {
							var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
							markers.push(markerProps);

							if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
								dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
							}

							markerColor = intToHexColorString(id);

							if (isCanvasSupported) {
								markers.push({
									x: x, y: y, ctx: ghostCtx,
									type: markerProps.type,
									size: markerProps.size,
									color: markerColor,
									borderColor: markerColor,
									borderThickness: markerProps.borderThickness
								});
							}
						}
					}

					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "area",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x, y: y },
							color: color
						});

					}
				}

				if (plotUnit.axisY.minimum <= 0 && plotUnit.axisY.maximum >= 0) {
					baseY = yZeroToPixel;
				}
				else if (plotUnit.axisY.maximum < 0)
					baseY = axisYProps.y1;
				else if (plotUnit.axisY.minimum > 0)
					baseY = axisXProps.y2;

				ctx.lineTo(x, baseY);
				ctx.lineTo(startPoint.x, baseY);
				ctx.closePath();
				ctx.fill();

				if (isCanvasSupported) {
					ghostCtx.lineTo(x, baseY);
					ghostCtx.lineTo(startPoint.x, baseY);
					ghostCtx.closePath();
					ghostCtx.fill();
				}

				startPoint = { x: x, y: y };
				RenderHelper.drawMarkers(markers);
			}
		}

		ctx.restore();
		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderSplineArea = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var ghostCtx = this._eventManager.ghostCtx;

		var axisXProps = plotUnit.axisX.lineCoordinates;
		var axisYProps = plotUnit.axisY.lineCoordinates;
		var markers = [];

		var plotArea = this.plotArea;
		ctx.save();

		if (isCanvasSupported)
			ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			ghostCtx.beginPath();
			ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];

			var dataPoints = dataSeries.dataPoints;

			var seriesId = dataSeries.id;
			this._eventManager.objectMap[seriesId] = { objectType: "dataSeries", dataSeriesIndex: dataSeriesIndex };

			var hexColor = intToHexColorString(seriesId);
			ghostCtx.fillStyle = hexColor;
			//ghostCtx.lineWidth = dataSeries.lineThickness;
			//ghostCtx.lineWidth = 20;

			markers = [];

			var isFirstDataPointInPlotArea = true;
			var i = 0, x, y;
			var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number back and forth.

			var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;
			var baseY;

			var startPoint = null;

			var pixels = [];

			if (dataPoints.length > 0) {
				//ctx.strokeStyle = "#4572A7 ";                
				color = dataSeries._colorSet[i % dataSeries._colorSet.length];
				//ctx.strokeStyle = "red";
				ctx.fillStyle = color;

				for (; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					//if (isFirstDataPointInPlotArea) {
					//    ctx.beginPath();
					//    ctx.moveTo(x, y);
					//    startPoint = { x: x, y: y };

					//    ghostCtx.beginPath();
					//    ghostCtx.moveTo(x, y);

					//    isFirstDataPointInPlotArea = false;
					//}
					//else {

					//    ctx.lineTo(x, y);
					//    ghostCtx.lineTo(x, y);

					//    if (i % 250 == 0) {

					//        if (plotUnit.axisY.minimum <= 0 && plotUnit.axisY.maximum >= 0) {
					//            baseY = yZeroToPixel;
					//        }
					//        else if (plotUnit.axisY.maximum < 0)
					//            baseY = axisYProps.y1;
					//        else if (plotUnit.axisY.minimum > 0)
					//            baseY = axisXProps.y2;

					//        ctx.lineTo(x, baseY);
					//        ctx.lineTo(startPoint.x, baseY);
					//        ctx.closePath();
					//        ctx.fill();
					//        ctx.beginPath();
					//        ctx.moveTo(x, y);


					//        ghostCtx.lineTo(x, baseY);
					//        ghostCtx.lineTo(startPoint.x, baseY);
					//        ghostCtx.closePath();
					//        ghostCtx.fill();
					//        ghostCtx.beginPath();
					//        ghostCtx.moveTo(x, y);

					//        startPoint = { x: x, y: y };
					//    }
					//}


					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x, y1: y };

					pixels[pixels.length] = { x: x, y: y };

					//Render Marker
					if (dataPoints[i].markerSize !== 0) {
						if (dataPoints[i].markerSize > 0 || dataSeries.markerSize > 0) {
							var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
							markers.push(markerProps);

							if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
								dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
							}

							markerColor = intToHexColorString(id);

							if (isCanvasSupported) {
								markers.push({
									x: x, y: y, ctx: ghostCtx,
									type: markerProps.type,
									size: markerProps.size,
									color: markerColor,
									borderColor: markerColor,
									borderThickness: markerProps.borderThickness
								});
							}
						}
					}


					//Render Index Labels
					if (dataPoints[i].indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "splineArea",
							dataPoint: dataPoints[i],
							dataSeries: dataSeries,
							point: { x: x, y: y },
							color: color
						});

					}
				}

				var bp = getBezierPoints(pixels, 2);

				if (bp.length > 0) {
					ctx.beginPath();
					ctx.moveTo(bp[0].x, bp[0].y);

					if (isCanvasSupported) {
						ghostCtx.beginPath();
						ghostCtx.moveTo(bp[0].x, bp[0].y);
					}


					for (var i = 0; i < bp.length - 3; i += 3) {

						ctx.bezierCurveTo(bp[i + 1].x, bp[i + 1].y, bp[i + 2].x, bp[i + 2].y, bp[i + 3].x, bp[i + 3].y);

						if (isCanvasSupported)
							ghostCtx.bezierCurveTo(bp[i + 1].x, bp[i + 1].y, bp[i + 2].x, bp[i + 2].y, bp[i + 3].x, bp[i + 3].y);

					}

					if (plotUnit.axisY.minimum <= 0 && plotUnit.axisY.maximum >= 0) {
						baseY = yZeroToPixel;
					}
					else if (plotUnit.axisY.maximum < 0)
						baseY = axisYProps.y1;
					else if (plotUnit.axisY.minimum > 0)
						baseY = axisXProps.y2;

					startPoint = { x: bp[0].x, y: bp[0].y };

					ctx.lineTo(bp[bp.length - 1].x, baseY);
					ctx.lineTo(startPoint.x, baseY);
					ctx.closePath();
					ctx.fill();

					if (isCanvasSupported) {
						ghostCtx.lineTo(bp[bp.length - 1].x, baseY);
						ghostCtx.lineTo(startPoint.x, baseY);
						ghostCtx.closePath();
						ghostCtx.fill();
					}
				}


				RenderHelper.drawMarkers(markers);
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderStackedArea = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;
		var markers = [];

		var plotArea = this.plotArea;

		var offsetY = [];

		var allXValues = [];
		//var offsetNegativeY = [];

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number everytime it is accessed.

		//var yZeroToPixel = (axisYProps.y2 - axisYProps.height / rangeY * Math.abs(0 - plotUnit.axisY.minimum) + .5) << 0;
		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;

		var ghostCtx = this._eventManager.ghostCtx;

		if (isCanvasSupported)
			ghostCtx.beginPath();

		ctx.save();

		if (isCanvasSupported)
			ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			ghostCtx.beginPath();
			ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			ghostCtx.clip();
		}

		xValuePresent = [];
		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];
			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var xValue;

			dataSeries.dataPointIndexes = [];

			for (i = 0; i < dataPoints.length; i++) {
				xValue = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;
				dataSeries.dataPointIndexes[xValue] = i;

				if (!xValuePresent[xValue]) {
					allXValues.push(xValue);
					xValuePresent[xValue] = true;
				}
			}

			allXValues.sort(compareNumbers);
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;

			var currentBaseValues = [];


			var seriesId = dataSeries.id;
			this._eventManager.objectMap[seriesId] = { objectType: "dataSeries", dataSeriesIndex: dataSeriesIndex };
			var hexColor = intToHexColorString(seriesId);
			ghostCtx.fillStyle = hexColor;



			if (allXValues.length > 0) {

				color = dataSeries._colorSet[0];
				//ctx.strokeStyle = "red";
				ctx.fillStyle = color;

				for (i = 0; i < allXValues.length; i++) {

					dataPointX = allXValues[i];
					var dataPoint = null;

					if (dataSeries.dataPointIndexes[dataPointX] >= 0)
						dataPoint = dataPoints[dataSeries.dataPointIndexes[dataPointX]];
					else
						dataPoint = { x: dataPointX, y: 0 };

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoint.y) !== "number")
						continue;

					var x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					var y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoint.y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var offset = offsetY[dataPointX] ? offsetY[dataPointX] : 0;

					y = y - offset;
					currentBaseValues.push({ x: x, y: yZeroToPixel - offset });
					offsetY[dataPointX] = yZeroToPixel - y;

					if (isFirstDataPointInPlotArea) {
						ctx.beginPath();
						ctx.moveTo(x, y);

						if (isCanvasSupported) {
							ghostCtx.beginPath();
							ghostCtx.moveTo(x, y);
						}

						isFirstDataPointInPlotArea = false;
					}
					else {

						ctx.lineTo(x, y);

						if (isCanvasSupported)
							ghostCtx.lineTo(x, y);

						if (i % 250 == 0) {

							while (currentBaseValues.length > 0) {
								var point = currentBaseValues.pop();
								ctx.lineTo(point.x, point.y);

								if (isCanvasSupported)
									ghostCtx.lineTo(point.x, point.y);

							}

							ctx.closePath();
							ctx.fill();

							ctx.beginPath();
							ctx.moveTo(x, y);

							if (isCanvasSupported) {
								ghostCtx.closePath();
								ghostCtx.fill();

								ghostCtx.beginPath();
								ghostCtx.moveTo(x, y);
							}

							currentBaseValues.push({ x: x, y: yZeroToPixel - offset });
						}

					}

					if (dataSeries.dataPointIndexes[dataPointX] >= 0) {
						var id = dataSeries.dataPointIds[dataSeries.dataPointIndexes[dataPointX]];
						this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: dataSeries.dataPointIndexes[dataPointX], x1: x, y1: y };
					}

					//Render Marker
					if (dataSeries.dataPointIndexes[dataPointX] >= 0 && dataPoint.markerSize !== 0) {
						if (dataPoint.markerSize > 0 || dataSeries.markerSize > 0) {

							var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
							markers.push(markerProps);

							if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
								dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
							}

							markerColor = intToHexColorString(id);

							if (isCanvasSupported) {
								markers.push({
									x: x, y: y, ctx: ghostCtx,
									type: markerProps.type,
									size: markerProps.size,
									color: markerColor,
									borderColor: markerColor,
									borderThickness: markerProps.borderThickness
								});
							}
						}
					}

					if (dataPoint.indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "stackedArea",
							dataPoint: dataPoint,
							dataSeries: dataSeries,
							point: { x: x, y: y },
							color: color
						});

					}
				}

				while (currentBaseValues.length > 0) {
					var point = currentBaseValues.pop();
					ctx.lineTo(point.x, point.y);

					if (isCanvasSupported)
						ghostCtx.lineTo(point.x, point.y);
				}

				ctx.closePath();
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(x, y);

				if (isCanvasSupported) {
					ghostCtx.closePath();
					ghostCtx.fill();
					ghostCtx.beginPath();
					ghostCtx.moveTo(x, y);
				}
			}

			delete (dataSeries.dataPointIndexes);
		}

		RenderHelper.drawMarkers(markers);


		ctx.restore();

		if (isCanvasSupported)
			ghostCtx.restore();
	}

	Chart.prototype.renderStackedArea100 = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;
		var markers = [];

		var offsetY = [];

		var allXValues = [];
		//var offsetNegativeY = [];

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number everytime it is accessed.


		//var yZeroToPixel = (axisYProps.y2 - axisYProps.height / rangeY * Math.abs(0 - plotUnit.axisY.minimum) + .5) << 0;
		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.width * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.width / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) * .9) << 0;

		var ghostCtx = this._eventManager.ghostCtx;

		ctx.save();

		if (isCanvasSupported)
			ghostCtx.save();


		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			ghostCtx.beginPath();
			ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			ghostCtx.clip();
		}

		xValuePresent = [];
		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];
			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var xValue;

			dataSeries.dataPointIndexes = [];

			for (i = 0; i < dataPoints.length; i++) {
				xValue = dataPoints[i].x.getTime ? dataPoints[i].x.getTime() : dataPoints[i].x;
				dataSeries.dataPointIndexes[xValue] = i;

				if (!xValuePresent[xValue]) {
					allXValues.push(xValue);
					xValuePresent[xValue] = true;
				}
			}

			allXValues.sort(compareNumbers);
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;


			var seriesId = dataSeries.id;
			this._eventManager.objectMap[seriesId] = { objectType: "dataSeries", dataSeriesIndex: dataSeriesIndex };
			var hexColor = intToHexColorString(seriesId);
			ghostCtx.fillStyle = hexColor;

			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;

			var currentBaseValues = [];

			if (allXValues.length > 0) {

				color = dataSeries._colorSet[i % dataSeries._colorSet.length];
				//ctx.strokeStyle = "red";
				ctx.fillStyle = color;

				var bevelEnabled = (barWidth > 5) ? false : false;

				//ctx.strokeStyle = "#4572A7 ";

				for (i = 0; i < allXValues.length; i++) {

					dataPointX = allXValues[i];
					var dataPoint = null;

					if (dataSeries.dataPointIndexes[dataPointX] >= 0)
						dataPoint = dataPoints[dataSeries.dataPointIndexes[dataPointX]];
					else
						dataPoint = { x: dataPointX, y: 0 };

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoint.y) !== "number")
						continue;

					var yPercent;
					if (plotUnit.dataPointYSums[dataPointX] !== 0)
						yPercent = dataPoint.y / plotUnit.dataPointYSums[dataPointX] * 100;
					else
						yPercent = 0;

					var x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					var y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (yPercent - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var offset = offsetY[dataPointX] ? offsetY[dataPointX] : 0;

					y = y - offset;
					currentBaseValues.push({ x: x, y: yZeroToPixel - offset });
					offsetY[dataPointX] = yZeroToPixel - y;

					if (isFirstDataPointInPlotArea) {
						ctx.beginPath();
						ctx.moveTo(x, y);

						if (isCanvasSupported) {
							ghostCtx.beginPath();
							ghostCtx.moveTo(x, y);
						}

						isFirstDataPointInPlotArea = false;
					}
					else {

						ctx.lineTo(x, y);

						if (isCanvasSupported)
							ghostCtx.lineTo(x, y);

						if (i % 250 == 0) {

							while (currentBaseValues.length > 0) {
								var point = currentBaseValues.pop();
								ctx.lineTo(point.x, point.y);

								if (isCanvasSupported)
									ghostCtx.lineTo(point.x, point.y);
							}

							ctx.closePath();
							ctx.fill();
							ctx.beginPath();
							ctx.moveTo(x, y);

							if (isCanvasSupported) {
								ghostCtx.closePath();
								ghostCtx.fill();
								ghostCtx.beginPath();
								ghostCtx.moveTo(x, y);
							}

							currentBaseValues.push({ x: x, y: yZeroToPixel - offset });
						}
					}


					if (dataSeries.dataPointIndexes[dataPointX] >= 0) {
						var id = dataSeries.dataPointIds[dataSeries.dataPointIndexes[dataPointX]];
						this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: dataSeries.dataPointIndexes[dataPointX], x1: x, y1: y };
					}

					//Render Marker
					if (dataSeries.dataPointIndexes[dataPointX] >= 0 && dataPoint.markerSize !== 0) {
						if (dataPoint.markerSize > 0 || dataSeries.markerSize > 0) {
							var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
							markers.push(markerProps);

							if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
								dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
							}

							markerColor = intToHexColorString(id);

							if (isCanvasSupported) {
								markers.push({
									x: x, y: y, ctx: ghostCtx,
									type: markerProps.type,
									size: markerProps.size,
									color: markerColor,
									borderColor: markerColor,
									borderThickness: markerProps.borderThickness
								});
							}
						}
					}

					if (dataPoint.indexLabel || dataSeries.indexLabel) {

						this._indexLabels.push({
							chartType: "stackedArea100",
							dataPoint: dataPoint,
							dataSeries: dataSeries,
							point: { x: x, y: y },
							color: color
						});

					}
				}

				while (currentBaseValues.length > 0) {
					var point = currentBaseValues.pop();
					ctx.lineTo(point.x, point.y);

					if (isCanvasSupported)
						ghostCtx.lineTo(point.x, point.y);
				}

				ctx.closePath();
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(x, y);

				if (isCanvasSupported) {
					ghostCtx.closePath();
					ghostCtx.fill();
					ghostCtx.beginPath();
					ghostCtx.moveTo(x, y);
				}
			}

			delete (dataSeries.dataPointIndexes);
		}

		RenderHelper.drawMarkers(markers);

		ctx.restore();

		if (isCanvasSupported)
			ghostCtx.restore();
	}

	Chart.prototype.renderBubble = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number from dataTime everytime it is used.

		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.width * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.width / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / totalDataSeries * .9) << 0;


		ctx.save();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}

		var maxZ = -Infinity;
		var minZ = Infinity;

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];
			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var z = 0;

			for (var i = 0; i < dataPoints.length; i++) {

				dataPointX = dataPoints[i].getTime ? dataPointX = dataPoints[i].x.getTime() : dataPointX = dataPoints[i].x;

				if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
					continue;
				}

				if (typeof (dataPoints[i].z) !== "undefined") {

					z = dataPoints[i].z;

					if (z > maxZ)
						maxZ = z;

					if (z < minZ)
						minZ = z;
				}
			}
		}

		var minArea = Math.PI * 5 * 5;
		var maxArea = Math.max(Math.pow(Math.min(plotArea.height, plotArea.width) * .25 / 2, 2) * Math.PI, minArea);

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;

			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;

			if (dataPoints.length > 0) {
				//var xy = this.getPixelCoordinatesOnPlotArea(dataPoints[0].x, dataPoints[0].y);
				//var bevelEnabled = (barWidth > 5) ? false : false;

				ctx.strokeStyle = "#4572A7 ";



				for (var i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].getTime ? dataPointX = dataPoints[i].x.getTime() : dataPointX = dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var z = dataPoints[i].z;

					var area = minArea + (maxArea - minArea) / (maxZ - minZ) * (z - minZ);
					var radius = Math.max(Math.sqrt(area / Math.PI) << 0, 1);

					var markerSize = radius * 2;
					var markerProps = dataSeries.getMarkerProperties(i, ctx);
					markerProps.size = markerSize;
					//markers.push(markerProps);

					//color = dataSeries._colorSet[i % dataSeries._colorSet.length];

					//var markerType = dataSeries.markerType ? dataSeries.markerType : "circle";


					RenderHelper.drawMarker(x, y, ctx, markerProps.type, markerProps.size, markerProps.color, markerProps.borderColor, markerProps.borderThickness);
					//RenderHelper.drawMarker(x, y, ctx, "square", radius * 2, color);
					//RenderHelper.drawMarker(x, y, ctx, "triangle", radius * 2, color, "#000000", 0);
					//RenderHelper.drawMarker(x, y, ctx, "cross", radius * 2, color, "#000000", 2);

					//ctx.moveTo(x, y);
					//ctx.beginPath();
					//ctx.arc(x, y, radius, 0, 360, false);
					//ctx.fill();

					if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
						dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
					}


					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x, y1: y, size: markerSize };
					var markerColor = intToHexColorString(id);
					//RenderHelper.drawMarker(x, y, this._eventManager.ghostCtx, markerType, markerSize, markerColor, markerColor, dataSeries.markerBorderThickness);
					if (isCanvasSupported)
						RenderHelper.drawMarker(x, y, this._eventManager.ghostCtx, markerProps.type, markerProps.size, markerColor, markerColor, markerProps.borderThickness);

				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	Chart.prototype.renderScatter = function (plotUnit) {
		var ctx = this.plotArea.ctx;
		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var color = null;

		var plotArea = this.plotArea;

		var i = 0, x, y;
		var dataPointX; //Used so that when dataPoint.x is a DateTime value, it doesn't get converted to number from dataTime everytime it is used.

		var yZeroToPixel = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (0 - plotUnit.axisY.convertionParameters.minimum)) << 0;

		var maxBarWidth = this.width * .15;
		var xMinDiff = plotUnit.axisX.dataInfo.minDiff;
		var barWidth = (((plotArea.width / Math.abs(plotUnit.axisX.maximum - plotUnit.axisX.minimum)) * Math.abs(xMinDiff)) / totalDataSeries * .9) << 0;


		ctx.save();
		if (isCanvasSupported)
			this._eventManager.ghostCtx.save();

		ctx.beginPath();
		ctx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		ctx.clip();

		if (isCanvasSupported) {
			this._eventManager.ghostCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
			this._eventManager.ghostCtx.clip();
		}

		for (var j = 0; j < plotUnit.dataSeriesIndexes.length; j++) {

			var dataSeriesIndex = plotUnit.dataSeriesIndexes[j];

			var dataSeries = this.data[dataSeriesIndex];
			var dataPoints = dataSeries.dataPoints;
			var isFirstDataPointInPlotArea = true;

			if (dataPoints.length == 1)
				barWidth = maxBarWidth;

			if (barWidth < 1)
				barWidth = 1;
			else if (barWidth > maxBarWidth)
				barWidth = maxBarWidth;

			if (dataPoints.length > 0) {
				//var bevelEnabled = (barWidth > 5) ? false : false;

				ctx.strokeStyle = "#4572A7 ";

				var maxArea = Math.pow(Math.min(plotArea.height, plotArea.width) * .3 / 2, 2) * Math.PI;

				var prevDataPointX = 0;
				var prevDataPointY = 0;

				for (var i = 0; i < dataPoints.length; i++) {

					dataPointX = dataPoints[i].getTime ? dataPointX = dataPoints[i].x.getTime() : dataPointX = dataPoints[i].x;

					if (dataPointX < plotUnit.axisX.dataInfo.viewPortMin || dataPointX > plotUnit.axisX.dataInfo.viewPortMax) {
						continue;
					}

					if (typeof (dataPoints[i].y) !== "number")
						continue;

					x = (plotUnit.axisX.convertionParameters.reference + plotUnit.axisX.convertionParameters.pixelPerUnit * (dataPointX - plotUnit.axisX.convertionParameters.minimum) + .5) << 0;
					y = (plotUnit.axisY.convertionParameters.reference + plotUnit.axisY.convertionParameters.pixelPerUnit * (dataPoints[i].y - plotUnit.axisY.convertionParameters.minimum) + .5) << 0;

					var markerProps = dataSeries.getMarkerProperties(i, x, y, ctx);
					RenderHelper.drawMarker(markerProps.x, markerProps.y, markerProps.ctx, markerProps.type, markerProps.size, markerProps.color, markerProps.color, markerProps.thickness);

					//if (Math.abs(prevDataPointX - x) < markerProps.size / 2 && Math.abs(prevDataPointY - y) < markerProps.size / 2) {
					//    continue;
					//}

					if (!dataSeries.maxWidthInX || markerProps.size > dataSeries.maxWidthInX) {
						dataSeries.maxWidthInX = markerProps.size / (plotUnit.axisX.convertionParameters.pixelPerUnit > 1 ? plotUnit.axisX.convertionParameters.pixelPerUnit - 1 : plotUnit.axisX.convertionParameters.pixelPerUnit);
					}

					if (Math.sqrt((prevDataPointX - x) * (prevDataPointX - x) + (prevDataPointY - y) * (prevDataPointY - y)) < Math.min(markerProps.size, 5)) {
						continue;
					}

					//Render ID on Ghost Canvas - for event handling
					var id = dataSeries.dataPointIds[i];
					this._eventManager.objectMap[id] = { objectType: "dataPoint", dataSeriesIndex: dataSeriesIndex, dataPointIndex: i, x1: x, y1: y };
					var markerColor = intToHexColorString(id);

					if (isCanvasSupported) {
						RenderHelper.drawMarker(
								markerProps.x, markerProps.y, this._eventManager.ghostCtx,
								markerProps.type,
								markerProps.size,
								markerColor,
								markerColor,
								markerProps.borderThickness
							);
					}
					//markers.push();

					prevDataPointX = x;
					prevDataPointY = y;
				}
			}
		}

		ctx.restore();

		if (isCanvasSupported)
			this._eventManager.ghostCtx.restore();
	}

	//#region pieChart

	var drawSegment = function (ctx, center, radius, color, type, theta1, theta2) {


		ctx.save();

		if (type === "pie") {
			ctx.beginPath();
			ctx.moveTo(center.x, center.y);
			ctx.arc(center.x, center.y, radius, theta1, theta2, false);
			ctx.fillStyle = color;
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			//    ctx.shadowOffsetX = 2;
			//    ctx.shadowOffsetY = 1;
			//     ctx.shadowBlur = 2;
			//    ctx.shadowColor = '#BFBFBF';
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
		else if (type === "doughnut") {
			var widthPercentage = 0.60;

			ctx.beginPath();
			//ctx.moveTo(center.x, center.y);
			ctx.arc(center.x, center.y, radius, theta1, theta2, false);
			ctx.arc(center.x, center.y, widthPercentage * radius, theta2, theta1, true);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			// shadow properties
			//     ctx.shadowOffsetX = 1;
			//    ctx.shadowOffsetY = 1;
			//     ctx.shadowBlur = 1;
			//    ctx.shadowColor = '#BFBFBF';  //grey shadow
			ctx.stroke();
			ctx.fill();
		}

		ctx.restore();
	};


	Chart.prototype.renderPie = function (plotUnit) {

		var totalDataSeries = plotUnit.dataSeriesIndexes.length;

		if (totalDataSeries <= 0)
			return;

		var dataSeriesIndex = plotUnit.dataSeriesIndexes[0];
		var dataSeries = this.data[dataSeriesIndex];


		var explodeOffset = 0.07;


		var drawSegmentLabel = function (ctx, x1, x2, y1, y2, currentlyExploded, label, radius, theta, indexLabelFontColor, placement, indexLabelLineColor, indexLabelLineThickness, frame, fps, pastExploded, labelLength,
			indexLabelFontStyle, indexLabelFontWeight, indexLabelFontSize, indexLabelFontFamily, indexLabelBackgroundColor, index) {
			ctx.save();

			ctx.lineWidth = indexLabelLineThickness;

			ctx.font = indexLabelFontStyle + " " + indexLabelFontWeight + " " + indexLabelFontSize + "px " + indexLabelFontFamily;

			var textAlign = 'left';
			if (x1 < 0 && placement === "outside")
				textAlign = 'right';
			else if (x1 >= 0 && placement === "outside")
				textAlign = 'left';
			else if (placement === "inside")
				textAlign = 'center';

			ctx.textAlign = textAlign;
			ctx.textBaseline = "middle";
			ctx.beginPath();

			if (indexLabelBackgroundColor) {

				var size = dataSeries.indexLabelFontSize / 2;
				var length = labelLength
				ctx.fillStyle = indexLabelBackgroundColor;
				var padding = 5;
				if (placement === "outside") {

					if (x1 >= 0) {
						ctx.fillRect(x1 - padding / 2, y1 - padding / 2, x2 - x1 + padding, y2 - y1 + padding);
					}
					else {
						ctx.fillRect(x1 + padding / 2, y1 - padding / 2, x2 - x1 - padding, y2 - y1 + padding);
					}
				}
				else if (placement === "inside") {

					if (x1 >= 0) {
						ctx.fillRect(x1 - labelLength / 2 - padding / 2, y1 - padding / 2, x2 - x1 + padding, y2 - y1 + padding);
					}
					else {
						ctx.fillRect(x1 + labelLength / 2 + padding / 2, y1 - padding / 2, x2 - x1 - padding, y2 - y1 + padding);
					}
				}
			}




			ctx.fillStyle = indexLabelFontColor;
			if (x1 > 0) {
				ctx.fillText(label, x1, (y1 + y2) / 2);
			}
			else {
				ctx.fillText(label, x1, (y1 + y2) / 2);

			}



			if (placement === "outside" && labelLengths[index]) {

				var pointX = radius * (Math.cos(theta));
				var pointY = radius * (Math.sin(theta));



				if (currentlyExploded === true && pastExploded !== true) {
					pointX += (radius * explodeOffset * (Math.cos(theta)) / fps * (frame));
					pointY += (radius * explodeOffset * (Math.sin(theta))) / fps * (frame);
				}
				else if (currentlyExploded === true && pastExploded === true) {
					pointX += (radius * explodeOffset * (Math.cos(theta)));
					pointY += (radius * explodeOffset * (Math.sin(theta)));
				}
				else if (currentlyExploded !== true && pastExploded === true) {
					pointX += (radius * explodeOffset * (Math.cos(theta)) / fps * (frame));
					pointY += (radius * explodeOffset * (Math.sin(theta))) / fps * (frame);
				}


				ctx.moveTo(pointX, pointY);
				if (x1 > 0) {
					ctx.lineTo(x1 - 10, (y1 + y2) / 2);
					ctx.lineTo(x1 - 2, (y1 + y2) / 2);
				}
				else if (x1 < 0) {
					ctx.lineTo(x1 + 10, (y1 + y2) / 2);
					ctx.lineTo(x1 + 2, (y1 + y2) / 2);
				}

				ctx.strokeStyle = indexLabelLineColor;
				ctx.stroke();
			}


			ctx.restore();
		};

		ctx = this.plotArea.ctx;


		/*************internal VARIABLES ******************/
		var labelLengths = [];
		var arcAngles = [];
		var labelLocationAngles = [];
		var labelTexts = [];
		var total = 0;
		var radius = 0;
		var x1 = [], x2 = [], y1 = [], y2 = [];
		var noDataPoints = dataSeries.dataPoints.length;


		/*************** get plot area  ***********/
		var plotArea = this.plotArea;
		plotArea.width = plotArea.x2 - plotArea.x1;
		plotArea.height = plotArea.y2 - plotArea.y1;
		var plotAreaCenter = { x: (plotArea.x2 + plotArea.x1) / 2, y: (plotArea.y2 + plotArea.y1) / 2 };



		/*******Setting properties********/

		if (dataSeries.startAngle) {
			var startAngle = dataSeries.startAngle
		}
		else
			var startAngle = 0;
		startAngle = ((startAngle % 360) + 360) % 360;
		startAngle = startAngle * Math.PI / 180;
		arcAngles.push(startAngle);

		var colorPallet = this._selectedColorSet;
		var labelRadius = (Math.min(plotArea.width, plotArea.height) * 0.5);

		//   var color = dataSeries.dataPoints[i].color ? dataSeries.dataPoints[i].color : dataSeries.color ? dataSeries.color : colorPallet[(i % colorPallet.length)];


		//calculating labelLengths && labelTexts
		for (var i = 0; i < noDataPoints; i++) {

			var labelText = dataSeries.dataPoints[i].indexLabel ? dataSeries.dataPoints[i].indexLabel : dataSeries.indexLabel ? dataSeries.indexLabel : dataSeries.dataPoints[i].label ? dataSeries.dataPoints[i].label : dataSeries.label ? dataSeries.label : '';

			var labelText = this.replaceKeywordsWithValue(labelText, dataSeries.dataPoints[i], dataSeries, i);


			labelTexts.push(labelText);
			var indexLabelFontStyle = dataSeries.dataPoints[i].indexLabelFontStyle ? dataSeries.dataPoints[i].indexLabelFontStyle : dataSeries.indexLabelFontStyle;
			var indexLabelFontWeight = dataSeries.dataPoints[i].indexLabelFontWeight ? dataSeries.dataPoints[i].indexLabelFontWeight : dataSeries.indexLabelFontWeight;
			var indexLabelFontSize = dataSeries.dataPoints[i].indexLabelFontSize ? dataSeries.dataPoints[i].indexLabelFontSize : dataSeries.indexLabelFontSize;
			var indexLabelFontFamily = dataSeries.dataPoints[i].indexLabelFontFamily ? dataSeries.dataPoints[i].indexLabelFontFamily : dataSeries.indexLabelFontFamily;

			ctx.save();
			ctx.font = indexLabelFontStyle + " " + indexLabelFontWeight + " " + indexLabelFontSize + "px " + indexLabelFontFamily;
			var labelLength = ctx.measureText(labelTexts[i]).width;

			ctx.restore();

			labelLengths.push(labelLength);

			total += Math.abs(dataSeries.dataPoints[i].y);   // considering negative values as positive
		}

		var totalLabelLength = 0;
		for (var i = 0; i < noDataPoints; i++) {
			var labelLocation;
			var data = Math.abs(dataSeries.dataPoints[i].y);

			labelLocation = (Math.PI * 2 * (data / total));
			arcAngles.push(arcAngles[i] + labelLocation);
			labelLocation = labelLocation / 2 + (arcAngles[i]);
			labelLocationAngles.push(labelLocation % (Math.PI * 2));

			totalLabelLength += labelLengths[i];
		}
		// setting label placement inside if there is no label

		if (totalLabelLength === 0)
			dataSeries.indexLabelPlacement = "inside";

		var once = 0;

		if (dataSeries.indexLabelPlacement === "inside") {
			labelRadius = (1 - explodeOffset) * 0.80 * labelRadius;

			for (var i = 0; i < noDataPoints; i++) {

				var dx = labelRadius * (Math.cos((labelLocationAngles[i])));
				var dy = labelRadius * (Math.sin((labelLocationAngles[i])));
				x1.push(dx);
				if (dx > 0)
					x2.push(x1[i] + labelLengths[i]);
				else
					x2.push(x1[i] - labelLengths[i]);

				y1.push(dy - dataSeries.indexLabelFontSize / 2);
				y2.push(dy + dataSeries.indexLabelFontSize / 2);
			}

		}

		else if (dataSeries.indexLabelPlacement === "outside") {
			for (var iteration = 0; iteration < 3; iteration++) {
				// calculating coordinates for labels
				for (var i = 0; i < noDataPoints; i++) {

					var dx = labelRadius * (Math.cos((labelLocationAngles[i])));
					var dy = labelRadius * (Math.sin((labelLocationAngles[i])));
					x1.push(dx);
					if (dx > 0)
						x2.push(x1[i] + labelLengths[i]);
					else
						x2.push(x1[i] - labelLengths[i]);

					y1.push(dy - dataSeries.indexLabelFontSize / 2);
					y2.push(dy + dataSeries.indexLabelFontSize / 2);
				}



				// loop from 1st to last quadrent 

				for (var i = 0; i < noDataPoints; i++) {
					if (labelLocationAngles[i] < Math.PI / 2) {
						if (i >= 1) {
							if (y1[i] < y2[i - 1]) {
								//////// //alert("i is "+ i + "" + y1[i] + "  "+ y2[i] + " 1st smaller than this " +y2[i-1]);
								var add = ((y2[i - 1]) - y1[i]);
								y1[i] += add + 2;
								y2[i] += add + 2;
								// removing padding if datapoints are greater than 20
								if (noDataPoints < 20) {
									y1[i] += 3;
									y2[i] += 3;
								}
							}
						}
					}
					if (labelLocationAngles[i] < Math.PI * 3 / 2 && labelLocationAngles[i] >= Math.PI) {

						if (y2[i] > y1[i - 1]) {
							var sub = y2[i] - y1[i - 1];
							y1[i] -= sub + 2;
							y2[i] -= sub + 2;
							// removing padding if datapoints are greater than 20
							if (noDataPoints < 20) {
								y1[i] -= 3;
								y2[i] -= 3;
							}
						}

					}
				}

				// loop from last to first quadrent 
				for (var i = noDataPoints; i >= 0; i--) {
					if (labelLocationAngles[i] < Math.PI && labelLocationAngles[i] >= Math.PI / 2) {
						if (y1[i] < y2[i + 1]) {
							var diff = y2[i + 1] - y1[i];
							y1[i] += diff + 2;
							y2[i] += diff + 2;
							// removing padding if datapoints are greater than 20
							if (noDataPoints < 20) {
								y1[i] += 3;
								y2[i] += 3;
							}
						}
					}
					if (labelLocationAngles[i] >= Math.PI * 3 / 2) {
						if (y2[i] > y1[i + 1]) {
							add = y2[i] - y1[i + 1];
							y1[i] -= add;
							y2[i] -= add;
							// removing padding if datapoints are greater than 20
							if (noDataPoints < 20) {
								y1[i] += -3;
								y2[i] += -3;
							}
						}
					}
				}


				if (once < 2) {
					var topOverflow = Math.min.apply(Math, y1.concat(y2));
					var bottomOverflow = Math.max.apply(Math, y1.concat(y2));

					var rightOverflow = Math.max.apply(Math, x2.concat(x1));
					var leftOverflow = Math.min.apply(Math, x2.concat(x1));

					var overFlow = [];
					if ((Math.abs(topOverflow)) > (plotArea.height / 2)) {
						overFlow.push(Math.abs(topOverflow) - (plotArea.height / 2));
					}
					if (Math.abs(bottomOverflow) > (plotArea.height / 2)) {
						overFlow.push(Math.abs(bottomOverflow) - plotArea.height / 2);
					}

					if ((Math.abs(rightOverflow)) > (plotArea.width / 2)) {
						overFlow.push(Math.abs(rightOverflow) - plotArea.width / 2)
					}
					if (Math.abs(leftOverflow) > (plotArea.width / 2)) {
						overFlow.push(Math.abs(leftOverflow) - plotArea.width / 2)
					}
					//// emptying all the arrays for second iteration					
					x1 = []; x2 = [];
					y1 = []; y2 = [];
					if (overFlow.length) {

						labelRadius = labelRadius - (Math.max.apply(Math, overFlow) + dataSeries.indexLabelFontSize / 2 + 2);
						if (labelRadius < 40)
							labelRadius = 40;
					}
					once++;
				}
			}

		}




		var that = this;
		var animationParameter = { frame: 0, maxAngle: arcAngles[0], count: 0 };

		if (that.renderCount !== 0)
			this.animationEnabled = false;

		animationParameter.isAnimating = 60;


		animate();


		function animate() {

			that.ctx.save();

			if (isCanvasSupported)
				that._eventManager.ghostCtx.save();

			that.ctx.translate(plotAreaCenter.x, plotAreaCenter.y);  // translating the context to center of plot area.

			if (isCanvasSupported)
				that._eventManager.ghostCtx.translate(plotAreaCenter.x, plotAreaCenter.y); // translating the context of ghost canvas to center of plot area.

			//that.ctx.fillStyle = "#FFFFFF";
			//that.ctx.fillStyle = that.backgroundColor ? that.backgroundColor : "white";
			that.ctx.clearRect(-plotArea.width / 2, -plotArea.height / 2, plotArea.width, plotArea.height);
			if (that.animationEnabled === true)
				var fps = 60;
			else
				var fps = 1;

			if (animationParameter != null && animationParameter.frame <= fps) {

				animationParameter.isAnimating--;

				var prevEndAngle = arcAngles[0];
				var maxAngle = animationParameter.maxAngle + (2 * Math.PI / fps);
				//var maxAngle = arcAngles[0] + (2 * Math.PI / fps * animationParameter.frame);
				var shouldBreak = false;

				for (var i = 0; i < noDataPoints; i++) {

					var exploded = dataSeries.dataPoints[i].exploded;
					var color = dataSeries.dataPoints[i].color ? dataSeries.dataPoints[i].color : dataSeries.color ? dataSeries.color : colorPallet[(i % colorPallet.length)];

					var startAngle = prevEndAngle;
					var endAngle = prevEndAngle = startAngle + ((2 * Math.PI / total) * Math.abs(dataSeries.dataPoints[i].y));
					if (endAngle > maxAngle) {
						endAngle = maxAngle;
						//shouldBreak = true;
					}
					type = dataSeries.type;

					if (dataSeries.indexLabelPlacement === "outside") {
						var maxAvail = Math.min(plotArea.width, plotArea.height)
						indexLineMinLength = maxAvail / 14;

						//    indexLineMinLength = 40;
						if (indexLineMinLength < labelRadius)
							radius = labelRadius - indexLineMinLength;
						else
							radius = labelRadius - 25;
					}

					else if (dataSeries.indexLabelPlacement === "inside") {
						radius = (1 - explodeOffset) * (Math.min(plotArea.width, plotArea.height) * 0.5);
					}

					//  that.radius = radius;

					var center = { x: 0, y: 0 }

					if (!shouldBreak) {
						drawSegment(that.ctx, center, radius, color, type, startAngle, endAngle);
					}

					var currentlyExploded;

					if (dataSeries.dataPoints[i].exploded === true)
						currentlyExploded = true;
					else
						currentlyExploded = false;



					//if (typeof (dataSeries.dataPoints[i]) === Boolean)
					//    userSetExploed = true;

					var id = dataSeries.dataPointIds[i];

					that._eventManager.objectMap[id] = {
						objectType: "dataPoint", dataSeriesIndex: 0, dataPointIndex: i, center: { x: plotAreaCenter.x, y: plotAreaCenter.y },
						radius: radius, color: color, startAngle: arcAngles[i], endAngle: arcAngles[i + 1], currentlyExploded: currentlyExploded, userSetExploded: exploded, pastExploded: false
					};
					var rgb = intToRGB(id);

					if (isCanvasSupported)
						that._eventManager.ghostCtx.save();
					color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

					if (isCanvasSupported) {
						drawSegment(that._eventManager.ghostCtx, center, radius, color, type, arcAngles[i], arcAngles[i + 1]);
						that._eventManager.ghostCtx.restore();
					}

					if (endAngle === maxAngle)
						shouldBreak = true;

					//if (shouldBreak)
					//    break;

				}


				animationParameter.maxAngle = maxAngle;
				animationParameter.frame++;

				//console.log(animationParameter.frame)
				if (animationParameter.frame <= fps)
					that.requestAnimFrame.call(window, animate);
				else {
					drawLabel(0, fps);
					that.ctx.restore();

					if (isCanvasSupported)
						that._eventManager.ghostCtx.restore();

					setTimeout(function () {
						animationParameter.frame = 0;
						animationParameter.isAnimating = isCanvasSupported ? 20 : 4;
						explode();
					}, 200);
				}
			}


			that.renderCount++;
			that.ctx.restore();

			if (isCanvasSupported)
				that._eventManager.ghostCtx.restore();
		}


		function explode() {
			that.ctx.save();

			if (isCanvasSupported)
				that._eventManager.ghostCtx.save();

			that.ctx.translate(plotAreaCenter.x, plotAreaCenter.y);  // translating the context to center of plot area.

			if (isCanvasSupported)
				that._eventManager.ghostCtx.translate(plotAreaCenter.x, plotAreaCenter.y); // translating the context of ghost canvas to center of plot area.

			var fps = isCanvasSupported ? 20 : 4;

			if (animationParameter !== null && animationParameter.frame < fps) {
				//console.log(00);
				animationParameter.isAnimating--;

				//TBI: Logic to restore plotArea background color while rendering.

				//that.ctx.fillStyle = "#FFFFFF";
				that.ctx.fillStyle = that.backgroundColor ? that.backgroundColor : "white";

				that.ctx.clearRect(-plotArea.width / 2, -plotArea.height / 2, plotArea.width, plotArea.height);

				for (var i = 0; i < noDataPoints; i++) {

					var color = dataSeries.dataPoints[i].color ? dataSeries.dataPoints[i].color : dataSeries.color ? dataSeries.color : colorPallet[(i % colorPallet.length)];


					var center = { x: 0, y: 0 };
					var Xoffset = radius * explodeOffset * (Math.cos((labelLocationAngles[i])));
					var Yoffset = radius * explodeOffset * (Math.sin((labelLocationAngles[i])));

					var exploded = dataSeries.dataPoints[i].exploded;
					var type = dataSeries.type;  //to check for pie/ or doughnut
					var id = dataSeries.dataPointIds[i];


					var currentlyExploded = that._eventManager.objectMap[id].currentlyExploded;
					var pastExploded = that._eventManager.objectMap[id].pastExploded;



					if (currentlyExploded === true && pastExploded === false) {
						center.x = center.x + Xoffset / fps * (animationParameter.frame + 1);
						center.y = center.y + Yoffset / fps * (animationParameter.frame + 1);
						if (animationParameter.frame + 1 === fps) {
							that._eventManager.objectMap[id].pastExploded = true;
						}
					}
					else if (currentlyExploded === true && pastExploded === true) {
						center.x = center.x + Xoffset;
						center.y = center.y + Yoffset;

					}


					that._eventManager.objectMap[id].center.x = center.x + plotAreaCenter.x;
					that._eventManager.objectMap[id].center.y = center.y + plotAreaCenter.y;

					if (pastExploded !== currentlyExploded) {
						var entry = {};
						entry.dataSeries = dataSeries;
						entry.dataPoint = dataSeries.dataPoints[i];
						entry.index = i;
						that._toolTip.highlightObjects([entry]);
					}

					drawSegment(that.ctx, center, radius, color, type, arcAngles[i], arcAngles[i + 1]);




					if (animationParameter.frame === fps - 1) {

						var id = dataSeries.dataPointIds[i];
						var rgb = intToRGB(id);

						color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

						if (isCanvasSupported) {
							that._eventManager.ghostCtx.save();
							drawSegment(that._eventManager.ghostCtx, center, radius, color, type, arcAngles[i], arcAngles[i + 1]);
							that._eventManager.ghostCtx.restore();
						}
					}

				}

				animationParameter.frame++;

				if (animationParameter.frame < fps)
					that.requestAnimFrame.call(window, explode);
			}

			drawLabel(animationParameter.frame, fps);


			that.ctx.restore();

			if (isCanvasSupported)
				that._eventManager.ghostCtx.restore();

		}

		function implode() {
			that.ctx.save();

			if (isCanvasSupported)
				that._eventManager.ghostCtx.save();

			that.ctx.translate(plotAreaCenter.x, plotAreaCenter.y);  // translating the context to center of plot area.

			if (isCanvasSupported)
				that._eventManager.ghostCtx.translate(plotAreaCenter.x, plotAreaCenter.y); // translating the context of ghost canvas to center of plot area.


			var fps = isCanvasSupported ? 20 : 4;

			if (animationParameter !== null && animationParameter.frame > 0) {

				animationParameter.isAnimating--;
				//TBI: Logic to restore plotArea background color while rendering.

				//that.ctx.fillStyle = that._options;
				//that.ctx.fillStyle = that.backgroundColor ? that.backgroundColor : "white";
				that.ctx.clearRect(-plotArea.width / 2, -plotArea.height / 2, plotArea.width, plotArea.height);

				for (var i = 0; i < noDataPoints; i++) {


					var id = dataSeries.dataPointIds[i];
					var currentlyExploded = that._eventManager.objectMap[id].currentlyExploded;
					var pastExploded = that._eventManager.objectMap[id].pastExploded;


					var color = dataSeries.dataPoints[i].color ? dataSeries.dataPoints[i].color : dataSeries.color ? dataSeries.color : colorPallet[(i % colorPallet.length)];


					var center = { x: 0, y: 0 };
					var exploded = dataSeries.dataPoints[i].exploded;
					var type = dataSeries.type;

					var currentlyExploded = that._eventManager.objectMap[id].currentlyExploded;
					var Xoffset = radius * explodeOffset * (Math.cos((labelLocationAngles[i])));
					var Yoffset = radius * explodeOffset * (Math.sin((labelLocationAngles[i])));

					if (currentlyExploded === false && pastExploded === true) {

						center.x = center.x + Xoffset / fps * (animationParameter.frame);
						center.y = center.y + Yoffset / fps * (animationParameter.frame);
						if (animationParameter.frame === 1) {
							that._eventManager.objectMap[id].pastExploded = false;
						}
					}
					else if (currentlyExploded === true && pastExploded === true) {
						center.x = center.x + Xoffset;
						center.y = center.y + Yoffset;
					}

					that._eventManager.objectMap[id].center.x = center.x + plotAreaCenter.x;
					that._eventManager.objectMap[id].center.y = center.y + plotAreaCenter.y;

					if (pastExploded !== currentlyExploded) {
						var entry = {};
						entry.dataSeries = dataSeries;
						entry.dataPoint = dataSeries.dataPoints[i];
						entry.index = i;
						that._toolTip.highlightObjects([entry]);
					}

					drawSegment(that.ctx, center, radius, color, type, arcAngles[i], arcAngles[i + 1]);

					if (animationParameter.frame === 1) {

						var id = dataSeries.dataPointIds[i];
						var rgb = intToRGB(id);

						color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

						if (isCanvasSupported) {
							that._eventManager.ghostCtx.save();
							drawSegment(that._eventManager.ghostCtx, center, radius, color, type, arcAngles[i], arcAngles[i + 1]);
							that._eventManager.ghostCtx.restore();
						}
					}
				}

				animationParameter.frame--;

				if (animationParameter.frame > 0)
					that.requestAnimFrame.call(window, implode);

			}
			drawLabel(animationParameter.frame, fps);

			that.ctx.restore();

			if (isCanvasSupported)
				that._eventManager.ghostCtx.restore();

		}



		//loop for drawing labels
		function drawLabel(frame, fps) {
			//   var color = dataSeries.dataPoints[i].color ? dataSeries.dataPoints[i].color : dataSeries.color ? dataSeries.color : colorPallet[(i % colorPallet.length)];
			for (var i = 0; i < dataSeries.dataPoints.length; i++) {

				var id = dataSeries.dataPointIds[i];
				var currentlyExploded = that._eventManager.objectMap[id].currentlyExploded;
				var pastExploded = that._eventManager.objectMap[id].pastExploded;

				var indexLabelPlacement = dataSeries.indexLabelPlacement;
				var indexLabelLineColor = dataSeries.dataPoints[i].indexLabelLineColor ? dataSeries.dataPoints[i].indexLabelLineColor : dataSeries.indexLabelLineColor;
				var indexLabelLineThickness = dataSeries.dataPoints[i].indexLabelLineThickness ? dataSeries.dataPoints[i].indexLabelLineThickness : dataSeries.indexLabelLineThickness;
				var indexLabelFontColor = dataSeries.dataPoints[i].indexLabelFontColor ? dataSeries.dataPoints[i].indexLabelFontColor : dataSeries.indexLabelFontColor;
				var indexLabelFontStyle = dataSeries.dataPoints[i].indexLabelFontStyle ? dataSeries.dataPoints[i].indexLabelFontStyle : dataSeries.indexLabelFontStyle;
				var indexLabelFontWeight = dataSeries.dataPoints[i].indexLabelFontWeight ? dataSeries.dataPoints[i].indexLabelFontWeight : dataSeries.indexLabelFontWeight;
				var indexLabelFontSize = dataSeries.dataPoints[i].indexLabelFontSize ? dataSeries.dataPoints[i].indexLabelFontSize : dataSeries.indexLabelFontSize;
				var indexLabelFontFamily = dataSeries.dataPoints[i].indexLabelFontFamily ? dataSeries.dataPoints[i].indexLabelFontFamily : dataSeries.indexLabelFontFamily;
				var indexLabelBackgroundColor = dataSeries.dataPoints[i].indexLabelBackgroundColor ? dataSeries.dataPoints[i].indexLabelBackgroundColor : dataSeries.indexLabelBackgroundColor ? dataSeries.indexLabelBackgroundColor : null;


				drawSegmentLabel(that.ctx, x1[i], x2[i], y1[i], y2[i],
					currentlyExploded,
					labelTexts[i],
					radius,
					labelLocationAngles[i],
					indexLabelFontColor,
					indexLabelPlacement,
					indexLabelLineColor,
					indexLabelLineThickness,
					frame, fps,
					pastExploded,
					labelLengths[i],
					indexLabelFontStyle,
					indexLabelFontWeight,
					indexLabelFontSize,
					indexLabelFontFamily,
					indexLabelBackgroundColor, i)

			}
		}


		this.pieDoughnutClickHandler = function (e) {


			if (animationParameter.isAnimating !== 0) {
				return;
			}

			var i = e.dataPointIndex;


			var id = dataSeries.dataPointIds[i];

			if (that._eventManager.objectMap[id].currentlyExploded === true) {
				if (that._eventManager.objectMap[id].userSetExploded === true) {
					dataSeries.dataPoints[i].exploded = false;
				}
				that._eventManager.objectMap[id].currentlyExploded = false;

				animationParameter.frame = isCanvasSupported ? 20 : 4;
				animationParameter.isAnimating = isCanvasSupported ? 20 : 4;
				//e.dataPoint.pastExploded = false;


				implode();

			}
			else if (that._eventManager.objectMap[id].currentlyExploded === false) {
				if (that._eventManager.objectMap[id].userSetExploded === true) {
					dataSeries.dataPoints[i].exploded = true;
				}
				that._eventManager.objectMap[id].currentlyExploded = true;
				animationParameter.isAnimating = isCanvasSupported ? 20 : 4;
				animationParameter.frame = 0;
				//  e.dataPoint.exploded = true;
				explode();
			}
			return;




		}
	}

	//#endregion pieChart

	//#endregion Render Methods

	Chart.prototype.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	//#endregion Class Chart

	//#region Class LayoutManager
	function LayoutManager(chart) {

		this._topOccupied = 0;
		this._bottomOccupied = 0;
		this._leftOccupied = 0;
		this._rightOccupied = 0;
		this.chart = chart;
	}

	LayoutManager.prototype.registerSpace = function (position, size) {
		if (position === "top") {
			this._topOccupied += size.height;
		}
		else if (position === "bottom") {
			this._bottomOccupied += size.height;
		} else if (position === "left") {
			this._leftOccupied += size.width; // this is width when seen upright/vertically
		} else if (position === "right") {
			this._rightOccupied += size.width;// this is width when seen upright/vertically
		}
	}

	LayoutManager.prototype.unRegisterSpace = function (position, size) {
		if (position === "top") {
			this._topOccupied -= size.height;
		}
		else if (position === "bottom") {
			this._bottomOccupied -= size.height;
		} else if (position === "left") {
			this._leftOccupied -= size.width;// this is width when seen upright/vertically
		} else if (position === "right") {
			this._rightOccupied -= size.width;// this is width when seen upright/vertically
		}
	}

	LayoutManager.prototype.getFreeSpace = function () {
		///<signature>
		///<summary>Returns available free space {x1:number, y1:number, x2:number, y2:number}</summary>
		///</signature>

		return {
			x1: this._leftOccupied,
			y1: this._topOccupied,
			x2: this.chart.width - this._rightOccupied,
			y2: this.chart.height - this._bottomOccupied,
			width: (this.chart.width - this._rightOccupied) - this._leftOccupied,
			height: (this.chart.height - this._bottomOccupied) - this._topOccupied
		};
	}

	LayoutManager.prototype.reset = function () {
		this._topOccupied = 0;
		this._bottomOccupied = 3;//so that there is enough padding in the bottom.
		this._leftOccupied = 0;
		this._rightOccupied = 0;
	}
	//#endregion Class LayoutManager

	//#region Class TextBlock
	function TextBlock(ctx, options) {
		TextBlock.parent.constructor.call(this, "TextBlock", options);

		this.ctx = ctx;
		this._isDirty = true;
		this._wrappedText = null;
	}
	extend(TextBlock, CanvasJSObject);
	TextBlock.prototype.render = function (preserveContext) {
		if (preserveContext)
			this.ctx.save();

		var font = this.ctx.font;
		this.ctx.textBaseline = this.textBaseline;

		if (this._isDirty)
			this.measureText(this.ctx);

		this.ctx.translate(this.x, this.y);
		this.ctx.font = this._getFontString();

		this.ctx.rotate(Math.PI / 180 * this.angle);

		var textLeft = 0;
		//var textTop = this.textBaseline === "middle" ? this.fontSize / 2 + this.padding : this.padding;
		var textTop = this.padding;
		var line = null;

		if ((this.borderThickness > 0 && this.borderColor) || this.backgroundColor) {
			this.ctx.roundRect(0, 0, this.width, this.height, this.cornerRadius, this.borderThickness, this.backgroundColor, this.borderColor);

			if (this.textBaseline === "middle")
				textTop += this.fontSize / 2;
		}

		this.ctx.fillStyle = this.fontColor;

		for (var i = 0; i < this._wrappedText.lines.length; i++) {

			line = this._wrappedText.lines[i];
			if (this.horizontalAlign === "right")
				textLeft = this.width - line.width - this.padding;
			else if (this.horizontalAlign === "left")
				textLeft = this.padding;
			else if (this.horizontalAlign === "center")
				textLeft = (this.width - this.padding * 2) / 2 - line.width / 2 + this.padding;

			this.ctx.fillText(line.text, textLeft, textTop);

			textTop += line.height;
		}

		this.ctx.font = font;

		if (preserveContext)
			this.ctx.restore();
	}

	TextBlock.prototype.setText = function (text) {
		this.text = text;
		this._isDirty = true;
		this._wrappedText = null;
	}

	TextBlock.prototype.measureText = function () {
		if (this.maxWidth === null) {
			throw ("Please set maxWidth and height for TextBlock");
		}

		this._wrapText(this.ctx);
		this._isDirty = false;

		return { width: this.width, height: this.height }
	}

	TextBlock.prototype._getLineWithWidth = function (text, width, clipWord) {
		text = String(text);
		clipWord = clipWord || false;

		if (!text)
			return { text: "", width: 0 };

		var textWidth = 0,
			min = 0,
			max = text.length - 1,
			mid = Infinity;

		this.ctx.font = this._getFontString();

		while (min <= max) {
			mid = Math.floor((min + max) / 2);
			var tempText = text.substr(0, mid + 1);

			textWidth = this.ctx.measureText(tempText).width;

			if (textWidth < width) {
				min = mid + 1;
			} else if (textWidth > width) {
				max = mid - 1;
			} else {
				break;
			}
		}

		//edge cases
		if (textWidth > width && tempText.length > 1) {
			tempText = tempText.substr(0, tempText.length - 1);
			textWidth = this.ctx.measureText(tempText).width;
		}

		var isClipped = true;

		if (tempText.length === text.length || text[tempText.length] === " ")
			isClipped = false;

		if (isClipped) {
			var resultWords = tempText.split(" ");
			if (resultWords.length > 1)
				resultWords.pop();

			tempText = resultWords.join(" ");
			textWidth = this.ctx.measureText(tempText).width;
		}

		return { text: tempText, width: textWidth };
	}

	TextBlock.prototype._wrapText = function wrapText() {
		//this.ctx.save();
		text = new String(trimString(this.text));
		var lines = [];
		var font = this.ctx.font; // Save the current Font
		var height = 0;
		var width = 0;

		this.ctx.font = this._getFontString();

		while (text.length > 0) {

			var maxWidth = this.maxWidth - this.padding * 2;
			var maxHeight = this.maxHeight - this.padding * 2;

			var line = this._getLineWithWidth(text, maxWidth, false);
			line.height = this.fontSize;

			lines.push(line);

			width = Math.max(width, line.width);
			height += line.height;
			text = trimString(text.slice(line.text.length, text.length));

			if (maxHeight && height > maxHeight) {
				var line = lines.pop();
			}
		}

		this._wrappedText = { lines: lines, width: width, height: height };
		this.width = width + this.padding * 2;
		this.height = height + this.padding * 2;

		this.ctx.font = font; // Restore the font
	}

	TextBlock.prototype._getFontString = function () {
		return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily
	}

	//#endregion Class TextBlock

	//#region Class Title

	function Title(chart, options) {
		Title.parent.constructor.call(this, "Title", options, chart.theme);

		this.chart = chart;
		this.canvas = chart.canvas;
		this.ctx = this.chart.ctx;


		if (typeof (this._options.fontSize) === "undefined") {

			this.fontSize = this.chart.getAutoFontSize(this.fontSize);

			//window.console.log("Chart Title fontSize: " + this.fontSize);
		}

		this.width = null,//read only
		this.height = null//read only
		this.bounds = { x1: null, y1: null, x2: null, y2: null };
	}

	extend(Title, CanvasJSObject);
	Title.prototype.render = function () {

		if (!this.text)
			return;

		var freespace = this.chart.layoutManager.getFreeSpace();
		var left = 0;
		var top = 0;
		var angle = 0;
		var maxWidth = 0;
		var maxHeight = 0;

		var textBlockHorizontalAlign;
		var position;

		if (this.verticalAlign === "top" || this.verticalAlign === "bottom") {
			maxWidth = freespace.width - this.margin * 2;
			maxHeight = freespace.height * .5 - this.margin * 2;
			angle = 0;
		}
		else if (this.verticalAlign === "center") {

			if (this.horizontalAlign === "left" || this.horizontalAlign === "right") {
				maxWidth = freespace.height - this.margin * 2;
				maxHeight = freespace.width * .5 - this.margin * 2;
			} else if (this.horizontalAlign === "center") {
				maxWidth = freespace.width - this.margin * 2;
				maxHeight = freespace.height * .5 - this.margin * 2;
			}
		}

		var textBlock = new TextBlock(this.ctx, {
			fontSize: this.fontSize, fontFamily: this.fontFamily, fontColor: this.fontColor,
			fontStyle: this.fontStyle, fontWeight: this.fontWeight,
			horizontalAlign: this.horizontalAlign, verticalAlign: this.verticalAlign,
			borderColor: this.borderColor, borderThickness: this.borderThickness,
			backgroundColor: this.backgroundColor,
			maxWidth: maxWidth, maxHeight: maxHeight,
			cornerRadius: this.cornerRadius,
			text: this.text,
			padding: this.padding,
			textBaseline: (this.borderColor && this.borderThickness > 0) ? "middle" : "top"
		});

		var textBlockSize = textBlock.measureText();

		if (this.verticalAlign === "top" || this.verticalAlign === "bottom") {

			if (this.verticalAlign === "top") {
				top = this.margin;
				position = "top";
			}
			else if (this.verticalAlign === "bottom") {
				top = freespace.y2 - this.margin - textBlockSize.height;
				position = "bottom";
			}

			if (this.horizontalAlign === "left") {
				left = freespace.x1 + this.margin;
			}
			else if (this.horizontalAlign === "center") {
				left = freespace.x1 + (maxWidth / 2 - textBlockSize.width / 2) + this.margin;
			}
			else if (this.horizontalAlign === "right") {
				left = freespace.x2 - this.margin - textBlockSize.width;
			}

			textBlockHorizontalAlign = this.horizontalAlign;

			this.width = textBlockSize.width;
			this.height = textBlockSize.height;
		}
		else if (this.verticalAlign === "center") {

			if (this.horizontalAlign === "left") {

				left = freespace.x1 + this.margin;
				top = freespace.y2 - this.margin - (maxWidth / 2 - textBlockSize.width / 2);
				angle = -90;

				position = "left";
				this.width = textBlockSize.height;
				this.height = textBlockSize.width;
			}
			else if (this.horizontalAlign === "right") {
				left = freespace.x2 - this.margin;
				top = freespace.y1 + this.margin + (maxWidth / 2 - textBlockSize.width / 2);
				angle = 90;

				position = "right";
				this.width = textBlockSize.height;
				this.height = textBlockSize.width;
			}
			else if (this.horizontalAlign === "center") {
				top = freespace.y1 + (freespace.height / 2 - textBlockSize.height / 2);
				left = freespace.x1 + (freespace.width / 2 - textBlockSize.width / 2);

				position = "center";
				this.width = textBlockSize.width;
				this.height = textBlockSize.height;
			}

			textBlockHorizontalAlign = "center";
		}

		textBlock.x = left;
		textBlock.y = top;
		textBlock.angle = angle;
		textBlock.horizontalAlign = textBlockHorizontalAlign;
		textBlock.render(true);

		this.chart.layoutManager.registerSpace(position, { width: this.width + this.margin * 2, height: this.height + this.margin * 2 });

		this.bounds = { x1: left, y1: top, x2: left + this.width, y2: top + this.height };

		this.ctx.textBaseline = "top";
	}


	//#endregion Class Title

	//#region Legend

	//TBI: Implement Markes for Legend
	function Legend(chart, options, theme) {
		Legend.parent.constructor.call(this, "Legend", options, theme);

		this.chart = chart;
		this.canvas = chart.canvas;
		this.ctx = this.chart.ctx;

		this.width = 0,
		//this.fontSize = 12,
		this.height = 0,
		this.orientation = null,
		this.horizontalSpacing = 10;
		this.dataSeries = [];
		this.bounds = { x1: null, y1: null, x2: null, y2: null };
	}
	extend(Legend, CanvasJSObject);

	Legend.prototype.render = function () {
		var freeSpace = this.chart.layoutManager.getFreeSpace();
		var position = null;
		var top = 0;
		var left = 0;
		var maxWidth = 0;
		var maxHeight = 0;
		var entryMargin = 5;

		var entries = [];
		var rows = [];

		if (typeof (this._options.fontSize) === "undefined") {

			this.fontSize = this.chart.getAutoFontSize(this.fontSize);

			//window.console.log("fontSize: " + this.fontSize);
		}

		//this.ctx.font = getFontString("", this, null);
		//this.ctx.fontColor = this.fontColor;

		if (this.verticalAlign === "top" || this.verticalAlign === "bottom") {
			this.orientation = "horizontal";
			position = this.verticalAlign;
			maxWidth = freeSpace.width * .9;
			maxHeight = freeSpace.height * .5;
		}
		else if (this.verticalAlign === "center") {
			this.orientation = "vertical";
			position = this.horizontalAlign;

			maxWidth = freeSpace.width * .5;
			maxHeight = freeSpace.height * .9;
		}

		for (var i = 0; i < this.dataSeries.length; i++) {
			var dataSeries = this.dataSeries[i];

			var markerType = dataSeries.legendMarkerType ? dataSeries.legendMarkerType : (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline" || dataSeries.type === "scatter" || dataSeries.type === "bubble") && dataSeries.markerType ? dataSeries.markerType : DataSeries.getDefaultLegendMarker(dataSeries.type);
			var legendText = dataSeries.legendText ? dataSeries.legendText : dataSeries.name;
			var markerColor = dataSeries.legendMarkerColor ? dataSeries.legendMarkerColor : dataSeries.markerColor ? dataSeries.markerColor : dataSeries._colorSet[0];
			var markerSize = (!dataSeries.markerSize && (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline")) ? 0 : this.fontSize * .7;
			var lineColor = dataSeries._colorSet[0];

			if (dataSeries.type !== "pie" && dataSeries.type !== "doughnut") {
				var entry = { markerType: markerType, markerColor: markerColor, text: legendText, textBlock: null, chartType: dataSeries.type, markerSize: markerSize, lineColor: dataSeries._colorSet[0] };

				entries.push(entry);
			} else {
				for (var dataPointIndex = 0; dataPointIndex < dataSeries.dataPoints.length; dataPointIndex++) {

					var dataPoint = dataSeries.dataPoints[dataPointIndex];

					markerType = dataPoint.legendMarkerType ? dataPoint.legendMarkerType : dataSeries.legendMarkerType ? dataSeries.legendMarkerType : DataSeries.getDefaultLegendMarker(dataSeries.type);
					var legendText = dataPoint.legendText ? dataPoint.legendText : dataSeries.legendText ? dataSeries.legendText : dataPoint.name ? dataPoint.name : "DataPoint: " + (dataPointIndex + 1);
					var markerColor = dataPoint.markerColor ? dataPoint.markerColor : dataSeries.markerColor ? dataSeries.markerColor : dataPoint.color ? dataPoint.color : dataSeries.color ? dataSeries.color : dataSeries._colorSet[dataPointIndex % dataSeries._colorSet.length];
					var markerSize = ((dataPoint.markerSize === 0 || (dataSeries.markerSize === 0 && !dataPoint.markerSize)) && (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline")) ? 0 : this.fontSize * .7;

					var entry = { markerType: markerType, markerColor: markerColor, text: legendText, textBlock: null, chartType: dataSeries.type, markerSize: markerSize };

					entries.push(entry);
				}
			}

			entry = null;
		}


		// Find out the required width and height of Legend and position the entries relative to the container
		if (entries.length > 0) {
			var row = null;
			var rowIndex = 0; // required for vertical orientation
			for (var i = 0; i < entries.length; i++) {
				var entry = entries[i];

				if (this.orientation === "horizontal") {
					entry.textBlock = new TextBlock(this.ctx, {
						x: 0,
						y: 0,//TBI
						maxWidth: maxWidth,
						maxHeight: this.fontSize, //TBI: FontSize
						angle: 0,
						text: entry.text,
						horizontalAlign: "left",//left, center, right
						fontSize: this.fontSize,//in pixels
						fontFamily: this.fontFamily,
						fontWeight: this.fontWeight, //normal, bold, bolder, lighter,
						fontColor: this.fontColor,
						fontStyle: this.fontStyle, // normal, italic, oblique
						textBaseline: "top"
					});
					entry.textBlock.measureText();


					if (!row || row.width + entry.textBlock.width + (row.width === 0 ? 0 : this.horizontalSpacing) > maxWidth) {
						row = { entries: [], width: 0 };
						rows.push(row);
						this.height = rows.length * (this.fontSize + 5);
					}

					entry.textBlock.x = row.width + (row.width === 0 ? 0 : this.horizontalSpacing);
					entry.textBlock.y = 0;

					row.width += entry.textBlock.width + (this.fontSize + 5) + (row.width === 0 ? 0 : this.horizontalSpacing);
					row.entries.push(entry);

					this.width = Math.max(row.width, this.width);

				} else {
					if (this.height + this.fontSize < maxHeight) {
						row = { entries: [], width: 0 };
						rows.push(row);
						this.height = rows.length * (this.fontSize);
					} else {
						row = rows[rowIndex];
						rowIndex = (rowIndex + 1) % rows.length
					}

					entry.textBlock = new TextBlock(this.ctx, {
						x: 0,
						y: 0,//TBI
						maxWidth: maxWidth,
						maxHeight: this.fontSize, //TBI: FontSize
						angle: 0,
						text: entry.text,
						horizontalAlign: "left",//left, center, right
						fontSize: this.fontSize,//in pixels
						fontFamily: this.fontFamily,
						fontWeight: this.fontWeight, //normal, bold, bolder, lighter,
						fontColor: this.fontColor,
						fontStyle: this.fontStyle, // normal, italic, oblique
						textBaseline: "top"
					});

					entry.textBlock.measureText();

					entry.textBlock.x = row.width + (row.width === 0 ? 0 : this.horizontalSpacing); // relative to the row
					entry.textBlock.y = 0; // relative to the row

					row.width += entry.textBlock.width + (this.fontSize + 5) + (row.width === 0 ? 0 : this.horizontalSpacing);
					row.entries.push(entry);

					this.width = Math.max(row.width, this.width);
				}
			}

			this.height = rows.length * (this.fontSize);

		}

		if (this.verticalAlign === "top") {
			if (this.horizontalAlign === "left")
				left = freeSpace.x1 + 2;
			else if (this.horizontalAlign === "right")
				left = freeSpace.x2 - this.width - 2;
			else
				left = freeSpace.x1 + freeSpace.width / 2 - this.width / 2;

			top = freeSpace.y1;
		} else if (this.verticalAlign === "center") {
			if (this.horizontalAlign === "left")
				left = freeSpace.x1 + 2;
			else if (this.horizontalAlign === "right")
				left = freeSpace.x2 - this.width - 2;
			else
				left = freeSpace.x1 + freeSpace.width / 2 - this.width / 2;

			top = freeSpace.y1 + freeSpace.height / 2 - this.height / 2;
		} else if (this.verticalAlign === "bottom") {
			if (this.horizontalAlign === "left")
				left = freeSpace.x1 + 2;
			else if (this.horizontalAlign === "right")
				left = freeSpace.x2 - this.width - 2;
			else
				left = freeSpace.x1 + freeSpace.width / 2 - this.width / 2;


			top = freeSpace.y2 - this.height - 5;
		}

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			for (var entryIndex = 0; entryIndex < row.entries.length; entryIndex++) {
				var entry = row.entries[entryIndex];

				var legendX = entry.textBlock.x + left;
				var legendY = top + (i * this.fontSize);

				if (entry.chartType === "line" || entry.chartType === "stepLine" || entry.chartType === "spline") {
					this.ctx.strokeStyle = entry.lineColor;
					this.ctx.lineWidth = Math.ceil(this.fontSize / 8);
					this.ctx.beginPath();
					this.ctx.moveTo(legendX - 2, legendY + this.fontSize / 2);
					this.ctx.lineTo(legendX + 2 + this.fontSize, legendY + this.fontSize / 2);
					this.ctx.stroke();
				}

				RenderHelper.drawMarker(legendX + this.fontSize / 2, legendY + this.fontSize / 2, this.ctx, entry.markerType, markerSize, entry.markerColor, null, 0);

				entry.textBlock.x = legendX + this.fontSize + 5;
				entry.textBlock.y = legendY;
				entry.textBlock.render(true);
			}
		}

		//this.ctx.strokeStyle = "red";
		//this.ctx.rect(left, top, this.width, this.height);
		//this.ctx.stroke();


		this.chart.layoutManager.registerSpace(position, { width: this.width, height: this.height + 5 + 5 });

		this.bounds = { x1: left, y1: top, x2: left + this.width, y2: top + this.height };
	}

	//#endregion Legend

	//#region Class PlotArea
	function PlotArea(chart, options) {
		PlotArea.parent.constructor.call(this, options);

		this.chart = chart;
		this.canvas = chart.canvas;
		this.ctx = this.chart.ctx;
	}
	extend(PlotArea, CanvasJSObject);

	PlotArea.prototype.render = function () {
		var freeSpace = this.chart.layoutManager.getFreeSpace();

		this.ctx.fillStyle = "red";
		this.ctx.fillRect(freeSpace.x1, freeSpace.y1, freeSpace.x2, freeSpace.y2);
	}
	//#endregion Class PlotArea

	//#region DataSeries

	function DataSeries(chart, options, theme, index, id) {
		DataSeries.parent.constructor.call(this, "DataSeries", options, theme);

		this.chart = chart;
		this.canvas = chart.canvas;
		this._ctx = chart.canvas.ctx;
		this.index = index;
		this.noDataPointsInPlotArea = 0;
		this.maxWidthInX = 0;
		this.id = id;
		this.dataPointIds = [];

		this.axisX = null;
		this.axisY = null;

		this.axisPlacement = this.getDefaultAxisPlacement();

		if (typeof (this._options.indexLabelFontSize) === "undefined") {

			this.indexLabelFontSize = this.chart.getAutoFontSize(this.indexLabelFontSize);
		}
	}
	extend(DataSeries, CanvasJSObject);

	//Static Method that returns the axisPlacement for a given ChartType. Returns one of "normal", "xySwapped", "none"
	DataSeries.prototype.getDefaultAxisPlacement = function () {

		//type = this.type.toLowerCase();
		type = this.type;

		if (type === "column" || type === "line" || type === "stepLine" || type === "spline" || type === "area" || type === "splineArea" || type === "stackedColumn" || type === "stackedLine" || type === "bubble" || type === "scatter"
			|| type === "stackedArea" || type === "stackedColumn100" || type === "stackedLine100" || type === "stackedArea100") {
			return "normal";
		}
		else if (type === "bar" || type === "stackedBar" || type === "stackedBar100") {

			return "xySwapped";
		}
		else if (type === "pie" || type === "doughnut") {
			return "none";
		} else {
			window.console.log("Unknown Chart Type: " + type);
			return null;
		}
	}

	DataSeries.getDefaultLegendMarker = function (type) {

		//type = type.toLowerCase();

		if (type === "column" || type === "stackedColumn" || type === "stackedLine" || type === "bar" || type === "stackedBar" || type === "stackedBar100"
			|| type === "bubble" || type === "scatter"
			|| type === "stackedColumn100" || type === "stackedLine100") {
			return "square";
		}
		else if (type === "line" || type === "stepLine" || type === "spline" || type === "pie" || type === "doughnut") {
			return "circle";
		} else if (type === "area" || type === "splineArea" || type === "stackedArea" || type === "stackedArea100") {
			return "triangle"
		} else {
			window.console.log("Unknown Chart Type: " + type);
			return null;
		}
	}

	//Finds dataPoint with the given x value. If findClosest is set, finds dataPoint with closest x value. 
	//Returns searchResult object if found, else returns null
	DataSeries.prototype.getDataPointAtX = function (x, findClosest) {

		if (!this.dataPoints || this.dataPoints.length === 0) return null;

		var searchResult = { dataPoint: null, distance: Infinity, index: NaN };
		var dataPoint = null;

		var j = 0;
		var i = 0;
		var direction = 1; // +1 for foward and -1 for backward.

		var minimumXDistance = Infinity;
		var forwardMissCount = 0, backwardMissCount = 0;
		var maxMissCount = 1000;
		var searchStartIndex = 0;

		if (this.chart.plotInfo.axisPlacement !== "none") {
			var xRange = (this.dataPoints[this.dataPoints.length - 1].x - this.dataPoints[0].x);

			if (xRange > 0)
				searchStartIndex = ((this.dataPoints.length - 1) / xRange * (x - this.dataPoints[0].x)) >> 0;
			else
				searchStartIndex = 0;

			//searchStartIndex = ((this.dataPoints[this.dataPoints.length - 1].x - this.dataPoints[0].x) / this.dataPoints.length * (x - this.dataPoints[0].x)) >> 0;
		}

		while (true) {

			i = (direction > 0) ? searchStartIndex + j : searchStartIndex - j;

			if (i >= 0 && i < this.dataPoints.length) {

				dataPoint = this.dataPoints[i];

				var distance = Math.abs(dataPoint.x - x);

				if (distance < searchResult.distance) {
					searchResult.dataPoint = dataPoint;
					searchResult.distance = distance;
					searchResult.index = i;
				}

				var xDistance = Math.abs(dataPoint.x - x);
				if (xDistance <= minimumXDistance)
					minimumXDistance = xDistance;
				else {
					if (direction > 0)
						forwardMissCount++;
					else
						backwardMissCount++;
				}

				if (forwardMissCount > maxMissCount && backwardMissCount > maxMissCount)
					break;


			} else if (searchStartIndex - j < 0 && searchStartIndex + j >= this.dataPoints.length)
				break;

			if (direction === -1) {
				j++;
				direction = 1;
			} else
				direction = -1;
		}


		if (!findClosest && searchResult.dataPoint.x === x)
			return searchResult;
		else if (findClosest && searchResult.dataPoint !== null)
			return searchResult;
		else
			return null;
	}

	// x & y should be in pixels. Can be used only after rendering the chart.
	DataSeries.prototype.getDataPointAtXY = function (x, y, getClosest) {

		if (!this.dataPoints || this.dataPoints.length === 0) return null;

		getClosest = getClosest || false;
		var results = [];
		var j = 0, i = 0;
		var direction = 1; // +1 for foward and -1 for backward.
		var foundDataPoint = false;
		var minimumXDistance = Infinity;
		var forwardMissCount = 0, backwardMissCount = 0;
		var maxMissCount = 1000;
		var searchStartIndex = 0;

		if (this.chart.plotInfo.axisPlacement !== "none") {
			var xval = this.chart.axisX.getXValueAt({ x: x, y: y });
			var xRange = (this.dataPoints[this.dataPoints.length - 1].x - this.dataPoints[0].x);

			if (xRange > 0)
				searchStartIndex = ((this.dataPoints.length - 1) / xRange * (xval - this.dataPoints[0].x)) >> 0;
			else
				searchStartIndex = 0;
		}

		while (true) {

			//i = searchStartIndex + (j * direction);
			i = (direction > 0) ? searchStartIndex + j : searchStartIndex - j;

			if (i >= 0 && i < this.dataPoints.length) {

				var id = this.dataPointIds[i];
				var visualInfo = this.chart._eventManager.objectMap[id];
				var dataPoint = this.dataPoints[i];

				if (visualInfo) {

					switch (this.type) {

						case "column":
						case "stackedColumn":
						case "stackedColumn100":
						case "bar":
						case "stackedBar":
						case "stackedBar100":
							if (x >= visualInfo.x1 && x <= visualInfo.x2 && y >= visualInfo.y1 && y <= visualInfo.y2) {
								results.push({
									dataPoint: dataPoint,
									dataPointIndex: i,
									dataSeries: this,
									distance: Math.min(Math.abs(visualInfo.x1 - x), Math.abs(visualInfo.x2 - x), Math.abs(visualInfo.y1 - y), Math.abs(visualInfo.y2 - y))
									//distance:0
								});

								foundDataPoint = true;
							}
							break;

						case "line":
						case "stepLine":
						case "spline":
						case "area":
						case "stackedArea":
						case "stackedArea100":
						case "splineArea":
						case "scatter":
							var markerSize = getProperty("markerSize", dataPoint, this) || 4;
							var snapDistance = getClosest ? 20 : markerSize;

							var distance = Math.sqrt(Math.pow(visualInfo.x1 - x, 2) + Math.pow(visualInfo.y1 - y, 2));
							if (distance <= snapDistance) {
								results.push({
									dataPoint: dataPoint,
									dataPointIndex: i,
									dataSeries: this,
									distance: distance
								});
							}

							var xDistance = Math.abs(visualInfo.x1 - x);
							if (xDistance <= minimumXDistance)
								minimumXDistance = xDistance;
							else {
								if (direction > 0)
									forwardMissCount++;
								else
									backwardMissCount++;
							}

							if (distance <= markerSize / 2) {
								foundDataPoint = true;
							}

							break;

						case "bubble":
							var markerSize = visualInfo.size;
							var distance = Math.sqrt(Math.pow(visualInfo.x1 - x, 2) + Math.pow(visualInfo.y1 - y, 2));
							if (distance <= markerSize / 2) {
								results.push({
									dataPoint: dataPoint,
									dataPointIndex: i,
									dataSeries: this,
									distance: distance
								});

								foundDataPoint = true;
							}
							break;

						case "pie":
						case "doughnut":
							var center = visualInfo.center;
							var innerRadius = this.type === "doughnut" ? .6 * visualInfo.radius : 0;

							var distance = Math.sqrt(Math.pow(center.x - x, 2) + Math.pow(center.y - y, 2));
							if (distance < visualInfo.radius && distance > innerRadius) {

								var deltaY = y - center.y;
								var deltaX = x - center.x;
								var angle = Math.atan2(deltaY, deltaX);

								if (angle < 0)
									angle += Math.PI * 2;

								angle = ((angle / Math.PI * 180 % 360) + 360) % 360;
								var startAngle = ((visualInfo.startAngle / Math.PI * 180 % 360) + 360) % 360;
								var endAngle = ((visualInfo.endAngle / Math.PI * 180 % 360) + 360) % 360;

								if (startAngle > endAngle) {
									endAngle += 360;

									if (angle < startAngle)
										angle += 360;
								}

								if (angle > startAngle && angle < endAngle) {
									results.push({
										dataPoint: dataPoint,
										dataPointIndex: i,
										dataSeries: this,
										distance: 0
									});

									foundDataPoint = true;
								}

							}

							break;

					}

					if (foundDataPoint || (forwardMissCount > maxMissCount && backwardMissCount > maxMissCount))
						break;
				}

			} else if (searchStartIndex - j < 0 && searchStartIndex + j >= this.dataPoints.length)
				break;

			if (direction === -1) {
				j++;
				direction = 1;
			} else
				direction = -1;

		}



		var closestResult = null;

		for (var m = 0; m < results.length; m++) {
			if (!closestResult) {
				closestResult = results[m];
			} else if (results[m].distance <= closestResult.distance) {
				closestResult = results[m];
			}
		}

		//if (window.console && closestResult)
		//    window.console.log(j + ": distance = " + closestResult.distance);

		return closestResult;
	}

	DataSeries.prototype.getMarkerProperties = function (index, x, y, ctx) {
		var dataPoints = this.dataPoints;
		var dataSeries = this;

		var markerColor = dataPoints[index].markerColor ? dataPoints[index].markerColor : dataSeries.markerColor ? dataSeries.markerColor : dataPoints[index].color ? dataPoints[index].color : dataSeries.color ? dataSeries.color : dataSeries._colorSet[index % dataSeries._colorSet.length];
		var markerBorderColor = dataPoints[index].markerBorderColor ? dataPoints[index].markerBorderColor : dataSeries.markerBorderColor ? dataSeries.markerBorderColor : null;
		var markerBorderThickness = dataPoints[index].markerBorderThickness ? dataPoints[index].markerBorderThickness : dataSeries.markerBorderThickness ? dataSeries.markerBorderThickness : null;
		var markerType = dataPoints[index].markerType ? dataPoints[index].markerType : dataSeries.markerType;
		var markerSize = dataPoints[index].markerSize ? dataPoints[index].markerSize : dataSeries.markerSize;


		return {
			x: x, y: y, ctx: ctx,
			type: markerType,
			size: markerSize,
			color: markerColor,
			borderColor: markerBorderColor,
			borderThickness: markerBorderThickness
		}
	}
	//#endregion DataSeries

	//#region Axis

	function Axis(chart, options, type, position) {
		Axis.parent.constructor.call(this, "Axis", options, chart.theme);

		this.chart = chart;
		this.canvas = chart.canvas;
		this.ctx = chart.ctx;
		this.maxWidth = 0;
		this.maxHeight = 0;
		this.intervalStartPosition = 0;
		this.labels = [];
		this._labels = null;

		//Processed information about the data that gets plotted against this axis
		this.dataInfo = {
			min: Infinity,
			max: -Infinity,
			viewPortMin: Infinity,
			viewPortMax: -Infinity,
			minDiff: Infinity // Used only in case of axisX
		};

		if (type === "axisX") {
			this.sessionVariables = this.chart.sessionVariables[type];

			if (!this._options.interval)
				this.intervalType = null;
		} else {
			if (position === "left" || position === "top")
				this.sessionVariables = this.chart.sessionVariables["axisY"];
			else {
				this.sessionVariables = this.chart.sessionVariables["axisY2"];
			}
		}



		if (typeof (this._options.titleFontSize) === "undefined") {

			this.titleFontSize = this.chart.getAutoFontSize(this.titleFontSize);

			//window.console.log("titleFontSize: " + this.titleFontSize);
		}

		if (typeof (this._options.labelFontSize) === "undefined") {

			this.labelFontSize = this.chart.getAutoFontSize(this.labelFontSize);

			//window.console.log("labelFontSize: " + this.labelFontSize);

		}

		//Axis Type : axisX, axisY
		this.type = type;
		if (!options || typeof (options.gridThickness) === "undefined")
			this.gridThickness = type === "axisX" ? 0 : 1;

		this._position = position;

		this.lineCoordinates = { x1: null, y1: null, x2: null, y2: null, width: null };//{x1:, y1:, x2:, y2:, width:}
		//
		{
			this.labelAngle = ((this.labelAngle % 360) + 360) % 360;

			if (this.labelAngle > 90 && this.labelAngle <= 270)
				this.labelAngle -= 180;
			else if (this.labelAngle > 180 && this.labelAngle <= 270)
				this.labelAngle -= 180
			else if (this.labelAngle > 270 && this.labelAngle <= 360)
				this.labelAngle -= 360
		}

		this._titleTextBlock = null;
		this._absoluteMinimum = null;// Used to determine boundaries while Zooming/Panning
		this._absoluteMaximum = null;// Used to determine boundaries while Zooming/Panning

		if (this.hasOptionChanged("minimum"))
			this.sessionVariables.internalMinimum = this.minimum;

		if (this.hasOptionChanged("maximum"))
			this.sessionVariables.internalMaximum = this.maximum;

		this.trackChanges("minimum");
		this.trackChanges("maximum");
	}
	extend(Axis, CanvasJSObject);

	Axis.prototype.createLabels = function () {
		var textBlock;
		var i = 0;
		var endPoint;

		var labelMaxWidth = 0;
		var labelMaxHeight = 0;
		var intervalInPixels = 0;

		//var intervalInPixels = this.convertionParameters.pixelPerUnit * this.interval;


		if (this._position === "bottom" || this._position === "top") {
			intervalInPixels = this.lineCoordinates.width / Math.abs(this.maximum - this.minimum) * this.interval;

			if (this.labelAutoFit) {
				labelMaxWidth = typeof (this._options.labelMaxWidth) === "undefined" ? intervalInPixels * .9 >> 0 : this.labelMaxWidth;
			}
			else {
				labelMaxWidth = typeof (this._options.labelMaxWidth) === "undefined" ? this.chart.width * .7 >> 0 : this.labelMaxWidth;
			}

			labelMaxHeight = typeof (this._options.labelWrap) === "undefined" || this.labelWrap ? this.chart.height * .5 >> 0 : this.labelFontSize;
		}
		else if (this._position === "left" || this._position === "right") {

			intervalInPixels = this.lineCoordinates.height / Math.abs(this.maximum - this.minimum) * this.interval;


			if (this.labelAutoFit) {
				labelMaxWidth = typeof (this._options.labelMaxWidth) === "undefined" ? this.chart.width * .3 >> 0 : this.labelMaxWidth;
			}
			else {
				labelMaxWidth = typeof (this._options.labelMaxWidth) === "undefined" ? this.chart.width * .5 >> 0 : this.labelMaxWidth;
			}

			labelMaxHeight = typeof (this._options.labelWrap) === "undefined" || this.labelWrap ? intervalInPixels * 2 >> 0 : this.labelFontSize;
		}

		if (this.type === "axisX" && this.chart.plotInfo.axisXValueType === "dateTime") {
			endPoint = addToDateTime(new Date(this.maximum), this.interval, this.intervalType)

			for (i = this.intervalStartPosition; i < endPoint; addToDateTime(i, this.interval, this.intervalType)) {

				//var text = dateFormat(i, this.valueFormatString);
				var text = this.type === "axisX" && this.labels[i] ? this.labels[i] : dateFormat(i, this.valueFormatString, this.chart._cultureInfo);

				textBlock = new TextBlock(this.ctx, {
					x: 0,
					y: 0,
					//maxWidth: this.maxHeight,
					//maxHeight: this.labelFontSize,
					maxWidth: labelMaxWidth,
					maxHeight: labelMaxHeight,
					angle: this.labelAngle,
					text: this.prefix + text + this.suffix,
					horizontalAlign: "left",//left, center, right
					fontSize: this.labelFontSize,//in pixels
					fontFamily: this.labelFontFamily,
					fontWeight: this.labelFontWeight, //normal, bold, bolder, lighter,
					fontColor: this.labelFontColor,
					fontStyle: this.labelFontStyle, // normal, italic, oblique
					textBaseline: "middle"
				});

				this._labels.push({ position: i.getTime(), textBlock: textBlock, effectiveHeight: null });
			}

		}
		else {
			endPoint = this.maximum;

			//if ((Math.floor(this.interval) < this.interval && !this._options.interval) || true) {

			//Check if it should be rendered as a category axis. If yes, then ceil the interval
			if (this.labels && this.labels.length) {
				var tempInterval = Math.ceil(this.interval);
				var tempStartPoint = Math.ceil(this.intervalStartPosition);
				var hasAllLabels = false;
				for (i = tempStartPoint; i < this.maximum; i += tempInterval) {
					if (this.labels[i]) {
						hasAllLabels = true;
					} else {
						hasAllLabels = false;
						break;
					}
				}

				if (hasAllLabels) {
					this.interval = tempInterval;
					this.intervalStartPosition = tempStartPoint;
				}
			}

			for (i = this.intervalStartPosition; i <= endPoint; i += this.interval) {

				var text = this.type === "axisX" && this.labels[i] ? this.labels[i] : numberFormat(i, this.valueFormatString, this.chart._cultureInfo);

				textBlock = new TextBlock(this.ctx, {
					x: 0,
					y: 0,
					//maxWidth: this.maxHeight,
					//maxHeight: this.labelFontSize,
					maxWidth: labelMaxWidth,
					maxHeight: labelMaxHeight,
					angle: this.labelAngle,
					text: this.prefix + text + this.suffix,
					horizontalAlign: "left",//left, center, right
					fontSize: this.labelFontSize,//in pixels
					fontFamily: this.labelFontFamily,
					fontWeight: this.labelFontWeight, //normal, bold, bolder, lighter,
					fontColor: this.labelFontColor,
					fontStyle: this.labelFontStyle, // normal, italic, oblique
					textBaseline: "middle",
					borderThickness: 0
				});

				this._labels.push({ position: i, textBlock: textBlock, effectiveHeight: null });
			}
		}
	}

	Axis.prototype.createLabelsAndCalculateWidth = function () {

		var maxLabelEffectiveWidth = 0;
		this._labels = [];

		if (this._position === "left" || this._position === "right") {

			this.createLabels();

			for (i = 0; i < this._labels.length; i++) {

				textBlock = this._labels[i].textBlock;

				var size = textBlock.measureText();

				//var hypotenuse = Math.sqrt(Math.pow(size.height / 2, 2) + Math.pow(size.width, 2));
				//labelEffectiveWidth = hypotenuse * Math.cos(Math.abs(Math.PI / 180 * this.labelAngle) - Math.abs(Math.acos(size.width / hypotenuse)));

				if (this.labelAngle === 0)
					labelEffectiveWidth = size.width;
				else
					labelEffectiveWidth = (size.width * Math.cos(Math.PI / 180 * Math.abs(this.labelAngle))) + (size.height / 2 * Math.sin(Math.PI / 180 * Math.abs(this.labelAngle)));


				if (maxLabelEffectiveWidth < labelEffectiveWidth)
					maxLabelEffectiveWidth = labelEffectiveWidth;

				this._labels[i].effectiveWidth = labelEffectiveWidth;
			}
		}

		//if (isDebugMode && window.console) {
		//    window.console.log(this.type + " --- axisWidth : " + (maxLabelEffectiveWidth + this.tickLength));
		//}

		var titleHeight = this.title ? this.titleFontSize + 5 : 0;

		return titleHeight + maxLabelEffectiveWidth + this.tickLength + 10;
	}

	Axis.prototype.createLabelsAndCalculateHeight = function () {
		var maxLabelEffectiveHeight = 0;
		this._labels = [];
		var textBlock;
		var i = 0;

		this.createLabels();

		if (this._position === "bottom" || this._position === "top") {

			for (i = 0; i < this._labels.length; i++) {

				textBlock = this._labels[i].textBlock;

				var size = textBlock.measureText();
				//var diagonal = Math.sqrt(Math.pow(size.height, 2) + Math.pow(size.width, 2));

				//var hypotenuse = Math.sqrt(Math.pow(size.height / 2, 2) + Math.pow(size.width, 2));
				//var labelEffectiveHeight = hypotenuse * Math.cos(Math.PI / 2 - (Math.abs(Math.PI / 180 * this.labelAngle) + Math.abs(Math.acos(size.width / hypotenuse))));

				var labelEffectiveHeight = 0;

				if (this.labelAngle === 0)
					labelEffectiveHeight = size.height;
				else
					labelEffectiveHeight = (size.width * Math.sin(Math.PI / 180 * Math.abs(this.labelAngle))) + (size.height / 2 * Math.cos(Math.PI / 180 * Math.abs(this.labelAngle)));

				if (maxLabelEffectiveHeight < labelEffectiveHeight)
					maxLabelEffectiveHeight = labelEffectiveHeight;

				this._labels[i].effectiveHeight = labelEffectiveHeight;
			}
		}

		var titleHeight = this.title ? this.titleFontSize + 5 : 0;

		return titleHeight + maxLabelEffectiveHeight + this.tickLength;
	}

	//Static Method that co-ordinates between axisX, axisY and renders them
	Axis.setLayoutAndRender = function (axisX, axisY, axisY2, axisPlacement, freeSpace) {
		var x1, y1, x2, y2;
		var chart = axisX.chart;
		var ctx = chart.ctx;

		axisX.calculateAxisParameters();

		if (axisY)
			axisY.calculateAxisParameters();

		if (axisY2)
			axisY2.calculateAxisParameters();

		if (axisY && axisY2 && typeof (axisY._options.maximum) === "undefined" && typeof (axisY._options.minimum) === "undefined" && typeof (axisY._options.interval) === "undefined"
				&& typeof (axisY2._options.maximum) === "undefined" && typeof (axisY2._options.minimum) === "undefined" && typeof (axisY2._options.interval) === "undefined") {

			var noTicksY = (axisY.maximum - axisY.minimum) / axisY.interval;

			var noTicksY2 = (axisY2.maximum - axisY2.minimum) / axisY2.interval;

			if (noTicksY > noTicksY2) {
				axisY2.maximum = axisY2.interval * noTicksY + axisY2.minimum;
			} else if (noTicksY2 > noTicksY) {
				axisY.maximum = axisY.interval * noTicksY2 + axisY.minimum;
			}
		}

		var axisYlineThickness = axisY ? axisY.lineThickness ? axisY.lineThickness : 0 : 0;
		var axisY2lineThickness = axisY2 ? axisY2.lineThickness ? axisY2.lineThickness : 0 : 0;

		var axisYGridThickness = axisY ? axisY.gridThickness ? axisY.gridThickness : 0 : 0;
		var axisY2GridThickness = axisY2 ? axisY2.gridThickness ? axisY2.gridThickness : 0 : 0;

		var axisYMargin = axisY ? axisY.margin : 0;
		var axisY2Margin = axisY ? axisY.margin : 0;

		if (axisPlacement === "normal") {

			axisX.lineCoordinates = {};

			var axisYWidth = axisY ? axisY.createLabelsAndCalculateWidth() : 0;
			x1 = freeSpace.x1 + axisYWidth + axisYMargin;
			axisX.lineCoordinates.x1 = x1;

			var axisY2Width = axisY2 ? axisY2.createLabelsAndCalculateWidth() : 0;
			x2 = freeSpace.x2 - axisY2Width > axisX.chart.width - 10 ? axisX.chart.width - 10 : freeSpace.x2 - axisY2Width;
			axisX.lineCoordinates.x2 = x2;

			axisX.lineCoordinates.width = Math.abs(x2 - x1); // required early on inside createLabels of axisX

			var axisXHeight = axisX.createLabelsAndCalculateHeight();

			// Position axisX based on the available free space, Margin and its height
			//x1 = freeSpace.x1 + axisYWidth + axisYMargin + axisYlineThickness / 2;
			y1 = freeSpace.y2 - axisXHeight - axisX.margin;
			y2 = freeSpace.y2 - axisX.margin;

			//axisX.lineCoordinates = { x1: x1, y1: y1, x2: x2, y2: y1, width: Math.abs(x2 - x1) }
			axisX.lineCoordinates.y1 = y1;
			axisX.lineCoordinates.y2 = y1;

			axisX.boundingRect = { x1: x1, y1: y1, x2: x2, y2: y2, width: x2 - x1, height: y2 - y1 };

			//axisX.ctx.rect(axisX.boundingRect.x1, axisX.boundingRect.y1, axisX.boundingRect.width, axisX.boundingRect.height);
			//axisX.ctx.stroke();

			// Position axisY based on the available free space, Margin and its height
			if (axisY) {
				x1 = freeSpace.x1 + axisY.margin;
				y1 = freeSpace.y1 < 10 ? 10 : freeSpace.y1;
				x2 = freeSpace.x1 + axisYWidth + axisY.margin;
				//y2 = freeSpace.y2 - axisXHeight - axisX.margin - axisX.lineThickness / 2;
				y2 = freeSpace.y2 - axisXHeight - axisX.margin;

				axisY.lineCoordinates = { x1: x2, y1: y1, x2: x2, y2: y2, height: Math.abs(y2 - y1) }

				axisY.boundingRect = { x1: x1, y1: y1, x2: x2, y2: y2, width: x2 - x1, height: y2 - y1 };
			}

			//axisY.ctx.rect(axisY.boundingRect.x1, axisY.boundingRect.y1, axisY.boundingRect.width, axisY.boundingRect.height);
			//axisY.ctx.stroke();

			// Position axisY2 based on the available free space, Margin and its height
			if (axisY2) {
				x1 = axisX.lineCoordinates.x2;
				y1 = freeSpace.y1 < 10 ? 10 : freeSpace.y1;
				x2 = x1 + axisY2Width + axisY2.margin;
				//y2 = freeSpace.y2 - axisXHeight - axisX.margin - axisX.lineThickness / 2;
				y2 = freeSpace.y2 - axisXHeight - axisX.margin;

				axisY2.lineCoordinates = { x1: x1, y1: y1, x2: x1, y2: y2, height: Math.abs(y2 - y1) }

				axisY2.boundingRect = { x1: x1, y1: y1, x2: x2, y2: y2, width: x2 - x1, height: y2 - y1 };
			}


			axisX.calculateValueToPixelConvertionParameters();

			if (axisY)
				axisY.calculateValueToPixelConvertionParameters();

			if (axisY2)
				axisY2.calculateValueToPixelConvertionParameters();


			ctx.save();

			ctx.rect(axisX.boundingRect.x1 - 40, axisX.boundingRect.y1, axisX.boundingRect.width + 80, axisX.boundingRect.height);
			ctx.clip();

			axisX.renderLabelsTicksAndTitle();
			ctx.restore();

			if (axisY)
				axisY.renderLabelsTicksAndTitle();

			if (axisY2)
				axisY2.renderLabelsTicksAndTitle();


			chart.preparePlotArea();
			var plotArea = axisX.chart.plotArea;

			ctx.save();

			ctx.rect(plotArea.x1,
				plotArea.y1 - Math.max(axisY2GridThickness, axisYGridThickness) / 2,
				Math.abs(plotArea.x2 - plotArea.x1),
				Math.abs(plotArea.y2 - plotArea.y1 + Math.max(axisY2GridThickness, axisYGridThickness) / 2 + Math.max(axisY2GridThickness, axisYGridThickness, axisX.lineThickness) / 2));

			ctx.clip();

			axisX.renderInterlacedColors();

			if (axisY)
				axisY.renderInterlacedColors();

			if (axisY2)
				axisY2.renderInterlacedColors();

			ctx.restore();


			axisX.renderGrid();

			if (axisY)
				axisY.renderGrid();

			if (axisY2)
				axisY2.renderGrid();


			axisX.renderAxisLine();

			if (axisY)
				axisY.renderAxisLine();

			if (axisY2)
				axisY2.renderAxisLine();
		}
		else {
			var axisXWidth = axisX.createLabelsAndCalculateWidth();

			if (axisY) {
				axisY.lineCoordinates = {};

				x1 = freeSpace.x1 + axisXWidth + axisX.margin + axisX.lineThickness / 2;
				x2 = freeSpace.x2 > axisY.chart.width - 10 ? axisY.chart.width - 10 : freeSpace.x2;

				axisY.lineCoordinates.x1 = x1;
				axisY.lineCoordinates.x2 = x2;
				axisY.lineCoordinates.width = Math.abs(x2 - x1);
			}

			if (axisY2) {
				axisY2.lineCoordinates = {};
				x1 = freeSpace.x1 + axisXWidth + axisX.margin + axisX.lineThickness / 2;
				x2 = freeSpace.x2 > axisY2.chart.width - 10 ? axisY2.chart.width - 10 : freeSpace.x2;

				axisY2.lineCoordinates.x1 = x1;
				axisY2.lineCoordinates.x2 = x2;
				axisY2.lineCoordinates.width = Math.abs(x2 - x1);
			}



			var axisYHeight = axisY ? axisY.createLabelsAndCalculateHeight() : 0;
			var axisY2Height = axisY2 ? axisY2.createLabelsAndCalculateHeight() : 0;


			// Position axisY based on the available free space, Margin and its height
			if (axisY) {
				//x1 = freeSpace.x1 + axisXWidth + axisX.margin + axisX.lineThickness / 2;
				//x2 = freeSpace.x2 > axisY.chart.width - 10 ? axisY.chart.width - 10 : freeSpace.x2;

				y1 = freeSpace.y2 - axisYHeight - axisY.margin;
				y2 = freeSpace.y2 - axisY.margin;

				//axisY.lineCoordinates = { x1: x1, y1: y1, x2: x2, y2: y1, width: Math.abs(x2 - x1) }
				axisY.lineCoordinates.y1 = y1;
				axisY.lineCoordinates.y2 = y1;

				axisY.boundingRect = { x1: x1, y1: y1, x2: x2, y2: y2, width: x2 - x1, height: axisYHeight };
			}

			// Position axisY based on the available free space, Margin and its height
			if (axisY2) {
				//x1 = freeSpace.x1 + axisXWidth + axisX.margin + axisX.lineThickness / 2;
				//x2 = freeSpace.x2 > axisY2.chart.width - 10 ? axisY2.chart.width - 10 : freeSpace.x2;

				y1 = freeSpace.y1 + axisY2.margin;
				y2 = freeSpace.y1 + axisY2.margin + axisY2Height;

				//axisY2.lineCoordinates = { x1: x1, y1: y2, x2: x2, y2: y2, width: Math.abs(x2 - x1) }
				axisY2.lineCoordinates.y1 = y2;
				axisY2.lineCoordinates.y2 = y2;

				axisY2.boundingRect = { x1: x1, y1: y1, x2: x2, y2: y2, width: x2 - x1, height: axisY2Height };
			}

			//axisY.ctx.rect(axisY.boundingRect.x1, axisY.boundingRect.y1, axisY.boundingRect.width, axisY.boundingRect.height);
			//axisY.ctx.stroke();

			// Position axisX based on the available free space, Margin and its height
			x1 = freeSpace.x1 + axisX.margin;
			y1 = freeSpace.y1 + axisY2Height + axisY2lineThickness / 2 < 10 ? 10 : freeSpace.y1 + axisY2Height + axisY2lineThickness / 2;
			x2 = freeSpace.x1 + axisXWidth + axisX.margin;
			y2 = freeSpace.y2 - axisYHeight - axisYMargin - axisYlineThickness / 2;


			axisX.lineCoordinates = { x1: x2, y1: y1, x2: x2, y2: y2, height: Math.abs(y2 - y1) }

			axisX.boundingRect = { x1: x1, y1: y1, x2: x2, y2: y2, width: x2 - x1, height: y2 - y1 };

			//axisX.ctx.rect(axisX.boundingRect.x1, axisX.boundingRect.y1, axisX.boundingRect.width, axisX.boundingRect.height);
			//axisX.ctx.stroke();

			axisX.calculateValueToPixelConvertionParameters();

			if (axisY)
				axisY.calculateValueToPixelConvertionParameters();
			if (axisY2)
				axisY2.calculateValueToPixelConvertionParameters();


			ctx.save();

			//ctx.rect(axisY.boundingRect.x1 - 30, axisY.boundingRect.y1, axisY.boundingRect.width + 60, axisY.boundingRect.height);
			//ctx.clip();

			if (axisY)
				axisY.renderLabelsTicksAndTitle();

			if (axisY2)
				axisY2.renderLabelsTicksAndTitle();

			//ctx.restore();

			axisX.renderLabelsTicksAndTitle();

			chart.preparePlotArea();
			var plotArea = axisX.chart.plotArea;

			ctx.save();
			ctx.rect(plotArea.x1 - Math.max(axisX.lineThickness, axisYGridThickness, axisY2GridThickness) / 2,
				plotArea.y1,
				Math.abs(plotArea.x2 - plotArea.x1 + Math.max(axisX.lineThickness, axisYGridThickness, axisY2GridThickness) / 2 + Math.max(axisYGridThickness, axisY2GridThickness) / 2),
				Math.abs(plotArea.y2 - plotArea.y1));

			ctx.clip();

			axisX.renderInterlacedColors();

			if (axisY)
				axisY.renderInterlacedColors();
			if (axisY2)
				axisY2.renderInterlacedColors();

			ctx.restore();


			axisX.renderGrid();


			if (axisY)
				axisY.renderGrid();

			if (axisY2)
				axisY2.renderGrid();


			axisX.renderAxisLine();

			if (axisY)
				axisY.renderAxisLine();

			if (axisY2)
				axisY2.renderAxisLine();
		}

	}

	Axis.prototype.renderLabelsTicksAndTitle = function () {

		var skipLabels = false;
		var totalLabelWidth = 0;
		var thresholdRatio = 1;
		var labelCount = 0;

		var intervalInPixels = this.convertionParameters.pixelPerUnit * this.interval;

		if (this.labelAngle !== 0 && this.labelAngle !== 360)
			thresholdRatio = 1.2;

		//Don't skip labels when interval is explicitely set
		if (typeof (this._options.interval) === "undefined") {
			if (this._position === "bottom" || this._position === "top") {

				//thresholdRatio = .9;// More space is preferred between labels when axis is horizontally aligned

				for (i = 0; i < this._labels.length; i++) {
					label = this._labels[i];
					if (label.position < this.minimum)
						continue;

					var width = label.textBlock.width * Math.cos(Math.PI / 180 * this.labelAngle) + label.textBlock.height * Math.sin(Math.PI / 180 * this.labelAngle);

					totalLabelWidth += width;
				}

				if (totalLabelWidth > this.lineCoordinates.width * thresholdRatio) {
					skipLabels = true;
				}
			} if (this._position === "left" || this._position === "right") {
				for (i = 0; i < this._labels.length; i++) {
					label = this._labels[i];
					if (label.position < this.minimum)
						continue;

					var width = label.textBlock.height * Math.cos(Math.PI / 180 * this.labelAngle) + label.textBlock.width * Math.sin(Math.PI / 180 * this.labelAngle);

					totalLabelWidth += width;
				}

				if (totalLabelWidth > this.lineCoordinates.height * thresholdRatio) {
					skipLabels = true;
				}
			}
		}

		if (this._position === "bottom") {
			var i = 0;

			//shrink the axis if the last label is going outside the chart
			//if (this.labelangle >= 0 && this.chart.rendercount === 0 && true) {
			//    var lastlabel = this._labels[this._labels.length - 1];

			//    if (lastlabel) {
			//        var lastlabelx = this.getpixelcoordinatesonaxis(lastlabel.position).x;
			//        var size = { width: lastlabel.textblock.width, height: lastlabel.textblock.height };

			//        if (this.labelangle > 0) {
			//            var hypotenuse = math.sqrt(math.pow(size.height / 2, 2) + math.pow(size.width, 2));
			//            var labeleffectivewidth = hypotenuse * math.cos(math.abs(math.pi / 180 * this.labelangle) - math.abs(math.acos(size.width / hypotenuse)));
			//        } else {
			//            var labeleffectivewidth = lastlabel.textblock.width / 2;
			//        }

			//        var shift = (lastlabelx + labeleffectivewidth - this.chart.width);
			//        if (shift > 0) {
			//            var newwidth = (lastlabelx - shift - this.linecoordinates.x1) / math.abs(lastlabel.position - this.minimum) * math.abs(this.maximum - this.minimum);

			//            this.lineCoordinates.x2 = this.lineCoordinates.x1 + newWidth;
			//            this.lineCoordinates.width = newWidth;
			//        }
			//    }
			//}

			this.ctx.lineWidth = this.tickThickness;
			this.ctx.strokeStyle = this.tickColor;

			var label;
			var xy;

			for (i = 0; i < this._labels.length; i++) {

				label = this._labels[i];
				if (label.position < this.minimum || label.position > this.maximum)
					continue;

				xy = this.getPixelCoordinatesOnAxis(label.position);

				if (this.tickThickness) {
					this.ctx.beginPath();
					this.ctx.moveTo(xy.x << 0, xy.y << 0);
					this.ctx.lineTo(xy.x << 0, xy.y + this.tickLength << 0);
					this.ctx.stroke();
				}

				if (skipLabels && labelCount++ % 2 !== 0)
					continue;

				if (label.textBlock.angle === 0) {
					xy.x -= label.textBlock.width / 2;
					//xy.y += this.tickLength + label.textBlock.height / 2;
					xy.y += this.tickLength + label.textBlock.fontSize / 2;

				} else {
					xy.x -= (this.labelAngle < 0 ? (label.textBlock.width * Math.cos(Math.PI / 180 * this.labelAngle)) : 0);
					xy.y += this.tickLength + Math.abs((this.labelAngle < 0 ? label.textBlock.width * Math.sin(Math.PI / 180 * this.labelAngle) : 0));
				}
				label.textBlock.x = xy.x;
				label.textBlock.y = xy.y;

				label.textBlock.render(true);
			}

			if (this.title) {

				this._titleTextBlock = new TextBlock(this.ctx, {
					x: this.lineCoordinates.x1,// This is recalculated again
					y: this.boundingRect.y2 - this.titleFontSize - 5,
					maxWidth: this.lineCoordinates.width,
					maxHeight: this.titleFontSize,
					angle: 0,
					text: this.title,
					horizontalAlign: "center",//left, center, right
					fontSize: this.titleFontSize,//in pixels
					fontFamily: this.titleFontFamily,
					fontWeight: this.titleFontWeight, //normal, bold, bolder, lighter,
					fontColor: this.titleFontColor,
					fontStyle: this.titleFontStyle, // normal, italic, oblique
					textBaseline: "top"
				});

				this._titleTextBlock.measureText();
				this._titleTextBlock.x = this.lineCoordinates.x1 + this.lineCoordinates.width / 2 - this._titleTextBlock.width / 2;
				this._titleTextBlock.render(true);
			}
		} else if (this._position === "top") {
			var i = 0;

			//Shrink the Axis if the last Label is going outside the Chart
			//if (this.labelAngle >= 0 && this.chart.renderCount === 0 && false) {
			//    var lastLabel = this._labels[this._labels.length - 1];

			//    if (lastLabel) {
			//        var lastLabelX = this.getPixelCoordinatesOnAxis(lastLabel.position).x;
			//        var size = { width: lastLabel.textBlock.width, height: lastLabel.textBlock.height };

			//        if (this.labelAngle > 0) {
			//            var hypotenuse = Math.sqrt(Math.pow(size.height / 2, 2) + Math.pow(size.width, 2));
			//            var labelEffectiveWidth = hypotenuse * Math.cos(Math.abs(Math.PI / 180 * this.labelAngle) - Math.abs(Math.acos(size.width / hypotenuse)));
			//        } else {
			//            var labelEffectiveWidth = lastLabel.textBlock.width / 2;
			//        }

			//        var shift = (lastLabelX + labelEffectiveWidth - this.chart.width);
			//        if (shift > 0) {
			//            var newWidth = (lastLabelX - shift - this.lineCoordinates.x1) / Math.abs(lastLabel.position - this.minimum) * Math.abs(this.maximum - this.minimum);

			//            this.lineCoordinates.x2 = this.lineCoordinates.x1 + newWidth;
			//            this.lineCoordinates.width = newWidth;
			//        }
			//    }
			//}

			this.ctx.lineWidth = this.tickThickness;
			this.ctx.strokeStyle = this.tickColor;

			var label;
			var xy;

			for (i = 0; i < this._labels.length; i++) {
				label = this._labels[i];
				if (label.position < this.minimum || label.position > this.maximum)
					continue;

				xy = this.getPixelCoordinatesOnAxis(label.position);

				if (this.tickThickness) {
					this.ctx.beginPath();
					this.ctx.moveTo(xy.x << 0, xy.y << 0);
					this.ctx.lineTo(xy.x << 0, xy.y - this.tickLength << 0);
					this.ctx.stroke();
				}

				if (skipLabels && labelCount++ % 2 !== 0)
					continue;

				if (label.textBlock.angle === 0) {
					xy.x -= label.textBlock.width / 2;
					xy.y -= this.tickLength + label.textBlock.height / 2;
				} else {
					xy.x -= (this.labelAngle > 0 ? (label.textBlock.width * Math.cos(Math.PI / 180 * this.labelAngle)) : 0);
					xy.y -= this.tickLength + Math.abs((this.labelAngle > 0 ? label.textBlock.width * Math.sin(Math.PI / 180 * this.labelAngle) + 5 : 5));
				}
				label.textBlock.x = xy.x;
				label.textBlock.y = xy.y;

				label.textBlock.render(true);
			}

			if (this.title) {

				this._titleTextBlock = new TextBlock(this.ctx, {
					x: this.lineCoordinates.x1,// This is recalculated again
					y: this.boundingRect.y1,
					maxWidth: this.lineCoordinates.width,
					maxHeight: this.titleFontSize,
					angle: 0,
					text: this.title,
					horizontalAlign: "center",//left, center, right
					fontSize: this.titleFontSize,//in pixels
					fontFamily: this.titleFontFamily,
					fontWeight: this.titleFontWeight, //normal, bold, bolder, lighter,
					fontColor: this.titleFontColor,
					fontStyle: this.titleFontStyle, // normal, italic, oblique
					textBaseline: "top"
				});

				this._titleTextBlock.measureText();
				this._titleTextBlock.x = this.lineCoordinates.x1 + this.lineCoordinates.width / 2 - this._titleTextBlock.width / 2;
				this._titleTextBlock.render(true);
			}
		} else if (this._position === "left") {
			this.ctx.lineWidth = this.tickThickness;
			this.ctx.strokeStyle = this.tickColor;

			var label;
			var xy;
			for (var i = 0; i < this._labels.length; i++) {
				label = this._labels[i];
				if (label.position < this.minimum || label.position > this.maximum)
					continue;

				xy = this.getPixelCoordinatesOnAxis(label.position);

				if (this.tickThickness) {
					this.ctx.beginPath();
					this.ctx.moveTo(xy.x << 0, xy.y << 0);
					this.ctx.lineTo(xy.x - this.tickLength << 0, xy.y << 0);
					this.ctx.stroke();
				}

				if (skipLabels && labelCount++ % 2 !== 0)
					continue;

				label.textBlock.x = xy.x - (label.textBlock.width * Math.cos(Math.PI / 180 * this.labelAngle)) - this.tickLength - 5;

				if (this.labelAngle === 0) {
					label.textBlock.y = xy.y - label.textBlock.height / 2 + this.labelFontSize / 2;
				} else
					label.textBlock.y = xy.y - (label.textBlock.width * Math.sin(Math.PI / 180 * this.labelAngle));

				label.textBlock.render(true);
			}

			if (this.title) {

				this._titleTextBlock = new TextBlock(this.ctx, {
					x: this.boundingRect.x1 + 5,
					y: this.lineCoordinates.y2,
					maxWidth: this.lineCoordinates.height,
					maxHeight: this.titleFontSize,
					angle: -90,
					text: this.title,
					horizontalAlign: "center",//left, center, right
					fontSize: this.titleFontSize,//in pixels
					fontFamily: this.titleFontFamily,
					fontWeight: this.titleFontWeight, //normal, bold, bolder, lighter,
					fontColor: this.titleFontColor,
					fontStyle: this.titleFontStyle, // normal, italic, oblique
					textBaseline: "top"
				});

				this._titleTextBlock.measureText();
				this._titleTextBlock.y = (this.lineCoordinates.height / 2 + this._titleTextBlock.width / 2 + this.lineCoordinates.y1);
				this._titleTextBlock.render(true);

			}
		} else if (this._position === "right") {
			this.ctx.lineWidth = this.tickThickness;
			this.ctx.strokeStyle = this.tickColor;

			var label;
			var xy;

			for (var i = 0; i < this._labels.length; i++) {
				label = this._labels[i];
				if (label.position < this.minimum || label.position > this.maximum)
					continue;

				xy = this.getPixelCoordinatesOnAxis(label.position);

				if (this.tickThickness) {
					this.ctx.beginPath();
					this.ctx.moveTo(xy.x << 0, xy.y << 0);
					this.ctx.lineTo(xy.x + this.tickLength << 0, xy.y << 0);
					this.ctx.stroke();
				}

				if (skipLabels && labelCount++ % 2 !== 0)
					continue;

				label.textBlock.x = xy.x + this.tickLength + 5;
				//label.textBlock.y = xy.y - (label.textBlock.width * Math.sin(Math.PI / 180 * this.labelAngle));
				if (this.labelAngle === 0) {
					label.textBlock.y = xy.y - label.textBlock.height / 2 + this.labelFontSize / 2;
				}
				else
					label.textBlock.y = xy.y;

				label.textBlock.render(true);
			}

			if (this.title) {

				this._titleTextBlock = new TextBlock(this.ctx, {
					x: this.boundingRect.x2 - 5,
					y: this.lineCoordinates.y2,
					maxWidth: this.lineCoordinates.height,
					maxHeight: this.titleFontSize,
					angle: 90,
					text: this.title,
					horizontalAlign: "center",//left, center, right
					fontSize: this.titleFontSize,//in pixels
					fontFamily: this.titleFontFamily,
					fontWeight: this.titleFontWeight, //normal, bold, bolder, lighter,
					fontColor: this.titleFontColor,
					fontStyle: this.titleFontStyle, // normal, italic, oblique
					textBaseline: "top"
				});

				this._titleTextBlock.measureText();
				this._titleTextBlock.y = (this.lineCoordinates.height / 2 - this._titleTextBlock.width / 2 + this.lineCoordinates.y1);
				this._titleTextBlock.render(true);

			}
		}
	}

	Axis.prototype.renderInterlacedColors = function () {
		var ctx = this.chart.plotArea.ctx;
		//return;

		var interlacedGridStartPoint;
		var interlacedGridEndPoint;
		var plotAreaCoordinates = this.chart.plotArea;
		if ((this._position === "bottom" || this._position === "top") && this.interlacedColor) {
			var i = 0;

			ctx.fillStyle = this.interlacedColor;

			for (i = 0; i < this._labels.length; i += 2) {
				interlacedGridStartPoint = this.getPixelCoordinatesOnAxis(this._labels[i].position);

				if (i + 1 >= this._labels.length)
					interlacedGridEndPoint = this.getPixelCoordinatesOnAxis(this.maximum);
				else
					interlacedGridEndPoint = this.getPixelCoordinatesOnAxis(this._labels[i + 1].position);

				ctx.fillRect(interlacedGridStartPoint.x, plotAreaCoordinates.y1, Math.abs(interlacedGridEndPoint.x - interlacedGridStartPoint.x), Math.abs(plotAreaCoordinates.y1 - plotAreaCoordinates.y2));
			}

		} else if ((this._position === "left" || this._position === "right") && this.interlacedColor) {

			ctx.fillStyle = this.interlacedColor;

			for (i = 0; i < this._labels.length; i += 2) {
				interlacedGridEndPoint = this.getPixelCoordinatesOnAxis(this._labels[i].position);

				if (i + 1 >= this._labels.length)
					interlacedGridStartPoint = this.getPixelCoordinatesOnAxis(this.maximum);
				else
					interlacedGridStartPoint = this.getPixelCoordinatesOnAxis(this._labels[i + 1].position);

				ctx.fillRect(plotAreaCoordinates.x1, interlacedGridStartPoint.y, Math.abs(plotAreaCoordinates.x1 - plotAreaCoordinates.x2), Math.abs(interlacedGridStartPoint.y - interlacedGridEndPoint.y));
			}
			//throw "123";
		}
	}

	Axis.prototype.renderGrid = function () {
		//var ctx = this.chart.plotArea.ctx;
		var ctx = this.chart.ctx;

		var xy;
		var plotAreaCoordinates = this.chart.plotArea;

		//return;

		if (this._position === "bottom" || this._position === "top") {

			if (this.gridThickness && this.gridThickness > 0) {
				ctx.lineWidth = this.gridThickness;
				ctx.strokeStyle = this.gridColor;

				ctx.beginPath();
				for (i = 0; i < this._labels.length; i++) {

					if (this._labels[i].position < this.minimum || this._labels[i].position > this.maximum)
						continue;

					xy = this.getPixelCoordinatesOnAxis(this._labels[i].position);

					ctx.moveTo(xy.x << 0, plotAreaCoordinates.y1 << 0);
					ctx.lineTo(xy.x << 0, plotAreaCoordinates.y2 << 0);
					ctx.stroke();

				}
			}

		}
		else if (this._position === "left" || this._position === "right") {

			if (this.gridThickness && this.gridThickness > 0) {
				ctx.lineWidth = this.gridThickness;
				ctx.strokeStyle = this.gridColor;

				ctx.beginPath();
				for (var i = 0; i < this._labels.length; i++) {

					if (this._labels[i].position < this.minimum || this._labels[i].position > this.maximum)
						continue;

					xy = this.getPixelCoordinatesOnAxis(this._labels[i].position);

					ctx.moveTo(plotAreaCoordinates.x1 << 0, xy.y << 0);
					ctx.lineTo(plotAreaCoordinates.x2 << 0, xy.y << 0);
					ctx.stroke();
				}
			}

		}
	}

	Axis.prototype.renderAxisLine = function () {
		//var ctx = this.chart.plotArea.ctx;
		var ctx = this.chart.ctx;

		if (this._position === "bottom" || this._position === "top") {
			if (this.lineThickness) {
				ctx.lineWidth = this.lineThickness;
				ctx.strokeStyle = this.lineColor ? this.lineColor : "black";

				ctx.beginPath();
				ctx.moveTo(this.lineCoordinates.x1, this.lineCoordinates.y1);
				ctx.lineTo(this.lineCoordinates.x2, this.lineCoordinates.y2);
				ctx.stroke();
			}

		} else if (this._position === "left" || this._position === "right") {
			if (this.lineThickness) {
				ctx.lineWidth = this.lineThickness;
				ctx.strokeStyle = this.lineColor;

				ctx.beginPath();
				ctx.moveTo(this.lineCoordinates.x1, this.lineCoordinates.y1);
				ctx.lineTo(this.lineCoordinates.x2, this.lineCoordinates.y2);
				ctx.stroke();
			}

		}
	}

	Axis.prototype.getPixelCoordinatesOnAxis = function (value) {
		var xy = {};
		var width = this.lineCoordinates.width;
		var height = this.lineCoordinates.height;

		if (this._position === "bottom" || this._position === "top") {
			var pixelPerUnit = width / Math.abs(this.maximum - this.minimum);

			xy.x = this.lineCoordinates.x1 + (pixelPerUnit * (value - this.minimum));
			xy.y = this.lineCoordinates.y1;
		}
		if (this._position === "left" || this._position === "right") {
			var pixelPerUnit = height / Math.abs(this.maximum - this.minimum);

			xy.y = this.lineCoordinates.y2 - (pixelPerUnit * (value - this.minimum));
			xy.x = this.lineCoordinates.x2;
		}

		return xy;
	}

	Axis.prototype.getXValueAt = function (pixel) {
		if (!pixel)
			return null;

		var xval = null;

		if (this._position === "left") {
			xval = (this.chart.axisX.maximum - this.chart.axisX.minimum) / this.chart.axisX.lineCoordinates.height * ((this.chart.axisX.lineCoordinates.y2 - pixel.y)) + this.chart.axisX.minimum;
		}
		else if (this._position === "bottom") {
			xval = (this.chart.axisX.maximum - this.chart.axisX.minimum) / this.chart.axisX.lineCoordinates.width * (pixel.x - this.chart.axisX.lineCoordinates.x1) + this.chart.axisX.minimum;
		}

		return xval;
	}

	Axis.prototype.calculateValueToPixelConvertionParameters = function (value) {
		var xy = {};
		var convertionParameters = { pixelPerUnit: null, minimum: null, reference: null };

		var width = this.lineCoordinates.width;
		var height = this.lineCoordinates.height;

		convertionParameters.minimum = this.minimum;

		if (this._position === "bottom" || this._position === "top") {
			convertionParameters.pixelPerUnit = width / Math.abs(this.maximum - this.minimum);
			convertionParameters.reference = this.lineCoordinates.x1;

			//xy.x = this.lineCoordinates.x1 + (pixelPerUnit * (value - this.minimum));
			//xy.y = this.lineCoordinates.y1;
		}
		if (this._position === "left" || this._position === "right") {
			convertionParameters.pixelPerUnit = -1 * height / Math.abs(this.maximum - this.minimum);
			convertionParameters.reference = this.lineCoordinates.y2;

			//xy.y = this.lineCoordinates.y2 + (pixelPerUnit * (value - this.minimum));
			//xy.x = this.lineCoordinates.x2;
		}


		this.convertionParameters = convertionParameters;
	}

	Axis.prototype.calculateAxisParameters = function () {

		var freeSpace = this.chart.layoutManager.getFreeSpace();
		var availableWidth = 0;
		var availableHeight = 0;

		if (this._position === "bottom" || this._position === "top") {
			this.maxWidth = freeSpace.width;
			this.maxHeight = freeSpace.height;
		} else {
			this.maxWidth = freeSpace.height;
			this.maxHeight = freeSpace.width;
		}

		var noTicks = this.type === "axisX" ? (this.maxWidth < 500 ? 8 : Math.max(6, Math.floor(this.maxWidth / 62))) : Math.floor(this.maxWidth / 40);
		//var noTicks = 8;
		var min, max;
		var minDiff;
		var range;

		if (this.type === "axisX") {
			min = (this.sessionVariables.internalMinimum !== null) ? this.sessionVariables.internalMinimum : this.dataInfo.viewPortMin;
			max = (this.sessionVariables.internalMaximum !== null) ? this.sessionVariables.internalMaximum : this.dataInfo.viewPortMax;

			if (max - min === 0) {
				//max += 1;
				max += .4;
				min -= .4;
			}

			if (this.dataInfo.minDiff !== Infinity)
				minDiff = this.dataInfo.minDiff;
			else
				minDiff = 1;

		} else if (this.type === "axisY") {

			min = typeof (this._options.minimum) === "undefined" ? this.dataInfo.viewPortMin : this._options.minimum;
			max = typeof (this._options.maximum) === "undefined" ? this.dataInfo.viewPortMax : this._options.maximum;

			// When there is only a single dataPoint or when all dapoints have same Y Value
			if (max - min === 0) {
				max += 5;
				min -= 5;
			}
			else {
				//var scaleFactor = Math.abs(max - min) * .01;
				if (max !== 0)
					max += Math.abs(.05);
				if (min !== 0)
					min -= Math.abs(.05);
			}


			//Apply includeZero
			if (this.includeZero && typeof (this._options.minimum) === "undefined") {
				if (min > 0)
					min = 0;
			}
			if (this.includeZero && typeof (this._options.maximum) === "undefined") {
				if (max < 0)
					max = 0;
			}
		}

		if (this.type === "axisX" && this.chart.plotInfo.axisXValueType === "dateTime") {

			range = max - min;

			if (!this.intervalType) {

				if (range / (1 * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "millisecond";
				} else if (range / (1 * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "millisecond";
				} else if (range / (1 * 5) <= noTicks) {
					this.interval = 5;
					this.intervalType = "millisecond";
				} else if (range / (1 * 10) <= noTicks) {
					this.interval = 10;
					this.intervalType = "millisecond";
				} else if (range / (1 * 20) <= noTicks) {
					this.interval = 20;
					this.intervalType = "millisecond";
				} else if (range / (1 * 50) <= noTicks) {
					this.interval = 50;
					this.intervalType = "millisecond";
				} else if (range / (1 * 100) <= noTicks) {
					this.interval = 100;
					this.intervalType = "millisecond";
				} else if (range / (1 * 200) <= noTicks) {
					this.interval = 200;
					this.intervalType = "millisecond";
				} else if (range / (1 * 250) <= noTicks) {
					this.interval = 250;
					this.intervalType = "millisecond";
				} else if (range / (1 * 300) <= noTicks) {
					this.interval = 300;
					this.intervalType = "millisecond";
				} else if (range / (1 * 400) <= noTicks) {
					this.interval = 400;
					this.intervalType = "millisecond";
				} else if (range / (1 * 500) <= noTicks) {
					this.interval = 500;
					this.intervalType = "millisecond";
				} else if (range / (constants.secondDuration * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "second";
				} else if (range / (constants.secondDuration * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "second";
				} else if (range / (constants.secondDuration * 5) <= noTicks) {
					this.interval = 5;
					this.intervalType = "second";
				} else if (range / (constants.secondDuration * 10) <= noTicks) {
					this.interval = 10;
					this.intervalType = "second";
				} else if (range / (constants.secondDuration * 15) <= noTicks) {
					this.interval = 15;
					this.intervalType = "second";
				} else if (range / (constants.secondDuration * 20) <= noTicks) {
					this.interval = 20;
					this.intervalType = "second";
				} else if (range / (constants.secondDuration * 30) <= noTicks) {
					this.interval = 30;
					this.intervalType = "second";
				} else if (range / (constants.minuteDuration * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "minute";
				} else if (range / (constants.minuteDuration * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "minute";
				} else if (range / (constants.minuteDuration * 5) <= noTicks) {
					this.interval = 5;
					this.intervalType = "minute";
				} else if (range / (constants.minuteDuration * 10) <= noTicks) {
					this.interval = 10;
					this.intervalType = "minute";
				} else if (range / (constants.minuteDuration * 15) <= noTicks) {
					this.interval = 15;
					this.intervalType = "minute";
				} else if (range / (constants.minuteDuration * 20) <= noTicks) {
					this.interval = 20;
					this.intervalType = "minute";
				} else if (range / (constants.minuteDuration * 30) <= noTicks) {
					this.interval = 30;
					this.intervalType = "minute";
				} else if (range / (constants.hourDuration * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "hour";
				} else if (range / (constants.hourDuration * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "hour";
				} else if (range / (constants.hourDuration * 3) <= noTicks) {
					this.interval = 3;
					this.intervalType = "hour";
				} else if (range / (constants.hourDuration * 6) <= noTicks) {
					this.interval = 6;
					this.intervalType = "hour";
				} else if (range / (constants.dayDuration * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "day";
				} else if (range / (constants.dayDuration * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "day";
				} else if (range / (constants.dayDuration * 4) <= noTicks) {
					this.interval = 4;
					this.intervalType = "day";
				} else if (range / (constants.weekDuration * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "week";
				} else if (range / (constants.weekDuration * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "week";
				} else if (range / (constants.weekDuration * 3) <= noTicks) {
					this.interval = 3;
					this.intervalType = "week";
				} else if (range / (constants.monthDuration * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "month";
				} else if (range / (constants.monthDuration * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "month";
				} else if (range / (constants.monthDuration * 3) <= noTicks) {
					this.interval = 3;
					this.intervalType = "month";
				} else if (range / (constants.monthDuration * 6) <= noTicks) {
					this.interval = 6;
					this.intervalType = "month";
				} else if (range / (constants.yearDuration * 1) <= noTicks) {
					this.interval = 1;
					this.intervalType = "year";
				} else if (range / (constants.yearDuration * 2) <= noTicks) {
					this.interval = 2;
					this.intervalType = "year";
				} else if (range / (constants.yearDuration * 4) <= noTicks) {
					this.interval = 4;
					this.intervalType = "year";
				} else {
					this.interval = Math.floor(Axis.getNiceNumber(range / (noTicks - 1), true) / constants.yearDuration);
					this.intervalType = "year";
				}

			}

			if (this.sessionVariables.internalMinimum !== null)
				this.minimum = this.sessionVariables.internalMinimum;
			else {
				this.minimum = min - minDiff / 2;
			}

			if (this.sessionVariables.internalMaximum)
				this.maximum = this.sessionVariables.internalMaximum;
			else
				this.maximum = max + minDiff / 2;

			if (!this.valueFormatString) {
				if (this.intervalType === "year") {
					this.valueFormatString = "YYYY";
				} else if (this.intervalType === "month") {
					this.valueFormatString = "MMM YYYY";
				} else if (this.intervalType === "week") {
					this.valueFormatString = "MMM DD YYYY";
				} else if (this.intervalType === "day") {
					this.valueFormatString = "MMM DD YYYY";
				} else if (this.intervalType === "hour") {
					this.valueFormatString = "hh:mm TT";
				} else if (this.intervalType === "minute") {
					this.valueFormatString = "hh:mm TT";
				} else if (this.intervalType === "second") {
					this.valueFormatString = "hh:mm:ss TT";
				} else if (this.intervalType === "millisecond") {
					this.valueFormatString = "fff'ms'";
				}
			}

			this.intervalStartPosition = this.getLabelStartPoint(new Date(this.minimum), this.intervalType, this.interval);

		} else {

			this.intervalType = "number";

			range = Axis.getNiceNumber(max - min, false);

			if (this._options && this._options.interval)
				this.interval = this._options.interval;
			else {
				this.interval = Axis.getNiceNumber(range / (noTicks - 1), true);
			}

			if (this.sessionVariables.internalMinimum !== null)
				this.minimum = this.sessionVariables.internalMinimum;
			else
				this.minimum = Math.floor(min / this.interval) * this.interval;

			if (this.sessionVariables.internalMaximum !== null)
				this.maximum = this.sessionVariables.internalMaximum;
			else
				this.maximum = Math.ceil(max / this.interval) * this.interval;

			//var nfrac = Math.max(-Math.floor(Math.log(d)/Math.LN10), 0); //number of fractional digits to show

			if (this.type === "axisX") {
				if (!(this.sessionVariables.internalMinimum !== null)) {
					this.minimum = min - minDiff / 2;
				}
				if (!this.sessionVariables.internalMaximum) {

					this.maximum = max + minDiff / 2;
				}

				this.intervalStartPosition = Math.floor((this.minimum + this.interval) / this.interval) * this.interval;
			} else if (this.type === "axisY") {
				this.intervalStartPosition = this.minimum;
				//Apply includeZero
				//if (!(this._options && this._options.minimum) && this.includeZero) {
				//if (this.includeZero) {
				//    if (this.minimum > 0)
				//        this.minimum = 0;
				//}

				////if (!(this._options && this._options.maximum) && this.includeZero) {
				//if (this.includeZero) {
				//    if (this.maximum < 0)
				//        this.maximum = 0;
				//}
			}


		}

		if (this.type === "axisX") {
			this._absoluteMinimum = this._options && typeof (this._options.minimum) !== "undefined" ? this._options.minimum : this.dataInfo.min - minDiff / 2;
			this._absoluteMaximum = this._options && typeof (this._options.maximum) !== "undefined" ? this._options.maximum : this.dataInfo.max + minDiff / 2;
		}

		//Set valueFormatString
		if (!this.valueFormatString) {
			this.valueFormatString = "#,##0.##";

			range = Math.abs(this.maximum - this.minimum);

			if (range < 1) {
				var numberOfDecimals = Math.floor(Math.abs(Math.log(range) / Math.LN10)) + 2;

				if (numberOfDecimals > 2) {
					for (var i = 0; i < numberOfDecimals - 2; i++)
						this.valueFormatString += "#";
				}
			}

		}

		//if (isDebugMode && window.console) {
		//    window.console.log(this.type + ": Min = " + this.minimum);
		//    window.console.log(this.type + ": Max = " + this.maximum);
		//    window.console.log(this.type + ": Interval = " + this.interval);
		//}
	}

	Axis.prototype._getFontString = function () {
		return this.labelFontStyle + " " + this.labelFontWeight + " " + this.labelFontSize + "px " + this.labelFontFamily
	}

	Axis.getNiceNumber = function (x, round) {

		var exp = Math.floor(Math.log(x) / Math.LN10);
		var f = x / Math.pow(10, exp);
		var nf;

		if (round) {
			if (f < 1.5)
				nf = 1;
			else if (f < 3)
				nf = 2;
			else if (f < 7)
				nf = 5;
			else
				nf = 10;
		}
		else {
			if (f <= 1)
				nf = 1;
			else if (f <= 2)
				nf = 2;
			else if (f <= 5)
				nf = 5;
			else nf = 10;
		}

		return nf * Math.pow(10, exp);
	}

	Axis.prototype.getLabelStartPoint = function () {

		var intervalInMilliseconds = convertToNumber(this.interval, this.intervalType);
		var minimum = Math.floor((this.minimum) / intervalInMilliseconds) * intervalInMilliseconds;
		var dateTime = new Date(minimum);

		if (this.intervalType === "millisecond") {
			//millisecond = dateTime.getMilliSecond();
			//millisecond = Math.floor((millisecond + this.interval) / this.interval) * this.interval;
		}
		else if (this.intervalType === "second") {
			if (dateTime.getMilliseconds() > 0) {
				dateTime.setSeconds(dateTime.getSeconds() + 1);
				dateTime.setMilliseconds(0);
			}
		}
		else if (this.intervalType === "minute") {
			if (dateTime.getSeconds() > 0 || dateTime.getMilliseconds() > 0) {
				dateTime.setMinutes(dateTime.getMinutes() + 1);
				dateTime.setSeconds(0);
				dateTime.setMilliseconds(0);
			}
		}
		else if (this.intervalType === "hour") {
			if (dateTime.getMinutes() > 0 || dateTime.getSeconds() > 0 || dateTime.getMilliseconds() > 0) {
				dateTime.setHours(dateTime.getHours() + 1);
				dateTime.setMinutes(0);
				dateTime.setSeconds(0);
				dateTime.setMilliseconds(0);
			}
		}
		else if (this.intervalType === "day") {
			if (dateTime.getHours() > 0 || dateTime.getMinutes() > 0 || dateTime.getSeconds() > 0 || dateTime.getMilliseconds() > 0) {
				dateTime.setDate(dateTime.getDate() + 1);
				dateTime.setHours(0);
				dateTime.setMinutes(0);
				dateTime.setSeconds(0);
				dateTime.setMilliseconds(0);
			}
		}
		else if (this.intervalType === "week") {
			if (dateTime.getDay() > 0 || dateTime.getHours() > 0 || dateTime.getMinutes() > 0 || dateTime.getSeconds() > 0 || dateTime.getMilliseconds() > 0) {
				dateTime.setDate(dateTime.getDate() + (7 - dateTime.getDay()));
				dateTime.setHours(0);
				dateTime.setMinutes(0);
				dateTime.setSeconds(0);
				dateTime.setMilliseconds(0);
			}
		}
		else if (this.intervalType === "month") {
			if (dateTime.getDate() > 1 || dateTime.getHours() > 0 || dateTime.getMinutes() > 0 || dateTime.getSeconds() > 0 || dateTime.getMilliseconds() > 0) {
				dateTime.setMonth(dateTime.getMonth() + 1);
				dateTime.setDate(1);
				dateTime.setHours(0);
				dateTime.setMinutes(0);
				dateTime.setSeconds(0);
				dateTime.setMilliseconds(0);
			}
		}
		else if (this.intervalType === "year") {
			if (dateTime.getMonth() > 0 || dateTime.getDate() > 1 || dateTime.getHours() > 0 || dateTime.getMinutes() > 0 || dateTime.getSeconds() > 0 || dateTime.getMilliseconds() > 0) {
				dateTime.setFullYear(dateTime.getFullYear() + 1);
				dateTime.setMonth(0);
				dateTime.setDate(1);
				dateTime.setHours(0);
				dateTime.setMinutes(0);
				dateTime.setSeconds(0);
				dateTime.setMilliseconds(0);
			}
		}

		return dateTime;
	}

	//#endregion Axis

	//#region ToolTip

	function ToolTip(chart, options, theme) {
		ToolTip.parent.constructor.call(this, "ToolTip", options, theme);

		this.chart = chart;
		this.canvas = chart.canvas;
		this.ctx = this.chart.ctx;
		this.currentSeriesIndex = -1;
		this.currentDataPointIndex = -1;
		this._timerId = 0;
		this._prevX = NaN;
		this._prevY = NaN;

		this._initialize();
	}
	extend(ToolTip, CanvasJSObject);

	ToolTip.prototype._initialize = function () {

		if (this.enabled) {
			this.container = document.createElement("div");
			this.container.style.position = "absolute";
			this.container.style.height = "auto";
			this.container.style.boxShadow = "1px 1px 2px 2px rgba(0,0,0,0.1)";
			this.container.style.zIndex = "1000";
			//this.container.style.pointerEvents = "none";
			this.container.style.display = "none";
			//this.container.style.whiteSpace = "no-wrap";

			var toolTipHtml = "<div style=\" width: auto;";
			toolTipHtml += "height: auto;";
			toolTipHtml += "min-width: 50px;";
			toolTipHtml += "line-height: 20px;";
			toolTipHtml += "padding: 5px;";
			toolTipHtml += "font-family: Calibri, Arial, Georgia, serif;";
			toolTipHtml += "font-weight: 400;";
			toolTipHtml += "font-style: italic;";
			toolTipHtml += "font-size: 14px;";
			toolTipHtml += "color: #000000;";
			toolTipHtml += "text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);";
			toolTipHtml += "text-align: left;";
			toolTipHtml += "border: 2px solid gray;";

			//Older browsers like IE8- don't support alpha values
			toolTipHtml += isCanvasSupported ? "background: rgba(255,255,255,.9);" : "background: rgb(255,255,255);";

			toolTipHtml += "text-indent: 0px;";
			toolTipHtml += "white-space: nowrap;";
			//toolTipHtml += "pointer-events:none;";
			toolTipHtml += "border-radius: 10px;";
			//toolTipHtml += "opacity: 0;";
			//toolTipHtml += "filter: progid: DXImageTransform.Microsoft.gradient(GradientType = 0, startColorstr = '#4cffffff', endColorstr = '#4cffffff');";

			if (!isCanvasSupported) {
				//toolTipHtml += "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=90)'";
				//-ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000')";
				/* For IE 5.5 - 7 */
				toolTipHtml += "filter: alpha(opacity = 90);";
				toolTipHtml += "filter: progid:DXImageTransform.Microsoft.Shadow(Strength=3, Direction=135, Color='#666666');";
			}

			toolTipHtml += "} \"> Sample Tooltip</div>";

			this.container.innerHTML = toolTipHtml;
			this.contentDiv = this.container.firstChild;


			this.container.style.borderRadius = this.contentDiv.style.borderRadius;
			this.chart._canvasJSContainer.appendChild(this.container);
		}
	}

	ToolTip.prototype.mouseMoveHandler = function (x, y) {

		if (!(this._lastUpdated && (new Date().getTime() - this._lastUpdated) < 40)) {
			this._lastUpdated = new Date().getTime();
			this._updateToolTip(x, y);
		}
	}

	ToolTip.prototype._updateToolTip = function (mouseX, mouseY) {
		//return;

		if (!this.enabled)
			return;

		if (typeof (mouseX) === "undefined" || typeof (mouseY) === "undefined") {
			if (isNaN(this._prevX) || isNaN(this._prevY))
				return;
			else {
				mouseX = this._prevX;
				mouseY = this._prevY;
			}
		} else {
			this._prevX = mouseX;
			this._prevY = mouseY;
		}


		var dataPoint = null;
		var dataSeries = null;
		var toolTipContent = "";
		var entries = [];
		var toolTipRight;
		var toolTipBottom;
		var x = 0;

		if (this.shared && this.chart.plotInfo.axisPlacement !== "none") {
			// && this.chart.plotInfo.axisPlacement !== "none"
			if (this.chart.plotInfo.axisPlacement === "xySwapped") {
				x = (this.chart.axisX.maximum - this.chart.axisX.minimum) / this.chart.axisX.lineCoordinates.height * ((this.chart.axisX.lineCoordinates.y2 - mouseY)) + this.chart.axisX.minimum;
			}
			else {
				x = (this.chart.axisX.maximum - this.chart.axisX.minimum) / this.chart.axisX.lineCoordinates.width * (mouseX - this.chart.axisX.lineCoordinates.x1) + this.chart.axisX.minimum;
			}

			var nearbyEntries = [];

			for (var i = 0; i < this.chart.data.length; i++) {
				var entry = this.chart.data[i].getDataPointAtX(x, true);

				if (entry && entry.index >= 0) {
					entry.dataSeries = this.chart.data[i];

					nearbyEntries.push(entry);
				}
			}

			if (nearbyEntries.length === 0)
				return;

			nearbyEntries.sort(function (entry1, entry2) {
				return entry1.distance - entry2.distance;
			});

			var closest = nearbyEntries[0];

			for (i = 0; i < nearbyEntries.length; i++) {

				if (nearbyEntries[i].dataPoint.x.valueOf() === closest.dataPoint.x.valueOf())
					entries.push(nearbyEntries[i]);
			}

			nearbyEntries = null;

		} else {

			var dataPointInfo = this.chart.getDataPointAtXY(mouseX, mouseY, true);
			//dataPointInfo = null;

			if (dataPointInfo) {
				this.currentDataPointIndex = dataPointInfo.dataPointIndex;
				this.currentSeriesIndex = dataPointInfo.dataSeries.index;
			} else if (isCanvasSupported) {

				var id = getObjectId(mouseX, mouseY, this.chart._eventManager.ghostCtx);
				if (id > 0 && typeof this.chart._eventManager.objectMap[id] !== "undefined") {//DataPoint/DataSeries event
					eventObject = this.chart._eventManager.objectMap[id];

					//if (this.currentSeriesIndex === eventObject.dataSeriesIndex && this.currentDataPointIndex === eventObject.dataPointIndex)
					//  return;
					//else {
					this.currentSeriesIndex = eventObject.dataSeriesIndex;
					this.currentDataPointIndex = eventObject.dataPointIndex >= 0 ? eventObject.dataPointIndex : -1;
					//}

					//window.console.log("id: " + id + "; hex: " + intToHexColorString(id));
				} else
					this.currentDataPointIndex = -1;

			} else
				this.currentDataPointIndex = -1;


			if (this.currentSeriesIndex >= 0) {

				dataSeries = this.chart.data[this.currentSeriesIndex];

				var entry = {};

				if (this.currentDataPointIndex >= 0) {
					dataPoint = dataSeries.dataPoints[this.currentDataPointIndex];

					entry.dataSeries = dataSeries;
					entry.dataPoint = dataPoint;
					entry.index = this.currentDataPointIndex;
					entry.distance = Math.abs(dataPoint.x - x);
				} else if (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline" || dataSeries.type === "area" || dataSeries.type === "splineArea" || dataSeries.type === "stackedArea" || dataSeries.type === "stackedArea100") {
					var x = (this.chart.axisX.maximum - this.chart.axisX.minimum) / this.chart.axisX.lineCoordinates.width * (mouseX - this.chart.axisX.lineCoordinates.x1) + this.chart.axisX.minimum.valueOf();

					entry = dataSeries.getDataPointAtX(x, true);
					entry.dataSeries = dataSeries;
					this.currentDataPointIndex = entry.index;
					dataPoint = entry.dataPoint;
				} else {
					//this.hide();
					return;
				}

				entries.push(entry);
			}
		}


		if (entries.length > 0) {

			this.highlightObjects(entries);


			var toolTipInnerHtml = "";

			toolTipInnerHtml = this.getToolTipInnerHTML({ entries: entries });

			this.contentDiv.innerHTML = toolTipInnerHtml;

			this.contentDiv.innerHTML = toolTipInnerHtml;

			var previouslyHidden = false;
			if (this.container.style.display === "none") {
				previouslyHidden = true;
				this.container.style.display = "block";
			}

			try {
				this.contentDiv.style.borderRightColor = this.contentDiv.style.borderLeftColor = this.contentDiv.style.borderColor = this.borderColor ? this.borderColor : entries[0].dataPoint.color ? entries[0].dataPoint.color : entries[0].dataSeries.color ? entries[0].dataSeries.color : entries[0].dataSeries._colorSet[entries[0].index % entries[0].dataSeries._colorSet.length];
			} catch (e) { }

			//var toolTipContent = dataSeries.toolTipContent ? dataSeries.toolTipContent : dataPoint.toolTipContent ? dataPoint.toolTipContent : "<strong>{x}</strong><br/><strong style='\"'color:{color};'\"'>{name}</strong>,&nbsp;&nbsp;<strong>y</strong>:{y}";

			//var toolTipInnerHtml = " x: " + (this.chart.plotInfo.axisXValueType === "dateTime" ? dateFormat(searchResult.dataPoint.x, this.chart.axisX.valueFormatString) : numberFormat(searchResult.dataPoint.x, this.chart.axisX.valueFormatString)) + ", y: " + numberFormat(searchResult.dataPoint.y, "#,###0.##");
			if (entries[0].dataSeries.type === "pie" || entries[0].dataSeries.type === "doughnut" || entries[0].dataSeries.type === "bar" || entries[0].dataSeries.type === "stackedBar" || entries[0].dataSeries.type === "stackedBar100") {
				//toolTipRight = mouseX - 10;
				toolTipLeft = mouseX - 10 - this.container.clientWidth;
			} else {
				//toolTipRight = (((this.chart.axisX.lineCoordinates.width / Math.abs(this.chart.axisX.maximum - this.chart.axisX.minimum)) * Math.abs(entries[0].dataPoint.x - this.chart.axisX.minimum)) + this.chart.axisX.lineCoordinates.x1 + .5) << 0;
				toolTipLeft = (((this.chart.axisX.lineCoordinates.width / Math.abs(this.chart.axisX.maximum - this.chart.axisX.minimum)) * Math.abs(entries[0].dataPoint.x - this.chart.axisX.minimum)) + this.chart.axisX.lineCoordinates.x1 + .5) - this.container.clientWidth << 0;
				toolTipLeft -= 10;
			}

			//toolTipRight = (toolTipRight - 10 - this.container.clientWidth) > 0 ? (this.chart.width - toolTipRight + 10) + "px" : (this.chart.width - toolTipRight + (toolTipRight - 10 - this.container.clientWidth)) + "px";
			//toolTipRight = (toolTipRight - 10 - this.container.clientWidth) > 0 ? (this.chart.width - toolTipRight + 10) + "px" : (this.chart.width - toolTipRight + (toolTipRight - 10 - this.container.clientWidth)) + "px";
			toolTipLeft = toolTipLeft > 0 ? toolTipLeft + "px" : toolTipLeft + this.container.clientWidth + 20 + "px";


			if (entries.length === 1 && !this.shared && (entries[0].dataSeries.type === "line" || entries[0].dataSeries.type === "stepLine" || entries[0].dataSeries.type === "spline" || entries[0].dataSeries.type === "area" || entries[0].dataSeries.type === "splineArea" || entries[0].dataSeries.type === "stackedArea" || entries[0].dataSeries.type === "stackedArea100")) {
				toolTipBottom = (entries[0].dataSeries.axisY.lineCoordinates.y2 - entries[0].dataSeries.axisY.lineCoordinates.height / Math.abs(entries[0].dataSeries.axisY.maximum - entries[0].dataSeries.axisY.minimum) * Math.abs(entries[0].dataPoint.y - entries[0].dataSeries.axisY.minimum) + .5) << 0;
			} else if (entries[0].dataSeries.type === "bar" || entries[0].dataSeries.type === "stackedBar" || entries[0].dataSeries.type === "stackedBar100") {
				toolTipBottom = (entries[0].dataSeries.axisX.lineCoordinates.y2 - entries[0].dataSeries.axisX.lineCoordinates.height / Math.abs(entries[0].dataSeries.axisX.maximum - entries[0].dataSeries.axisX.minimum) * Math.abs(entries[0].dataPoint.x - entries[0].dataSeries.axisX.minimum) + .5) << 0;
			}
			else {
				toolTipBottom = mouseY;
			}

			toolTipBottom = (-toolTipBottom + 10);

			if (toolTipBottom + this.container.clientHeight + 5 > 0) {
				toolTipBottom -= toolTipBottom + this.container.clientHeight + 5 - 0
			}

			toolTipBottom += "px";

			//this.container.style.right = toolTipRight;
			this.container.style.left = toolTipLeft;
			this.container.style.bottom = toolTipBottom;

			if (!this.animationEnabled || previouslyHidden) {
				this.disableAnimation();
			}
			else
				this.enableAnimation();

			//if (isDebugMode)
			//  console.log("searchX: " + x + " x: " + searchResult.dataPoint.x + "; y: " + searchResult.dataPoint.y + "; distance: " + searchResult.distance + "; steps: " + steps);
		}
	}


	ToolTip.prototype.highlightObjects = function (entries) {

		if (!this.enabled)
			return;

		//this.chart.overlaidCanvasCtx.clearRect(0, 0, this.chart.overlaidCanvas.width, this.chart.overlaidCanvas.height);
		var overlaidCanvasCtx = this.chart.overlaidCanvasCtx;
		this.chart.resetOverlayedCanvas();

		overlaidCanvasCtx.save();


		var plotArea = this.chart.plotArea;
		overlaidCanvasCtx.rect(plotArea.x1, plotArea.y1, plotArea.width, plotArea.height);
		overlaidCanvasCtx.clip();
		overlaidCanvasCtx.beginPath();


		for (var i = 0; i < entries.length; i++) {

			var entry = entries[i];

			var eventObject = this.chart._eventManager.objectMap[entry.dataSeries.dataPointIds[entry.index]];

			if (!eventObject || !eventObject.objectType || eventObject.objectType !== "dataPoint")
				continue;

			var dataSeries = this.chart.data[eventObject.dataSeriesIndex];
			var dataPoint = this.chart.data[eventObject.dataPointIndex];
			var index = eventObject.dataPointIndex;

			if (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline" || dataSeries.type === "scatter"
				|| dataSeries.type === "area" || dataSeries.type === "splineArea" || dataSeries.type === "stackedArea" || dataSeries.type === "stackedArea100") {
				var markerProps = dataSeries.getMarkerProperties(index, eventObject.x1, eventObject.y1, this.chart.overlaidCanvasCtx);
				markerProps.size = Math.max(markerProps.size * 1.5 << 0, 10);

				markerProps.borderColor = markerProps.borderColor || "#FFFFFF";
				markerProps.borderThickness = markerProps.borderThickness || Math.ceil(markerProps.size * .1);

				//overlaidCanvasCtx.globalAlpha = .8;
				RenderHelper.drawMarkers([markerProps]);
				//overlaidCanvasCtx.globalAlpha = .8;
			} else if (dataSeries.type === "bubble") {
				var markerProps = dataSeries.getMarkerProperties(index, eventObject.x1, eventObject.y1, this.chart.overlaidCanvasCtx);
				markerProps.size = eventObject.size;
				markerProps.color = "white";
				markerProps.borderColor = "white";
				//markerProps.borderThickness = 2;
				overlaidCanvasCtx.globalAlpha = .3;
				RenderHelper.drawMarkers([markerProps]);
				overlaidCanvasCtx.globalAlpha = 1;
			} else if (dataSeries.type === "column" || dataSeries.type === "stackedColumn" || dataSeries.type === "stackedColumn100"
				|| dataSeries.type === "bar" || dataSeries.type === "stackedBar" || dataSeries.type === "stackedBar100") {
				overlaidCanvasCtx.globalAlpha = .3;
				drawRect(overlaidCanvasCtx, eventObject.x1, eventObject.y1, eventObject.x2, eventObject.y2, "white", false, false, false, false);
				overlaidCanvasCtx.globalAlpha = 1;
			}
			else if (dataSeries.type === "pie" || dataSeries.type === "doughnut") {
				overlaidCanvasCtx.globalAlpha = .3;
				drawSegment(overlaidCanvasCtx, eventObject.center, eventObject.radius, "white", dataSeries.type, eventObject.startAngle, eventObject.endAngle);
				overlaidCanvasCtx.globalAlpha = 1;
			}
			continue;
		}

		overlaidCanvasCtx.globalAlpha = 1;

		overlaidCanvasCtx.restore();
		return;
	}

	ToolTip.prototype.getToolTipInnerHTML = function (e) {
		var entries = e.entries;
		var toolTipInnerHtml = "";
		var dataSeries = null;
		var dataPoint = null;
		var index = 0;
		var color = null;
		var toolTipContent = "";

		var isToolTipDefinedInData = true;
		for (var i = 0; i < entries.length; i++) {
			if (entries[i].dataSeries.toolTipContent || entries[i].dataPoint.toolTipContent) {
				isToolTipDefinedInData = false;
				break;
			}
		}

		if (isToolTipDefinedInData && this.content && typeof (this.content) === "function") {

			toolTipInnerHtml = this.content({ entries: entries });

		} else {

			if (entries.length > 1) {

				for (var i = 0; i < entries.length; i++) {
					dataSeries = entries[i].dataSeries;
					dataPoint = entries[i].dataPoint;
					index = entries[i].index;

					toolTipContent = "";

					if (i === 0 && isToolTipDefinedInData && !this.content) {
						toolTipContent += typeof (this.chart.axisX.labels[dataPoint.x]) !== "undefined" ? this.chart.axisX.labels[dataPoint.x] : "{x}";
						toolTipContent += "</br>";
					}

					if (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline" || dataSeries.type === "area" || dataSeries.type === "splineArea" || dataSeries.type === "column" || dataSeries.type === "bar" || dataSeries.type === "scatter"
					|| dataSeries.type === "stackedColumn" || dataSeries.type === "stackedColumn100" || dataSeries.type === "stackedBar" || dataSeries.type === "stackedBar100"
					|| dataSeries.type === "stackedArea" || dataSeries.type === "stackedArea100") {
						toolTipContent += dataPoint.toolTipContent ? dataPoint.toolTipContent : dataSeries.toolTipContent ? dataSeries.toolTipContent : this.content && typeof (this.content) !== "function" ? this.content : "<span style='\"'color:{color};'\"'>{name}:</span>&nbsp;&nbsp;{y}";
					} else if (dataSeries.type === "bubble") {
						toolTipContent += dataPoint.toolTipContent ? dataPoint.toolTipContent : dataSeries.toolTipContent ? dataSeries.toolTipContent : this.content && typeof (this.content) !== "function" ? this.content : "<span style='\"'color:{color};'\"'>{name}:</span>&nbsp;&nbsp;{y}, &nbsp;&nbsp;{z}";
					} else if (dataSeries.type === "pie" || dataSeries.type === "doughnut") {
						toolTipContent += dataPoint.toolTipContent ? dataPoint.toolTipContent : dataSeries.toolTipContent ? dataSeries.toolTipContent : this.content && typeof (this.content) !== "function" ? this.content : "&nbsp;&nbsp;{y}";
					}

					toolTipInnerHtml += this.chart.replaceKeywordsWithValue(toolTipContent, dataPoint, dataSeries, index);

					if (i < entries.length - 1)
						toolTipInnerHtml += "</br>";
				}
			} else {

				dataSeries = entries[0].dataSeries;
				dataPoint = entries[0].dataPoint;
				index = entries[0].index;

				//color = dataPoint.color ? dataPoint.color : dataSeries.color ? dataSeries.color : dataSeries._colorSet[index % dataSeries._colorSet.length];

				if (dataSeries.type === "line" || dataSeries.type === "stepLine" || dataSeries.type === "spline" || dataSeries.type === "area" || dataSeries.type === "splineArea" || dataSeries.type === "column" || dataSeries.type === "bar" || dataSeries.type === "scatter"
					|| dataSeries.type === "stackedColumn" || dataSeries.type === "stackedColumn100" || dataSeries.type === "stackedBar" || dataSeries.type === "stackedBar100"
					|| dataSeries.type === "stackedArea" || dataSeries.type === "stackedArea100") {
					toolTipContent = dataPoint.toolTipContent ? dataPoint.toolTipContent : dataSeries.toolTipContent ? dataSeries.toolTipContent : this.content && typeof (this.content) !== "function" ? this.content : "<span style='\"'color:{color};'\"'>" + (dataPoint.label ? "{label}" : "{x}") + " :</span>&nbsp;&nbsp;{y}";
				} else if (dataSeries.type === "bubble") {
					toolTipContent = dataPoint.toolTipContent ? dataPoint.toolTipContent : dataSeries.toolTipContent ? dataSeries.toolTipContent : this.content && typeof (this.content) !== "function" ? this.content : "<span style='\"'color:{color};'\"'>" + (dataPoint.label ? "{label}" : "{x}") + ":</span>&nbsp;&nbsp;{y}, &nbsp;&nbsp;{z}";
				} else if (dataSeries.type === "pie" || dataSeries.type === "doughnut") {
					toolTipContent = dataPoint.toolTipContent ? dataPoint.toolTipContent : dataSeries.toolTipContent ? dataSeries.toolTipContent : this.content && typeof (this.content) !== "function" ? this.content : (dataPoint.name ? "{name}:&nbsp;&nbsp;" : dataPoint.label ? "{label}:&nbsp;&nbsp;" : "") + "{y}";
				}

				toolTipInnerHtml += this.chart.replaceKeywordsWithValue(toolTipContent, dataPoint, dataSeries, index);
			}
		}

		return toolTipInnerHtml;
	}

	ToolTip.prototype.enableAnimation = function () {
		if (this.container.style.WebkitTransition)
			return;

		//this.container.style.WebkitTransition = "right .2s ease-out, bottom .2s ease-out";
		//this.container.style.MozTransition = "right .2s ease-out, bottom .2s ease-out";
		//this.container.style.MsTransition = "right .2s ease-out, bottom .2s ease-out";
		//this.container.style.transition = "right .2s ease-out, bottom .2s ease-out";
		this.container.style.WebkitTransition = "left .2s ease-out, bottom .2s ease-out";
		this.container.style.MozTransition = "left .2s ease-out, bottom .2s ease-out";
		this.container.style.MsTransition = "left .2s ease-out, bottom .2s ease-out";
		this.container.style.transition = "left .2s ease-out, bottom .2s ease-out";
	}

	ToolTip.prototype.disableAnimation = function () {
		if (!this.container.style.WebkitTransition)
			return;

		this.container.style.WebkitTransition = "";
		this.container.style.MozTransition = "";
		this.container.style.MsTransition = "";
		this.container.style.transition = "";
	}

	ToolTip.prototype.hide = function () {
		if (!this.enabled)
			return;

		this.container.style.display = "none";
		this.currentSeriesIndex = -1;
		this._prevX = NaN;
		this._prevY = NaN;
		//this.chart.overlaidCanvasCtx.clearRect(0, 0, this.chart.overlaidCanvas.width, this.chart.overlaidCanvas.height);
		this.chart.resetOverlayedCanvas();
	}

	Chart.prototype.replaceKeywordsWithValue = function (str, dp, ds, index) {
		var regex = /\{\s*[a-zA-Z]+\s*\}|"[^"]*"|'[^']*'/g;
		var chart = this;

		var fcn = function ($0) {
			if (($0[0] === "\"" && $0[$0.length - 1] === "\"") || ($0[0] === "\'" && $0[$0.length - 1] === "\'"))
				return $0.slice(1, $0.length - 1);

			var key = trimString($0.slice(1, $0.length - 1));
			var obj = null;

			if (key === "color") {
				return dp.color ? dp.color : ds.color ? ds.color : ds._colorSet[index % ds._colorSet.length];
			}

			if (dp.hasOwnProperty(key))
				obj = dp;
			else if (ds.hasOwnProperty(key))
				obj = ds;
			else return "";

			if (key === "x") {
				if (chart.axisX && chart.plotInfo.axisXValueType === "dateTime")
					return dateFormat(obj[key], dp.xValueFormatString ? dp.xValueFormatString : ds.xValueFormatString ? ds.xValueFormatString : chart.axisX && chart.axisX.valueFormatString ? chart.axisX.valueFormatString : "DD MMM YY", chart._cultureInfo);
				else
					return numberFormat(obj[key], dp.xValueFormatString ? dp.xValueFormatString : ds.xValueFormatString ? ds.xValueFormatString : "#,##0.########", chart._cultureInfo);
			} else if (key === "y")
				return numberFormat(obj[key], dp.yValueFormatString ? dp.yValueFormatString : ds.yValueFormatString ? ds.yValueFormatString : "#,##0.########", chart._cultureInfo);
			else
				return obj[key];
		}

		return str.replace(regex, fcn);
	}


	//#endregion ToolTip

	//#region Event Manager

	function EventManager(chart) {
		this.chart = chart;
		this.lastObjectId = 0;
		var that = this;
		this.objectMap = [];
		this.rectangularRegionEventSubscriptions = [];
		this.previousDataPointEventObject = null;
		//this.previousDataSeriesEventObject = null;

		this.ghostCanvas = createCanvas(this.chart.width, this.chart.height);
		//this.ghostCanvas.width = this.chart.width;
		//this.ghostCanvas.height = this.chart.height;

		this.ghostCtx = this.ghostCanvas.getContext("2d");

		var eventHandler = function (ev) {
			that.mouseEventHandler.call(that, ev);
		};

		//this.chart.canvas.addEventListener("mouseover", eventHandler);
		//this.chart.canvas.addEventListener("mousemove", eventHandler);
		//this.chart.canvas.addEventListener("mouseout", eventHandler);
		//this.chart.canvas.addEventListener("click", eventHandler);
	}

	EventManager.prototype.reset = function () {
		this.lastObjectId = 0;
		this.objectMap = [];
		this.rectangularRegionEventSubscriptions = [];
		this.previousDataPointEventObject = null;

		//this.ghostCanvas.width = this.chart.width;
		//this.ghostCanvas.height = this.chart.height;

		if (isCanvasSupported) {
			this.ghostCtx.clearRect(0, 0, this.chart.width, this.chart.height);
			this.ghostCtx.beginPath();
		}
	}

	EventManager.prototype.getNewObjectTrackingId = function () {
		return ++this.lastObjectId;
	}

	EventManager.prototype.mouseEventHandler = function (ev) {

		//return;

		if (ev.type !== "mousemove" && ev.type !== "click")
			return;

		var eventObject = null;
		var dataSeries = null;
		var dataPoint = null;
		var dataPointIndex = -1;
		var mouseOutPreviousDataPoint = false;
		var mouseOutPreviousDataSeries = false;
		var xy = getMouseCoordinates(ev);
		var id = null;

		//console.log(ev.type);

		//var imageData = this.ghostCtx.getImageData(xy.x, xy.y, 1, 1);
		//var pix = imageData.data;
		var dataPointInfo = null;

		dataPointInfo = this.chart.getDataPointAtXY(xy.x, xy.y, false);

		if (dataPointInfo) {
			id = dataPointInfo.dataSeries.dataPointIds[dataPointInfo.dataPointIndex];
		}
		else if (isCanvasSupported) {//IE9+
			id = getObjectId(xy.x, xy.y, this.ghostCtx);
		}

		var plotArea = this.chart.plotArea;

		//Enter only if mouse is inside plotArea. Else file mouseout event for previous dataPoints
		if (id && (xy.x > plotArea.x1 && xy.x < plotArea.x2 && xy.y > plotArea.y1 && xy.y < plotArea.y2)) {//DataPoint/DataSeries event
			//var id = RGBToInt(pix[0], pix[1], pix[2]);

			if (typeof this.objectMap[id] !== "undefined" && (this.objectMap[id].objectType === "dataPoint")) {
				eventObject = this.objectMap[id];
				dataSeries = this.chart.data[eventObject.dataSeriesIndex];
				dataPoint = dataSeries.dataPoints[eventObject.dataPointIndex];
				dataPointIndex = eventObject.dataPointIndex;

				//var logString = xy.x.toString() + ", " + xy.y.toString() + " RGB:" + pix[0].toString() + ", " + pix[1].toString() + ", " + pix[2].toString() + ", " + pix[3].toString()
				//    + " hex: " + intToHexColorString(id) + " dataPoint: [" + dataPoint.x.toString() + ", " + dataPoint.y.toString() + ", " + dataPoint.hexColor + "]";

				//if (this.previousDataPointEventObject) {
				//    logString += "  ds: " + this.previousDataPointEventObject.dataSeriesIndex + " dp: " + this.previousDataPointEventObject.dataPointIndex;
				//}
				//console.log(logString);

				if (this.previousDataPointEventObject === null
					|| this.previousDataPointEventObject.dataSeriesIndex !== eventObject.dataSeriesIndex
					|| this.previousDataPointEventObject.dataPointIndex !== eventObject.dataPointIndex) {

					if (this.previousDataPointEventObject) {
						mouseOutPreviousDataPoint = true;
					}

					if (dataPoint.mouseover) {

						dataPoint.mouseover.call(dataPoint, { x: xy.x, y: xy.y, dataPoint: dataPoint, dataSeries: dataSeries, dataPointIndex: dataPointIndex });
					}

					if (dataSeries.mouseover && (this.previousDataPointEventObject === null || this.previousDataPointEventObject.dataSeriesIndex !== eventObject.dataSeriesIndex)) {

						if (dataSeries.mouseover)
							dataSeries.mouseover.call(dataSeries, { x: xy.x, y: xy.y, dataPoint: dataPoint, dataSeries: dataSeries, dataPointIndex: dataPointIndex });

						if (this.previousDataPointEventObject)
							mouseOutPreviousDataSeries = true;
					}
				}


				if (ev.type === "mousemove") {
					if (dataPoint.cursor && dataPoint.cursor !== ev.target.style.cursor) {
						ev.target.style.cursor = dataPoint.cursor;
					} else if (dataSeries.cursor && dataSeries.cursor !== ev.target.style.cursor) {
						ev.target.style.cursor = dataSeries.cursor;
					}

					if (dataPoint.mousemove)
						dataPoint.mousemove.call(dataPoint, { x: xy.x, y: xy.y, dataPoint: dataPoint, dataSeries: dataSeries, dataPointIndex: dataPointIndex });

					if (dataSeries.mousemove)
						dataSeries.mousemove.call(dataSeries, { x: xy.x, y: xy.y, dataPoint: dataPoint, dataSeries: dataSeries, dataPointIndex: dataPointIndex });

				} else if (ev.type === "click") {

					var distanceTravelled = Math.sqrt(Math.pow(this.chart.dragStartPoint.x - xy.x, 2) + Math.pow(this.chart.dragStartPoint.y - xy.y, 2));
					if (distanceTravelled < 5) {

						if (dataPoint.click)
							dataPoint.click.call(dataPoint, { x: xy.x, y: xy.y, dataPoint: dataPoint, dataSeries: dataSeries, dataPointIndex: dataPointIndex });

						if (dataSeries.click)
							dataSeries.click.call(dataSeries, { x: xy.x, y: xy.y, dataPoint: dataPoint, dataSeries: dataSeries, dataPointIndex: dataPointIndex });

						if (this.chart.pieDoughnutClickHandler) {
							this.chart.pieDoughnutClickHandler.call(dataSeries, { x: xy.x, y: xy.y, dataPoint: dataPoint, dataSeries: dataSeries, dataPointIndex: dataPointIndex });
						}
					}

				}

			} else if (this.previousDataPointEventObject) {
				mouseOutPreviousDataPoint = true;
				mouseOutPreviousDataSeries = true;
			}
		} else if (this.previousDataPointEventObject) {
			mouseOutPreviousDataPoint = true;
			mouseOutPreviousDataSeries = true;
		}


		if (mouseOutPreviousDataPoint || mouseOutPreviousDataSeries) {

			ev.target.style.cursor = this.chart._defaultCursor;

			var previousDataSeries = this.chart.data[this.previousDataPointEventObject.dataSeriesIndex];
			var previousDataPoint = previousDataSeries.dataPoints[this.previousDataPointEventObject.dataPointIndex];
			var previousDataPointIndex = this.previousDataPointEventObject.dataPointIndex;

			if (mouseOutPreviousDataPoint && previousDataPoint.mouseout)
				previousDataPoint.mouseout.call(previousDataPoint, { x: xy.x, y: xy.y, dataPoint: previousDataPoint, dataSeries: previousDataSeries, dataPointIndex: previousDataPointIndex });

			if (mouseOutPreviousDataSeries && previousDataSeries.mouseout)
				previousDataSeries.mouseout.call(previousDataSeries, { x: xy.x, y: xy.y, dataPoint: previousDataPoint, dataSeries: previousDataSeries, dataPointIndex: previousDataPointIndex });
		}

		this.previousDataPointEventObject = eventObject;
	}


	//#endregion Event Manager

	//#region Class CultureInfo

	function CultureInfo(chart, culture) {

		var cultureInfo;

		if (culture && cultures[culture])
			cultureInfo = cultures[culture];


		Title.parent.constructor.call(this, "CultureInfo", cultureInfo, chart.theme);

		this.chart = chart;
		this.canvas = chart.canvas;
		this.ctx = this.chart.ctx;
	}

	extend(CultureInfo, CanvasJSObject);

	//#endregion Class CultureInfo

	//#region Render Helper

	var RenderHelper = {
		drawMarker: function (x, y, ctx, markerType, markerSize, markerColor, markerBorderColor, markerBorderThickness) {

			if (!ctx)
				return;

			var alpha = 1;

			ctx.fillStyle = markerColor ? markerColor : "#000000";
			ctx.strokeStyle = markerBorderColor ? markerBorderColor : "#000000";
			ctx.lineWidth = markerBorderThickness ? markerBorderThickness : 0;


			if (markerType === "circle") {

				ctx.moveTo(x, y);
				ctx.beginPath();
				//return;

				ctx.arc(x, y, markerSize / 2, 0, Math.PI * 2, false);

				if (markerColor)
					ctx.fill();

				if (markerBorderThickness) {

					if (!markerBorderColor) {
						alpha = ctx.globalAlpha;
						ctx.globalAlpha = .15;
						ctx.strokeStyle = "black";
						ctx.stroke();
						ctx.globalAlpha = alpha;
					} else
						ctx.stroke();

				}
			}
			else if (markerType === "square") {

				//ctx.moveTo(x - markerSize / 2, y - markerSize / 2);
				ctx.beginPath();
				ctx.rect(x - markerSize / 2, y - markerSize / 2, markerSize, markerSize);

				if (markerColor)
					ctx.fill();

				if (markerBorderThickness) {

					if (!markerBorderColor) {
						alpha = ctx.globalAlpha;
						ctx.globalAlpha = .15;
						ctx.strokeStyle = "black";
						ctx.stroke();
						ctx.globalAlpha = alpha;
					} else
						ctx.stroke();

				}
			} else if (markerType === "triangle") {

				ctx.beginPath();
				ctx.moveTo(x - markerSize / 2, y + markerSize / 2);
				ctx.lineTo(x + markerSize / 2, y + markerSize / 2);
				ctx.lineTo(x, y - markerSize / 2);
				ctx.closePath();

				if (markerColor)
					ctx.fill();

				if (markerBorderThickness) {

					if (!markerBorderColor) {
						alpha = ctx.globalAlpha;
						ctx.globalAlpha = .15;
						ctx.strokeStyle = "black";
						ctx.stroke();
						ctx.globalAlpha = alpha;
					} else
						ctx.stroke();

				}
				ctx.beginPath();
			} else if (markerType === "cross") {

				ctx.strokeStyle = markerColor;
				markerBorderThickness = markerSize / 4;
				ctx.lineWidth = markerBorderThickness;

				ctx.beginPath();
				ctx.moveTo(x - markerSize / 2, y - markerSize / 2);
				ctx.lineTo(x + markerSize / 2, y + markerSize / 2);
				ctx.stroke();

				ctx.moveTo(x + markerSize / 2, y - markerSize / 2);
				ctx.lineTo(x - markerSize / 2, y + markerSize / 2);
				ctx.stroke();

			}


		},
		drawMarkers: function (markers) {
			for (var i = 0; i < markers.length; i++) {
				var marker = markers[i];

				RenderHelper.drawMarker(marker.x, marker.y, marker.ctx, marker.type, marker.size, marker.color, marker.borderColor, marker.borderThickness);
			}
		}
	}

	//#endregion Render Helper

	//#endregion Class Definitions

	//#region Public API
	var CanvasJS = {

		Chart: function (containerId, options) {
			var _chart = new Chart(containerId, options, this);

			this.render = function () { _chart.render() };
			this.options = _chart._options;
		},
		addColorSet: function (name, colorSet) {
			colorSets[name] = colorSet;
		},
		addCultureInfo: function (name, cultureInfo) {
			cultures[name] = cultureInfo;
		}
	}

	CanvasJS.Chart.version = "1.3.0 Beta 3";
	window.CanvasJS = CanvasJS;
	//#endregion Public API

})();
window.onload = function () {
  var chart1 = new CanvasJS.Chart("chartContainer", {
      theme: "theme2",//theme1
      title:{
          text: "Basic Column Chart - CanvasJS"              
     },
      data: [              
      {
        type: "column",
        dataPoints: [
        { label: "apple", y: 10 },
        { label: "orange", y: 15 },
        { label: "banana", y: 25 },
        { label: "mango", y: 30 },
        { label: "grape", y: 28 }
        ]
      }
      ]
  });
  chart1.render();
  };

  

var disqus_shortname = 'ateenentrepreneur';
  (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();
window.onload = function () {
  var chart = new CanvasJS.Chart("testing", {
    theme: "theme3",
    title:{
      text: "Poll of Polls - Coalition Wins",
      fontFamily: "Armata",      
      fontColor: "#730D45"       
   },
    data: [              
    {
      type: "doughnut",
      indexLabelFontFamily: "Armata",
      indexLabelLineColor: "#E13E06",
      indexLabelFontColor: "#FA1451",
      indexLabelFontSize: 16,
      dataPoints: [
      { label: "COAL", y: 54.1 },
      { label: "ALP", y: 45.9 }
      ]
    }
    ]
  });
  chart.render();

  var chart = new CanvasJS.Chart("test", {
    theme: "theme1",
    title:{
      text: "Latest Odds",
      fontFamily: "Armata",      
      fontColor: "#730D45"                
    },
    data: [              
    {
    type: "pie",
    indexLabelFontFamily: "Armata",
    indexLabelLineColor: "#E13E06",
    indexLabelFontColor: "#FA1451",
    indexLabelFontSize: 16,
    dataPoints: [
    { label: "COAL", y: 92 },
    { label: "ALP", y: 53 },
    { label: "Andrew Wilkie", y: 1 },
    { label: "KAP", y: 1 }
    ]
    }
    ]
  });
  chart.render();
};
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//









;
