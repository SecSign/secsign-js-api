# SecSign ID JS Interface


**Overview**

SecSign ID Api is a two-factor authentication for javascript/PHP web applications.

This javascript API allows a secure login using a private key on a smart phone running SecSign ID by SecSign Technologies Inc.


**Usage**

* Include the API `SecSignIDApi.js` in your webpage
* Send all requests to the PHP script `signin-bridge.php`
* Use the PHP API `SecSignIDApi.php` to send incoming requests to the ID server

* Request an authentication session
* Show access pass to user and save session parameters 
* Get session state 
* React to the state and have the user logged in


Check out the included example `example.pl` to see how it works or 
have a look at the how to use tutorial for PHP <https://www.secsign.com/php-tutorial/>
or visit <https://www.secsign.com> for more informations.

**Files**

* `SecSignIDApi.js` - the file contains two classes SecSignIDApi and AuthSession. The class SecSignIDApi will care about the communication with the ID server
* `SecSignIDApi.php` - the SecSign ID PHP Api <https://github.com/SecSign/secsign-php-api>
* `signin-bridge.php` - the php bridge with routes the incoming requests send by the SecSign ID Api to the ID server

**Requirements**

The communication with the ID server is done using a php bridge due to the same domain policy of javascript.


===============

SecSign Technologies Inc. official site: <https://www.secsign.com>
