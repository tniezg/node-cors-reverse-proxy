#!/usr/bin/env node

var commandLineArgs = require("command-line-args");
var cli = commandLineArgs([
  {name: 'port', alias: 'p', type: Number, defaultValue: 8765},
  {name: 'target', alias: 't', type: String, defaultOption: true}
]);
var options = cli.parse();
var usage;

function runServer(target, port){
  var connect = require('connect');
  var url = require('url');
  var proxy = require('proxy-middleware');
  var app = connect();
  var proxyOptions = url.parse(target);
  var proxyFunc = proxy(proxyOptions);
  var cors = require('cors');
  var logger = require('morgan');

  app.use(logger('dev'));
  app.use(cors());

  app.use('/', proxyFunc);
  app.listen(port);
}

if(!options.target){

  var usage = cli.getUsage({
      title: "Reverse Proxy",
      description: "Useful during development on a test server needing to communicate with APIs having restrictive CORS settings."
  });

  console.log(usage);
}else{
  runServer(options.target, options.port);
}