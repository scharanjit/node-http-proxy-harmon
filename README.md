##node-http-proxy-harmon
```
This application is using node proxy http harmon library to create web proxies 
 
 Main Features
 -- Dyanmic proxy creation
 -- hidden private IP's
 
 Current application is using spark instance runing on local machine.
 
 Please upodate the priavateIP & localhost port address accordingly
 
 NodeJS server is running on port 8889
 
 How to Run this->
  
 
  1.) npm install
   If you are using ubuntu version 14.0.4 then Node and NPM version shoul be greater than 1.0.0
   To install the latest version, Go to console and use below mentioned commands.
   curl -sL https://deb.nodesource.com/setup | sudo bash -
   sudo apt-get update
   sudo apt-get install nodejs
   sudo apt-get install npm
   
   2.) Run the instance of spark on your local machine or update the server IP in index.js file accordingly
   
   
   3.) cd projectFolder/examples
   
   
   node index.js
   
   4.) Go to web browser
   - http://localhost:8889/spark/
 
 
```
