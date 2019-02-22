<?php

//
// SecSign ID Api php bridge to redirect requests sent by javascript.
//
// (c) 2014-2016 SecSign Technologies Inc.
//

	include ('phpApi/SecSignIDApi.php');
    
    if(isset($_REQUEST['request']) && isset($_REQUEST['apimethod']))
    {
    	// the only excepted requests are:
        // ReqRequestAuthSession
        // ReqGetAuthSessionState
        // ReqCancelAuthSession
        
        $secSignIDApi = new SecSignIDApi();
        
        if(strcmp($_REQUEST['request'], "ReqRequestAuthSession") == 0){
            try
            {
            	if(empty($_POST['secsignid'])){
            		$response = urlencode("error=500;errormsg=no secsign id was found in header values. could not create authentication session.");
            	} else {
					// request an authentication session.
					if(isset($_POST['pluginname'])){
						$secSignIDApi->setPluginName($_POST['pluginname']);
					}
					$secSignIDApi->requestAuthSession($_POST['secsignid'], $_POST['servicename'], $_POST['serviceaddress']);
					$response = $secSignIDApi->getResponse();
                }
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }
        } else {
        	try
            {
            	// check whether a secsign id is given. if not there is no need to bridge the request
            	
            	if(empty($_POST['secsignid'])){
            		$response = urlencode("error=500;errormsg=no secsign id was found in header values. request is not sent.");
            	} else {
            	
					$servicename = isset($_POST['servicename']) ? $_POST['servicename'] : "";
					$serviceaddress = isset($_POST['serviceaddress']) ? $_POST['serviceaddress'] : "";
				
					// create auth session object
					$authsession = new AuthSession();
					$authsession->createAuthSessionFromArray(array(
										'requestid' => $_POST['requestid'],
										'secsignid' => $_POST['secsignid'],
										'authsessionid' => $_POST['authsessionid'],
										'servicename' => $servicename,
										'serviceaddress' => $serviceaddress
										), true);
				
					if(strcmp($_REQUEST['request'], "ReqGetAuthSessionState") == 0){
				
						// send request to check authentication session from javascript api to id-server via php api
						$secSignIDApi->getAuthSessionState($authsession);
						$response = $secSignIDApi->getResponse();
					
					} else if(strcmp($_REQUEST['request'], "ReqCancelAuthSession") == 0){
		  
						// send request to cancel authentication session from javascript api to id-server via php api
						$secSignIDApi->cancelAuthSession($authsession);
						$response = $secSignIDApi->getResponse();
					}
					else {
						// unknown request. cannot bridge it to id server via php api
						$response = urlencode("error=500;errormsg=unknown request;");
					}
        		}
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            } 
        }
    } else {
        // unknown request. cannot bridge it to id server via php api
        $response = urlencode("error=500;errormsg=no value for request was found in header values.");
    }
    
    // response from server is url encoded string with parameter value pairs
    header("Content-Type: " . "text/plain");
    header("Content-Length: " . strlen($response));
        
    // send repsonse from id server to javascript api
    echo $response;
?>
