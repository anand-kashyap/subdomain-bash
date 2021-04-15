
const cmdArr = [
  // Create the Nginx config file.
  {
    cmd: `cat > $NGINX_AVAILABLE_VHOSTS/$subDomain <<EOF
server {
  # Just the server name
  server_name $subDomain.$mainDomain;
  root        $WEB_DIR/$subDomain/html;
  # Logs
  access_log $WEB_DIR/$subDomain/logs/access.log;
  error_log  $WEB_DIR/$subDomain/logs/error.log;

  location / {
    proxy_pass http://localhost:$port; #whatever port your app runs on
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
  }
}
EOF`, msg: 'creating nginx config file'
  },
  // Create {html,log} directories.
  { cmd: 'mkdir -p $WEB_DIR/$subDomain/{html,logs}', msg: 'Creating {html,log} directories' },
  // Create {html,log} directories.
  {
    cmd: `cat > $WEB_DIR/$subDomain/html/index.html <<EOF
  <!DOCTYPE html>
  <html lang="en">
  <head>
          <title>You are in the subdomain $subDomain.$mainDomain</title>
          <meta charset="utf-8" />
  </head>
  <body class="container">
          <header><h1>You are in the subdomain $subDomain.$mainDomain<h1></header>
          <div id="wrapper">
                  This is the body of your subdomain page.
          </div>
          <br>
          <footer>© $(date +%Y)</footer>
  </body>
  </html>
  EOF`, msg: 'Create index.html file'
  },
  // Setting the folder permissions
  { cmd: 'chown -R $USER:$WEB_USER $WEB_DIR/$subDomain/html && chmod -R 755 $WEB_DIR/$subDomain', msg: 'Setting the folder permissions' },
  // Enable site by creating symbolic link.
  { cmd: 'ln -s $NGINX_AVAILABLE_VHOSTS/$subDomain $NGINX_ENABLED_VHOSTS/', msg: 'Enable site by creating symbolic link.' },
  // Restarting the Nginx server.
  { cmd: '/etc/init.d/nginx restart', msg: 'Restarting the Nginx server.' },
];

module.exports = { cmdArr };