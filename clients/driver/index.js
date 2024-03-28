'use strict';

const {io} = require('socket.io-client');

const client = io('ws://localhost:3000');

const {startDriver} = require('./handler.js');

startDriver(client);

