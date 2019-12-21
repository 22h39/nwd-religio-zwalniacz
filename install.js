var Service = require('node-windows').Service;

var svc = new Service({
  name:'zwalniacz-nwd',
  description: 'Nowodworski Zwalniacz!!',
  script: process.argv[2]
});

svc.on('install',function(){
  svc.start();
});

svc.install();