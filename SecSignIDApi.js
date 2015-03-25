// $Id: SecSignIDApi.js,v 1.23 2015/03/25 15:33:49 titus Exp $


/*!
 * (c) 2014 SecSign Technologies Inc.
 */
 

/**
 * Javascript class to connect to a secsign id server. The class will check secsign id server certificate and request for an authentication session for a given
 * user id which is called secsign id. 
 * Each authentication session generation needs a new instance of this class.
 *
 * @version $Id: SecSignIDApi.js,v 1.23 2015/03/25 15:33:49 titus Exp $
 * @author SecSign Technologies Inc.
 */
function SecSignIDApi(options)
{
	// merge given properties into myself
	var defaultsettings = {
		async : true,
		posturl : "/",
		referer : 'SecSignIDApi_JS',
		pluginname : 'SecSignIDApi_JS'
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
SecSignIDApi.prototype.requestAuthSession = function(secsignid, servicename, serviceadress, timezone, callbackFunction) {
	if(secsignid == null || secsignid === ""){
		throw "SecSign ID is null.";
	}
	if(servicename == null || servicename === ""){
	   throw "Servicename is null.";
	}

	var requestParameter = {
		'request' : 'ReqRequestAuthSession',
		'secsignid' : secsignid,
		'servicename' : servicename,
		'serviceaddress' : serviceadress
	};
	
	if(this.pluginname){
		requestParameter['pluginname'] = this.pluginname;
	}
	
	if(timezone){
		requestParameter['timezone'] = timezone;
	}
	return this.sendRequest(requestParameter, callbackFunction);
};


//
// Gets the authentication session state for a certain secsign id whether the authentication session is still pending or it was accepted or denied.
//
SecSignIDApi.prototype.getAuthSessionState = function(secsignid, requestId, authsessionId, callbackFunction) {
			var requestParameter = {
				'request' : 'ReqGetAuthSessionState',
				'secsignid' : secsignid,
				'authsessionid' : authsessionId,
				'requestid' : requestId
			};
			return this.sendRequest(requestParameter, callbackFunction);
};


//
// Cancel the given auth session.
//
SecSignIDApi.prototype.cancelAuthSession = function(secsignid, requestId, authsessionId, callbackFunction) {
	var requestParameter = {
		'request' : 'ReqCancelAuthSession',
		'secsignid' : secsignid,
		'authsessionid' : authsessionId,
		'requestid' : requestId
	};
	return this.sendRequest(requestParameter, callbackFunction);
};


//
// Releases an authentication session if it was accepted and not used any longer 
//
SecSignIDApi.prototype.releaseAuthSession = function(secsignid, requestId, authsessionId, callbackFunction) {
	var requestParameter = {
		'request' : 'ReqReleaseAuthSession',
		'secsignid' : secsignid,
		'authsessionid' : authsessionId,
		'requestid' : requestId
	};
	return this.sendRequest(requestParameter, callbackFunction);
};


//
// sends the request itself to id server
//
SecSignIDApi.prototype.sendRequest = function(params, callbackFunction){
	if(!params){
		throw "Parameter array is undefined or empty";
	}
	
	// merge default parameter which are send at every request
	_merge(params, {
		"apimethod" : this.referer
	});
	
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


/**
 * Javascript class to encapsulate an object with data about an authentication session
 *
 * @version $Id: SecSignIDApi.js,v 1.23 2015/03/25 15:33:49 titus Exp $
 * @author SecSign Technologies Inc.
 */
function AuthSession(){
	//
	// No State: Used when the session state is undefined. 
	//
	var NOSTATE = 0;

	//
	// Pending: The session is still pending for authentication.
	//
	var PENDING = 1;

	//
	// Expired: The authentication timeout has been exceeded.
	//
	var EXPIRED = 2;

	//
	// Authenticated: The user was successfully authenticated.
	//
	var AUTHENTICATED = 3;

	//
	// Denied: The user denied this session.
	//
	var DENIED = 4;

	//
	// Suspended: The server suspended this session, because another authentication request was received while this session was still pending.
	//
	var SUSPENDED = 5;

	//
	// Canceled: The service has canceled this session.
	//
	var CANCELED = 6;

	//
	// Fetched: The device has already fetched the session, but the session hasn't been authenticated or denied yet.
	//
	var FETCHED = 7;

	//
	// Invalid: This session has become invalid.
	//
	var INVALID = 8;

}


// override toString method
AuthSession.prototype.toString = function(){
	return "AuthSession";
}

    
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
var merge = function(obj1, obj2, clone){
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
var _merge = function(obj1, obj2){
	for(var key in obj2){
		if(obj2.hasOwnProperty(key)){
			obj1[key] = obj2[key]; 
		}
	}
	return obj1;
}