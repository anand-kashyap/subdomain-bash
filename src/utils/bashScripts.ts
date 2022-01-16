import { SequenceCustomEvent } from '../constants';
import { BashCommand } from '../types';

const cmdArr: BashCommand[] = [
  { bashCommand: 'git clone $repoUrl $repoName', message: 'Cloning Git repo' },
  // check for yarn lock or package json lock - install node_modules
  {
    bashCommand:
      '([ -f $repoName/yarn.lock ] && yarn --cwd $repoName) || ([ -f $repoName/package-lock.json ] && npm i -C $repoName)',
    message: 'Installing node_modules(with yarn or npm)',
  },
  {
    bashCommand: 'npm run build --if-present',
    message: 'Running npm build if-present',
  },
  // ! todo - decide a port to start with, check for next free port? use mysql from serverless funcs
  // use pm2 to start the process with appName(input from frontend?)
  {
    bashCommand: 'PORT=$port pm2 start npm --name "$appName" -- start',
    message: 'Running pm2 start',
  },
  {
    bashCommand: `cat > $NGINX_AVAILABLE_VHOSTS/$subDomain <<EOF
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
EOF`,
    message: 'Creating nginx config file',
  },
  {
    bashCommand: 'mkdir -p $WEB_DIR/$subDomain/{html,logs}',
    message: 'Creating {html,log} directories',
  },
  {
    bashCommand: `cat > $WEB_DIR/$subDomain/html/index.html <<EOF
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
  EOF`,
    message: 'Create index.html file',
  },
  {
    bashCommand:
      'chown -R $USER:$WEB_USER $WEB_DIR/$subDomain/html && chmod -R 755 $WEB_DIR/$subDomain',
    message: 'Setting the folder permissions',
  },
  {
    bashCommand:
      'ln -s $NGINX_AVAILABLE_VHOSTS/$subDomain $NGINX_ENABLED_VHOSTS/',
    message: 'Enable site by creating symbolic link.',
  },
  {
    bashCommand: '/etc/init.d/nginx restart',
    message: 'Restarting the Nginx server.',
  },
  {
    customEvent: SequenceCustomEvent.ADD_DNS_RECORD,
    message: 'added dns to netlify',
  },
  {
    bashCommand: `certbot --nginx -d $subDomain.$mainDomain`,
    message: 'Register SSL',
  },
];

export { cmdArr };
