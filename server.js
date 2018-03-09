#!/usr/bin/env node

var commandLineArgs = require("command-line-args");
var options = commandLineArgs([
  {name: 'port', alias: 'p', type: Number, defaultValue: 8765},
  {name: 'target', alias: 't', type: String, defaultOption: true}
]);
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
  app.use(cors({
    origin: true,
    credentials: true
  }));

  app.use('/', proxyFunc);
  app.listen(port);
}

if(!options.target){

  var usage = require('command-line-usage')([
    {
      header: 'Reverse Proxy',
      content: 'Useful during development on a test server needing to communicate with APIs having restrictive CORS settings.'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'target',
          description: 'Target server base url.'
        },
        {
          name: 'port',
          description: 'Target server port (default 8765).'
        }
      ]
    }
  ]);

  console.log(usage);
}else{
  runServer(options.target, options.port);
}