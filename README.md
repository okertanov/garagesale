GarageSale
==========

Rationale
---------

Environment
-----------
See doc/Environment.md

Server
------

### Node.js & NPM
    sudo apt-get install python-software-properties
    sudo apt-add-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs npm

### Node modules
    export NODE_PATH="'$(npm root -g)'"
    NODE_ENV=production node server
* forever
* socket.io
* express
* underscore
* mongoose

### Requirements
#### nginx
    add-apt-repository ppa:nginx/stable
    apt-get update && apt-get install nginx
#### mongodb
    sudo aptitude install mongodb
#### varnish

