# CS 125 Socket Dev Tool
======

This creates a Socketcluster server to be connected to a CS 125 Presenter View. Tool allows arbitary data to be passed to CS 125 Presenter View.

## Setup
```
npm install
```

#### worker.js
Set `const PRESENTER_PORT` to port this tool will communicate with CS 125 Presenter View.

## Usage
```
npm start
```

Server will run on port 8000 by default. Can be changed using dotenv or in server.js
