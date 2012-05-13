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

Deploy
------
    cd /srv/git
    sudo git --bare init --shared garagesale.git
    sudo chown -R okertanov:developers garagesale.git
    cd garagesale.git
    git update-server-info

    sudo vim /srv/git/garagesale.git/hooks/post-receive
    sudo chmod 755 /srv/git/garagesale.git/hooks/post-receive

    cd /srv/www
    sudo git clone /srv/git/garagesale.git garage.espectrale.com
    sudo chown -R okertanov:okertanov garage.espectrale.com

