<?php
	include ('SecSignIDApi.php');
    
    $send_as_ajax = isset($_REQUEST['isajax']);
    $content_type = $send_as_ajax ? "text/xml" : "text/plain";
    
    
    if(isset($_REQUEST['request']) && isset($_REQUEST['apimethod']))
    {
        // ReqRequestAuthSession
        // ReqGetAuthSessionState
        // ReqReleaseAuthSession
        // ReqCancelAuthSession
        
        $secSignIDApi = new SecSignIDApi();
        
        if(strcmp($_REQUEST['request'], "ReqRequestAuthSession") == 0){
            try
            {
                $authsession = $secSignIDApi->requestAuthSession($_POST['secsignid'], $_POST['servicename'], $_POST['serviceaddress']);
                //$response = $authsession->getAuthSessionAsArray();
                
                $response = $secSignIDApi->getResponse();
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }
        } else if(strcmp($_REQUEST['request'], "ReqGetAuthSessionState") == 0){
            
            try
            {
                $authsession = new AuthSession();
                $authsession->createAuthSessionFromArray(array(
                                    'requestid' => $_POST['requestid'],
                                    'secsignid' => $_POST['secsignid'],
                                    'authsessionid' => $_POST['authsessionid'],
                                    'servicename' => $_POST['servicename'],
                                    'serviceaddress' => $_POST['serviceaddress']
                                    ), true);
    
                $authSessionState = $secSignIDApi->getAuthSessionState($authsession);
                $response = $secSignIDApi->getResponse();
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }
        
        } else if(strcmp($_REQUEST['request'], "ReqReleaseAuthSession") == 0){
            try
            {
                $authsession = new AuthSession();
                $authsession->createAuthSessionFromArray(array(
                                    'requestid' => $_POST['requestid'],
                                    'secsignid' => $_POST['secsignid'],
                                    'authsessionid' => $_POST['authsessionid'],
                                    'servicename' => $_POST['servicename'],
                                    'serviceaddress' => $_POST['serviceaddress']
                                    ), true);
                                    
                                    
                $secSignIDApi->releaseAuthSession($authsession);
                $response = $secSignIDApi->getResponse();
                
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }


        } else if(strcmp($_REQUEST['request'], "ReqCancelAuthSession") == 0){
            
            try
            {
                $authsession = new AuthSession();
                $authsession->createAuthSessionFromArray(array(
                                    'requestid' => $_POST['requestid'],
                                    'secsignid' => $_POST['secsignid'],
                                    'authsessionid' => $_POST['authsessionid'],
                                    'servicename' => $_POST['servicename'],
                                    'serviceaddress' => $_POST['serviceaddress']
                                    ), true);


                $authSessionState = $secSignIDApi->cancelAuthSession($authsession);
                $response = $secSignIDApi->getResponse();
            }
            catch(Exception $e){
                $response = $secSignIDApi->getResponse();
            }

        } else {
            $response = "error=500;errormsg=unknown%20request;";
        }
    }
        
    header("Content-Type: " . $content_type);
    header("Content-Length: " . strlen($response));
        
    echo $response;
?>
