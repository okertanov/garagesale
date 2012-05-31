Garage Sale design notes
========================

MVP
---
* Render landing page
* Place items via web
* Place items via mail
* Register users
* Edit items
* Simple admin panel for post-moderation

Future
------
* Tags
* Direct links
* Embeddable content
* User ratings
* Auctions
* Hero: what's hot
* Post to FB, Twi, LJ
* Breadcrumbs: category navi
* Minimalistic
* API

Architecture
------------
### Static site
    /
    /lib
    /img
    /static
    /admin

### API
    /api/garage                 -- all categories in the garage (list)
    /api/garage/:cat            -- single category (just info on the category)
    /api/garage/:cat/filter/:f  -- items in category by filter (including all)
    /api/garage/:cat/:id        -- single item in category
    /api/admin                  -- admin interface (with the same options)

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
    sudo git clone /srv/git/garagesale.git garage.lexiko.me
    sudo chown -R okertanov:okertanov garage.lexiko.me

