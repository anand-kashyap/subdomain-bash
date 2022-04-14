#!/bin/bash
#
# make script executable first with chmod +x scriptname
# Bash script for removing existing subdomain.
# syntax - ./{scriptname} subDomainName
# this script has to be in home root(~) directory to work

# Functions
ok() { echo -e '\e[32m'$1'\e[m'; } # Green
die() { echo -e '\e[1;31m'$1'\e[m'; exit 1; }

# Variable definitions.
NGINX_AVAILABLE_VHOSTS='/etc/nginx/sites-available'
NGINX_ENABLED_VHOSTS='/etc/nginx/sites-enabled'
WEB_DIR='/var/www'

# Sanity check.
[ $(id -g) != "0" ] && die "Script must be running as root."
[ $# -ne 1 ] && die "Usage: $(basename $0) subDomainName"

ok "Creating the config files for your subdomain."
# removing existing subdomain
rm $NGINX_AVAILABLE_VHOSTS/$1 || ok "Subdomain file does not exist already."

# Create {html,log} directories.
rm -rf $WEB_DIR/$1 || ok "Subdomain directories do not exist already."

# Enable site by creating symbolic link.
rm $NGINX_ENABLED_VHOSTS/$1

# Restart the Nginx server.
/etc/init.d/nginx restart;

ok "Subdomain is removed for $1."

read -p "Delete DNS record on netlify? (execute removeDnsRecord.js) (y/n): " prompt2
if [[ $prompt2 == "y" || $prompt2 == "Y" || $prompt2 == "yes" || $prompt2 == "Yes" ]]
then
  source .nvm/nvm.sh;
  node removeDnsRecord.js $1;

  # delete SSL certificate
  certbot delete --cert-name "$1.anandkashyap.in";

fi