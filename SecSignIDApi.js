/*!
 * (c) 2014, 2015, 2016 SecSign Technologies Inc.
 */
 

/**
 * Javascript class to connect to a secsign id server. 
 * The class will check secsign id server certificate and 
 * request for an authentication session for a given user id which is called secsign id. 
 * Each authentication session generation needs a new instance of this class.
 *
 * @author SecSign Technologies Inc.
 */
function SecSignIDApi(options)
{
	// merge given properties into myself
	var defaultsettings = {
		async : true,
		posturl : "/",
		referer : 'SecSignIDApi_JS',
		pluginname : 'SecSignIDApi_JS',
		version : "1.34",
		optionalparams : null
	};
	
	_merge(this, merge(defaultsettings, options, true));
}


//
//
// prototypes
//
//


//
// Send query to secsign id server to create an authentication session for a certain secsign id.
//
SecSignIDApi.prototype.requestAuthSession = function(options) {
	
	if(!options){
		throw new Error("No options given to request authentication session.");
	}
	
	/*
	options = {
		secsignid : "titus",
		servicename : "SecSign Portal",
		serviceaddress : "https://portal.secsign.com",
		callbackFunction : function(){
			...
		}
	}
	*/
	
	if(!options.secsignid){
		throw new Error("SecSign ID is null.");
	}
	if(!options.servicename){
	   throw new Error("Servicename is null.");
	}
	if(!options.serviceaddress){
	   throw new Error("Serviceaddress is null.");
	}
	
	// ensure that the secsign id is lower case
	secsignid = options.secsignid.toLowerCase().trim();
	
	// check again. probably just spacess which will ne empty after trim()
	if(!options.secsignid){
		throw new Error("SecSign ID is null.");
	}
	
	// ensure that service name is not to long...
	if(options.servicename.length > 255){
		options.servicename = options.servicename.substr(0, 255);
	}
	
	// ensure that service address is not to long...
	// e.g. http://localhost/secsign/newjoomlaupdates/administrator/index.php?option=com_config&view=component&component=com_secsignid&path=&return=aHR0cDovL2xvY2FsaG9zdC9zZWNzaWduL25ld2pvb21sYXVwZGF0ZXMvYWRtaW5pc3RyYXRvci9pbmRleC5waHA%2Fb3B0aW9uPWNvbV9zZWNzaWduaWQ%3D
	if(options.serviceaddress.length > 255){
		options.serviceaddress = options.serviceaddress.substr(0, 255);
	}

	var requestParameter = {
		'request' : 'ReqRequestAuthSession',
		'secsignid' : options.secsignid,
		'servicename' : options.servicename,
		'serviceaddress' : options.serviceaddress
	};
	
	if(options.showaccesspass != undefined){
		requestParameter['showaccesspass'] = options.showaccesspass === true ? "true" : "false";
	}
	
	if(this.pluginname){
		requestParameter['pluginname'] = this.pluginname;
	}
	
	return this.sendRequest(requestParameter, options.callbackFunction);
};


//
// Gets the authentication session state for a certain secsign id whether the authentication session is still pending or it was accepted or denied.
//
SecSignIDApi.prototype.getAuthSessionState = function(options) {
	
	if(!options){
		throw new Error("No options given to get authentication session state.");
	}
	
	/*
	options = {
		secsignid : "titus",
		requestid : "98723408097328623947235",
		authsessionid : "-872346324",
		callbackFunction : function(){
			...
		}
	}
	*/
	
	var requestParameter = {
		'request' : 'ReqGetAuthSessionState',
		'secsignid' : options.secsignid.toLowerCase(), // ensure that the secsign id is lower case
		'authsessionid' : options.authsessionid,
		'requestid' : options.requestid
	};
	return this.sendRequest(requestParameter, options.callbackFunction);
};


//
// Cancel the given auth session.
//
SecSignIDApi.prototype.cancelAuthSession = function(options) {

	if(!options){
		throw new Error("No options given to cancel authentication session.");
	}
	
	/*
	options = {
		secsignid : "titus",
		requestid : "98723408097328623947235",
		authsessionid : "-872346324",
		callbackFunction : function(){
			...
		}
	}
	*/

	var requestParameter = {
		'request' : 'ReqCancelAuthSession',
		'secsignid' : options.secsignid.toLowerCase(), // ensure that the secsign id is lower case
		'authsessionid' : options.authsessionid,
		'requestid' : options.requestid
	};
	return this.sendRequest(requestParameter, options.callbackFunction);
};


//
// Releases an authentication session if it was accepted and not used any longer 
//
SecSignIDApi.prototype.releaseAuthSession = function(options) {
	
	if(!options){
		throw new Error("No options given to release authentication session.");
	}
	
	/*
	options = {
		secsignid : "titus",
		requestid : "98723408097328623947235",
		authsessionid : "-872346324",
		callbackFunction : function(){
			...
		}
	}
	*/

	var requestParameter = {
		'request' : 'ReqReleaseAuthSession',
		'secsignid' : options.secsignid.toLowerCase(), // ensure that the secsign id is lower case
		'authsessionid' : options.authsessionid,
		'requestid' : options.requestid
	};
	return this.sendRequest(requestParameter, options.callbackFunction);
};


//
// sends the request itself to id server
//
SecSignIDApi.prototype.sendRequest = function(params, callbackFunction){
	if(!params){
		//throw "Parameter array is undefined or empty";
		params = {};
	}
	
	// merge default parameter which are send at every request
	_merge(params, {
		"apimethod" : this.referer
	});
	
	// merge optional params
	if(this.optionalparams && typeof(this.optionalparams) === "object"){
		_merge(params, this.optionalparams);
	}
	
	var paramStr = "";
	for (var key in params) {
		if(key && params.hasOwnProperty(key)){
			paramStr += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
		}
	}

	// send request
	var instance = this;
	var request = jQuery.ajax({
		type    : "POST",
		url     : this.posturl,
		data    : paramStr,
		async   : this.async
	});

	// add functions which are called when request is done or if it failed
	request.done(function(response, textStatus, jqXHR){
		if(callbackFunction){
			callbackFunction(instance.createResponseMap(response));
		}
	});
	
	request.fail(function(response, textStatus, jqXHR){
		if(typeof globalErrorFunc !== 'undefined'){
			globalErrorFunc(response, textStatus);
		}
		if(callbackFunction){
			callbackFunction(response);
		}
	});
	
	return this;
};

//
// converts url encoded string into an associated array
//
SecSignIDApi.prototype.createResponseMap = function(response){
	/*var regex = new RegExp("&", "g");
	var uriDecoding = false;

	var map = {};
	var parts = response.split(regex);
	for(var i = 0; i < parts.length; i++){
		var keyValuePair = parts[i];
		var idx = keyValuePair.indexOf("=");
		if(idx > -1){
			var key = keyValuePair.substring(0, idx).trim();
			var value = keyValuePair.substring(idx+1).trim();
			
			if(key){
				if(uriDecoding == true){
					map[key] = decodeURIComponent(value);
				} else {
					map[key] = value;
				}
			}
		}
	}*/
	
	var map = {};
	var parts = response.split(/&/g);
    for(var i = 0; i < parts.length; i++){
        var idx = parts[i].indexOf("=");
        if(idx > -1){
            var key = parts[i].substring(0, idx).trim();
            if(key && key.length){
				map[key] = parts[i].substring(idx+1).trim();
			}
        }
    }
                
	return map;
};

//
// several check methods
//

//
// Checks whether a secsign id meets some requirements
//
SecSignIDApi.prototype.checkSecSignId = function(secSignIdString){
	// illegal characters are e.g. #+*?!%$&(){}[]:
	// allowed besides letter characters and numbers are only @ _ - .
	var secSignIdCheckResult = /^[\w@_\-\.]*$/.test(secSignIdString);
	
	return secSignIdCheckResult;
};



/**
 * Javascript class to encapsulate an object with data about an authentication session
 *
 * @author SecSign Technologies Inc.
 */
function AuthSession(){
}

// override toString method
AuthSession.prototype.toString = function(){
	return "AuthSession";
}

//
// No State: Used when the session state is undefined. 
//
AuthSession.NOSTATE = 0;

//
// Pending: The session is still pending for authentication.
//
AuthSession.PENDING = 1;

//
// Expired: The authentication timeout has been exceeded.
//
AuthSession.EXPIRED = 2;

//
// Authenticated: The user was successfully authenticated.
//
AuthSession.AUTHENTICATED = 3;

//
// Denied: The user denied this session.
//
AuthSession.DENIED = 4;

//
// Suspended: The server suspended this session, because another authentication request was received while this session was still pending.
//
AuthSession.SUSPENDED = 5;

//
// Canceled: The service has canceled this session.
//
AuthSession.CANCELED = 6;

//
// Fetched: The device has already fetched the session, but the session hasn't been authenticated or denied yet.
//
AuthSession.FETCHED = 7;

//
// Invalid: This session has become invalid.
//
AuthSession.INVALID = 8;

    
// @deprecated: trim() exists as normal function in javascript String object
// @see		  : http://www.w3schools.com/jsref/jsref_trim_string.asp
/*String.prototype.trim = function()
{
    var stringtotrim = this;
    return stringtotrim.replace(/^\s*([\S\s]*?)\s*$/, '$1');
}*/

//
// merges the objects together. if clone is true a new object is created
//
function merge(obj1, obj2, clone){
	if(clone === true){
		var newobj = _merge({}, obj1);
		return _merge(newobj, obj2);
	} else {
		return _merge(obj1, obj2);
	}
}

//
// merges the objects together. if clone is true a new object is created
//
function _merge(obj1, obj2){
	for(var key in obj2){
		if(obj2.hasOwnProperty(key)){
			obj1[key] = obj2[key]; 
		}
	}
	return obj1;
}