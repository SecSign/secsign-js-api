<?php

//
// SecSign ID Api php bridge to redirect requests sent by javascript.
//
// (c) 2014 SecSign Technologies Inc.
//

	include ('phpApi/SecSignIDApi.php');
    
    $send_as_ajax = isset($_REQUEST['isajax']);
    $content_type = $send_as_ajax ? "text/xml" : "text/plain";
    
    
    if(isset($_REQUEST['request']) && isset($_REQUEST['apimethod']))
    {
    	// the only excepted request names are:
        // ReqRequestAuthSession
        // ReqGetAuthSessionState
        // ReqReleaseAuthSession
        // ReqCancelAuthSession
        
        $secSignIDApi = new SecSignIDApi();
        
        if(strcmp($_REQUEST['request'], "ReqRequestAuthSession") == 0){
            try
            {
            	// request an authentication session.
                $authsession = $secSignIDApi->requestAuthSession($_POST['secsignid'], $_POST['servicename'], $_POST['serviceaddress']);
                $response = $secSignIDApi->getResponse();
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }
        } else if(strcmp($_REQUEST['request'], "ReqGetAuthSessionState") == 0){
            try
            {
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
    			
    			// send request to check authentication session from javascript api to id-server via php api
                $authSessionState = $secSignIDApi->getAuthSessionState($authsession);
                $response = $secSignIDApi->getResponse();
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }
        
        } else if(strcmp($_REQUEST['request'], "ReqReleaseAuthSession") == 0){
            try
            {
	            $servicename = isset($_POST['servicename']) ? $_POST['servicename'] : "";
            	$serviceaddress = isset($_POST['serviceaddress']) ? $_POST['serviceaddress'] : "";
            	
                $authsession = new AuthSession();
                $authsession->createAuthSessionFromArray(array(
                                    'requestid' => $_POST['requestid'],
                                    'secsignid' => $_POST['secsignid'],
                                    'authsessionid' => $_POST['authsessionid'],
                                    'servicename' => $servicename,
                                    'serviceaddress' => $serviceaddress
                                    ), true);
                                    
                                    
                // send request to release authentication session from javascript api to id-server via php api
                $secSignIDApi->releaseAuthSession($authsession);
                $response = $secSignIDApi->getResponse();
                
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }
        } else if(strcmp($_REQUEST['request'], "ReqCancelAuthSession") == 0){
            try
            {
            	// it is supposed that the javascipt api sends this information as well. but to asure that 'null' isn't sent to server...
	            $servicename = isset($_POST['servicename']) ? $_POST['servicename'] : "";
            	$serviceaddress = isset($_POST['serviceaddress']) ? $_POST['serviceaddress'] : "";
            	
                $authsession = new AuthSession();
                $authsession->createAuthSessionFromArray(array(
                                    'requestid' => $_POST['requestid'],
                                    'secsignid' => $_POST['secsignid'],
                                    'authsessionid' => $_POST['authsessionid'],
                                    'servicename' => $servicename,
                                    'serviceaddress' => $serviceaddress
                                    ), true);

				
				// send request to cancel authentication session from javascript api to id-server via php api
                $authSessionState = $secSignIDApi->cancelAuthSession($authsession);
                $response = $secSignIDApi->getResponse();
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }
        } else {
        	// unknown request. cannot bridge it to id server via php api
            $response = "error=500;errormsg=unknown%20request;";
        }
    }
        
    header("Content-Type: " . $content_type);
    header("Content-Length: " . strlen($response));
        
    // send repsonse from id server to javascript api
    echo $response;
?>
