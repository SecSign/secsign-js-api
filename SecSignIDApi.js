/*!
 * (c) copyright SecSign Technologies Inc.
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
    // see http://blog.stevenlevithan.com/archives/faster-trim-javascript
    return stringtotrim.replace(/^\s*([\S\s]*?)\s*$/, '$1'); // this is variant 9 which is the fastest one when dealing with average long strings....
}

/**
 * Javascript class to connect to a secsign id server. the class will check secsign id server certificate and request for ticket generation for a given
 * user id which is called secsign id. Each ticket generation needs a new instance of this class.
 */
function SecSignIDApi(options)
{
    var asynchronous = true;
    
    if(options){
        if("async" in options){
            asynchronous = options["async"];
        }
    }
    
    // public members
    this.referer = 'SecSignIDApi_JS';
    this.pluginName = undefined;
    
    // prototypes
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
        }
        
    SecSignIDApi.prototype.getAuthSessionState = function(secsignid, requestId, authsessionId, setState, callbackFunction) {
            var requestParameter = new Array();
            requestParameter['apimethod'] = this.referer;
            requestParameter['request'] = 'ReqGetAuthSessionState';
            requestParameter['secsignid'] = secsignid;
            requestParameter['authsessionid'] = authsessionId;
            requestParameter['requestid'] = requestId;
            
            if(setState){
                requestParameter['setstate'] = "setstate_internal";
            }
            
            sendRequest(requestParameter, callbackFunction);
        }

    SecSignIDApi.prototype.cancelAuthSession = function(secsignid, requestId, authsessionId, callbackFunction) {
            var requestParameter = new Array();
            requestParameter['apimethod'] = this.referer;
            requestParameter['request'] = 'ReqCancelAuthSession';
            requestParameter['secsignid'] = secsignid;
            requestParameter['authsessionid'] = authsessionId;
            requestParameter['requestid'] = requestId;
            
            sendRequest(requestParameter, callbackFunction);
        }
        
    SecSignIDApi.prototype.releaseAuthSession = function(secsignid, requestId, authsessionId, callbackFunction) {
            var requestParameter = new Array();
            requestParameter['apimethod'] = this.referer;
            
            requestParameter['request'] = 'ReqReleaseAuthSession';
            requestParameter['secsignid'] = secsignid;
            requestParameter['authsessionid'] = authsessionId;
            requestParameter['requestid'] = requestId;
        
            sendRequest(requestParameter, callbackFunction);
        }

        
    // private functions
    var sendRequest = function(parameterArray, callbackFunction)
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
        var request = $.ajax({
            type    : "POST",
            url     : "/",
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
    }
    
    var createResponseMap = function(response)
    {
        var regex = new RegExp("&", "g");
        var uriDecoding = false;

        var parts = response.split(regex);
        var map = {};
        $(parts).each(function(){
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
    }
}

