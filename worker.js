var SCWorker = require('socketcluster/scworker');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var morgan = require('morgan');
var healthChecker = require('sc-framework-health-check');

const PRESENTER_PORT = 5000;

//  Socket.io Imports to connect to Meteor Presenter View
var io = require('socket.io').listen(PRESENTER_PORT);
io.on('connection', (socket) => {
  console.log("Meteor Presenter View Connected: ", socket.client.id);
});

function updateProgress(data) {
  io.emit('updateProgress', data);
}
function askQuestion(data) {
  io.emit('askQuestion', data);
}

class Worker extends SCWorker {
  run() {
    console.log('   >> Worker PID:', process.pid);
    var environment = this.options.environment;

    var app = express();

    var httpServer = this.httpServer;
    var scServer = this.scServer;

    if (environment === 'dev') {
      // Log every HTTP request. See https://github.com/expressjs/morgan for other
      // available formats.
      app.use(morgan('dev'));
    }
    app.use(serveStatic(path.resolve(__dirname, 'public')));

    // Add GET /health-check express route
    healthChecker.attach(this, app);

    httpServer.on('request', app);

    var count = 0;

    /*
      In here we handle our incoming realtime connections and listen for events.
    */
    scServer.on('connection', function (socket) {

      // Some sample logic to show how to handle client events,
      // replace this with your own logic

      socket.on('sampleClientEvent', function (data) {
        count++;
        console.log('Handled sampleClientEvent', data);
        scServer.exchange.publish('sample', count);
      });

      socket.on('updateProgress', (data) => {
        console.log("student: " + data.student + " slide id: " + data.slideID);
        updateProgress(data);
      });

      socket.on('askQuestion', (data) => {
        console.log("student: " + data.student + " question: " + data.question);
        askQuestion(data);
      });

      socket.on('disconnect', function () {

      });
    });
  }
}

new Worker();
