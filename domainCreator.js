
const NGINX_AVAILABLE_VHOSTS = '/etc/nginx/sites-available',
  NGINX_ENABLED_VHOSTS = '/etc/nginx/sites-enabled',
  WEB_DIR = '/var/www',
  NGINX_SCHEME = '$scheme',
  NGINX_REQUEST_URI = '$request_uri',
  { port, subDomain } = process.env,
  mainDomain = 'anandkashyap.in';

// Create the Nginx config file.
execSync(`cat > $NGINX_AVAILABLE_VHOSTS/$subDomain <<EOF
server {
    # Just the server name
    server_name $subDomain.${mainDomain};
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
EOF`);

/* const child = spawn('echo $ANSWER', {
  shell: true,
});

child.stdout.on('data', (msg) => {
  console.log(`${msg}`);
});

child.stderr.on('data', (data) => {
  console.error(`child stderr:\n${data}`);
}); */