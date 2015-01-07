// $Id: SecSignIDApi.js,v 1.20 2015/01/06 17:19:56 titus Exp $


/*!
 * (c) 2014 SecSign Technologies Inc.
 */
 
function AuthSession()
{
    // override toString method
    AuthSession.prototype.toString = function(){
        return "AuthSession";
    }
}

String.prototype.trim = function()
{
    var stringtotrim = this;
    return stringtotrim.replace(/^\s*([\S\s]*?)\s*$/, '$1');
}


/**
 * Javascript class to connect to a secsign id server. The class will check secsign id server certificate and request for an authentication session for a given
 * user id which is called secsign id. 
 * Each authentication session generation needs a new instance of this class.
 *
 * @version $Id: SecSignIDApi.js,v 1.20 2015/01/06 17:19:56 titus Exp $
 * @author SecSign Technologies Inc.
 */
function SecSignIDApi(options)
{
    var asynchronous = true;
    var posturl = "/";
    
    // public members
    this.referer = 'SecSignIDApi_JS';
    this.pluginName = undefined;
    
    if(options){
        if("async" in options){
            asynchronous = options["async"];
        }
    	if("posturl" in options){
            posturl = options["posturl"];
        }
        if("pluginname" in options){
            this.pluginName = options["pluginname"];
        }
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

            var requestParameter = new Array();
            requestParameter['apimethod'] = this.referer;
            requestParameter['request'] = 'ReqRequestAuthSession';
            requestParameter['secsignid'] = secsignid;
            requestParameter['servicename'] = servicename;
            requestParameter['serviceaddress'] = serviceadress;
            
            if(this.pluginName){
                requestParameter['pluginname'] = this.pluginName;
            }
            
            if(timezone){
                requestParameter['timezone'] = timezone;
            }
            
            sendRequest(requestParameter, callbackFunction);
            
            return this;
    };
        
    //
    // Gets the authentication session state for a certain secsign id whether the authentication session is still pending or it was accepted or denied.
	//
    SecSignIDApi.prototype.getAuthSessionState = function(secsignid, requestId, authsessionId, callbackFunction) {
            var requestParameter = new Array();
            requestParameter['apimethod'] = this.referer;
            requestParameter['request'] = 'ReqGetAuthSessionState';
            requestParameter['secsignid'] = secsignid;
            requestParameter['authsessionid'] = authsessionId;
            requestParameter['requestid'] = requestId;

            sendRequest(requestParameter, callbackFunction);
            
            return this;
    };

	//
	// Cancel the given auth session.
	//
    SecSignIDApi.prototype.cancelAuthSession = function(secsignid, requestId, authsessionId, callbackFunction) {
            var requestParameter = new Array();
            requestParameter['apimethod'] = this.referer;
            requestParameter['request'] = 'ReqCancelAuthSession';
            requestParameter['secsignid'] = secsignid;
            requestParameter['authsessionid'] = authsessionId;
            requestParameter['requestid'] = requestId;
            
            sendRequest(requestParameter, callbackFunction);
            
            return this;
    };
        
    //
    // Releases an authentication session if it was accepted and not used any longer 
    //
    SecSignIDApi.prototype.releaseAuthSession = function(secsignid, requestId, authsessionId, callbackFunction) {
            var requestParameter = new Array();
            requestParameter['apimethod'] = this.referer;
            
            requestParameter['request'] = 'ReqReleaseAuthSession';
            requestParameter['secsignid'] = secsignid;
            requestParameter['authsessionid'] = authsessionId;
            requestParameter['requestid'] = requestId;
        
            sendRequest(requestParameter, callbackFunction);
            
            return this;
    };

	//
	// sends the request itself to id server
	//
    var sendRequest = this.sendRequest = function(parameterArray, callbackFunction)
    {
        if(parameterArray == null || !(parameterArray instanceof Array)){
            throw "Parameter array is not an instance of Array";
        }
        parameterArray['secsignid'] = encodeURIComponent(parameterArray['secsignid']);
        
        var paramStr = "";
        for (var key in parameterArray) {
            if(key && parameterArray.hasOwnProperty(key)){
                paramStr = paramStr + key + "=" + parameterArray[key] + "&";
            }
        }

        // send request
        var request = jQuery.ajax({
            type    : "POST",
            url     : posturl,
            data    : paramStr,
            async   : asynchronous
        });

        // add functions which are called when request is done or if it failed
        request.done(function(response, textStatus, jqXHR){
            var responseMap = createResponseMap(response);
            if(callbackFunction){
                callbackFunction(responseMap);
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
    //
    // private functions
    //
    //
    
    //
    // converts url encoded string into an associated array
    //
    var createResponseMap = function(response)
    {
        var regex = new RegExp("&", "g");
        var uriDecoding = false;

        var parts = response.split(regex);
        var map = {};
        jQuery(parts).each(function(){
            var idx = this.indexOf("=");
            if(idx > -1){
                var key = this.substring(0, idx);
                var value = this.substring(idx+1);
                
                key = key.trim();
                value = value.trim();
                if(key){
                    if(uriDecoding == true){
                        map[key] = decodeURIComponent(value);
                    } else {
                        map[key] = value;
                    }
                }
            }
        });
        return map;
    };
}

