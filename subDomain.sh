#!/bin/bash
#
# todo - add support for websocket block
# make script executable first with chmod +x scriptname
# Bash script for generating new subdomain with a new server block(nodejs by default) in Nginx.
# syntax - ./{scriptname} subDomainName mainDomainName PORT
# this script has to be in home root(~) directory to work

# Functions
ok() { echo -e '\e[32m'$1'\e[m'; } # Green
die() { echo -e '\e[1;31m'$1'\e[m'; exit 1; }

# Variable definitions.
NGINX_AVAILABLE_VHOSTS='/etc/nginx/sites-available'
NGINX_ENABLED_VHOSTS='/etc/nginx/sites-enabled'
WEB_DIR='/var/www'
NGINX_SCHEME='$scheme'
NGINX_REQUEST_URI='$request_uri'
PORT=false

# Sanity check.
[ $(id -g) != "0" ] && die "Script must be running as root."
[ $# -ne 3 ] && die "Usage: $(basename $0) subDomainName mainDomainName PORT"

ok "Creating the config files for your subdomain."
PORT=$3
# Create the Nginx config file.
cat > $NGINX_AVAILABLE_VHOSTS/$1 <<EOF
server {
    # Just the server name
    server_name $1.$2;
    root        $WEB_DIR/$1/html;
    # Logs
    access_log $WEB_DIR/$1/logs/access.log;
    error_log  $WEB_DIR/$1/logs/error.log;

    location / {
      proxy_pass http://localhost:$PORT; #whatever port your app runs on
      proxy_http_version 1.1;
      proxy_set_header Upgrade \$http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host \$host;
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Create {html,log} directories.
mkdir -p $WEB_DIR/$1/{html,logs}

# Create index.html file.
cat > $WEB_DIR/$1/html/index.html <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
        <title>You are in the subdomain $1.$2</title>
        <meta charset="utf-8" />
</head>
<body class="container">
        <header><h1>You are in the subdomain $1.$2<h1></header>
        <div id="wrapper">
                This is the body of your subdomain page.
        </div>
        <br>
        <footer>© $(date +%Y)</footer>
</body>
</html>
EOF

# Change the folder permissions.
chown -R $USER:$WEB_USER $WEB_DIR/$1/html

chmod -R 755 $WEB_DIR/$1

# Enable site by creating symbolic link.
ln -s $NGINX_AVAILABLE_VHOSTS/$1 $NGINX_ENABLED_VHOSTS/

# Restart the Nginx server.
# read -p "A restart to Nginx is required for the subdomain to be defined. Do you wish to restart nginx? (y/n): " prompt
# if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
# then
/etc/init.d/nginx restart;
# fi

ok "Subdomain is created for $1."

#add DNS record on netlify
read -p "Add DNS record on netlify? (execute addDns.js) (y/n): " prompt2
if [[ $prompt2 == "y" || $prompt2 == "Y" || $prompt2 == "yes" || $prompt2 == "Yes" ]]
then
  source .nvm/nvm.sh;
  node addDns.js $1 $2;

  # Register SSL certificate
  read -p "Register for letsencrypt certificate? (Needs DNS record added in domain management already) (y/n): " prompt3
  if [[ $prompt3 == "y" || $prompt3 == "Y" || $prompt3 == "yes" || $prompt3 == "Yes" ]]
  then
    certbot --nginx -d $1.$2;
  fi

fi