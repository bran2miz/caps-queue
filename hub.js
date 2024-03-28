'use strict';

const {Server} = require('socket.io');

const { EVENT_NAMES, Queue } = require('./utility');

const io = new Server();

io.listen(3000);

// The Hub is the brain so it will keep track of the queues

const driverQueue = new Queue();
const packageQueue = new Queue();

//if the client sends getAll I will want one argument - their store name. 
// if they send a store name of flowers I will save their socket as the flowerSocket (same for acmeSocket)
let flowersSocket = null;
let acmeSocket = null;

// fetches all messages from the hub that are in the flower's queue (events/ messages they've not yet received)
const flowersDeliveredQueue = new Queue();


// fetches all messages from the hub that are in the widget's queue (events/ messages they've not yet received)
const acmeWidgetDeliveredQueue = new Queue();


function handlePickup(payload) {
  //Refractor
  console.log('HUB package arrived ready for delivery', payload.messageId);

  // when a package comes in check driver queue
  if (driverQueue.isEmpty()) {
    // if no drivers, enqueue to package queue
    // package will go to payload queue waiting for a driver
    packageQueue.enqueue(payload);
  } else {
    // if there is a driver dequeue the driver and send package.
    
    const driverSocket = driverQueue.dequeue();
    
    driverSocket.emit(EVENT_NAMES.pickup, payload);
  }
}

function handleDelivered(payload) {
  
  console.log('HUB delivered', payload);
  //when you get a delivery: payload.company === "flowers" ? flowersDeliveredQueue.enqueue(payload)

  if (payload.clientId === '1-800-flowers') {
    //put it in the 1-800-flowers queue
    flowersDeliveredQueue.enqueue(payload);
    // console.log(flowersDeliveredQueue);
    flowersSocket.emit(EVENT_NAMES.delivered, payload);
  } if (payload.clientId === 'acme-widgets') {
    //put it in the acme queue
    acmeWidgetDeliveredQueue.enqueue(payload);
    acmeSocket.emit(EVENT_NAMES.delivered, payload);
  }
  io.emit(EVENT_NAMES.delivered, payload);
}


function handleReady(socket) {
// this is the driver emiting that they are ready
  console.log('driver # ', socket.id, 'is ready');
  if (packageQueue.isEmpty()) {
    // if there isn't a package then go in a queue of drivers
    driverQueue.enqueue(socket);
  } else {
    // if there is a package, the driver delivers it
    // dequeue the package, and emit for THAT SPECIFIC driver USING THEIR SOCKET to pick it up
    const parcel = packageQueue.dequeue();
    // parcel that we dequeue from our queue is now our payload
    socket.emit(EVENT_NAMES.pickup, parcel);
  }
}

function handleReceived(payload) {
  console.log('vendor acknowledged delivery', payload.messageId);
  // remove from the queue
  if (payload.clientId === '1-800-flowers'){
    //put it in the 1-800-flowers queue
    flowersDeliveredQueue.dequeue();
  } if (payload.clientId === 'acme-widgets') {
    //put it in the acme queue
    acmeWidgetDeliveredQueue.dequeue();
  }
}

function handleGetAll(storeName, socket){
  if (storeName === '1-800-flowers') {
    flowersSocket = socket;
    flowersDeliveredQueue.queue.forEach((order) => {
      socket.emit(EVENT_NAMES.delivered, order);
    });
  } else if (storeName === 'acme-widgets') {
    acmeSocket = socket;
    acmeWidgetDeliveredQueue.queue.forEach(order => {
      socket.emit(EVENT_NAMES.delivered, order);
    });
  }
}


// EXAMPLE PAYLOAD FOR MY REFERENCE
// const payload = {
//   event: 'pickup', // either pickup or delivered
//   messageId: event.orderId, // unique id from the original payload
//   clientId: `acme-widgets`, // either acme-widgets or 1-800-flowers
//   order: event,
// };

function handleConnection(socket) {
  console.log('have new connection', socket.id);
  // whenever the hub gets a pickup or delivered event, send it to everyone

  // First action from Vendor

  socket.on(EVENT_NAMES.pickup, handlePickup);
  // these on functions take two arguments
  // the event or string we are listening for
  // the callback function(handler) that handles the event
  // the callback function AUTOMATICALLY receives the payload as it's first argument

  //inline callback function that takes in the auto payload
  //inside the function call handleReady and pass it the socket which came in to the parent function handleConnection();
  //emit directly to that socket (talk only to the person we made a connection with)
  socket.on(EVENT_NAMES.ready,(payload) => handleReady(socket));


  socket.on(EVENT_NAMES.delivered, handleDelivered);


 

  // "I got the message that the package was delivered"
  socket.on('received', handleReceived);
  // storeName is the payload
  socket.on('getAll', (storeName) => handleGetAll(storeName,socket));
}

function startSocketServer() {
  // on connection has a payload of the socket that connected
  // connection gets the socket automatically
  io.on('connection', handleConnection);
  console.log('Everything is started!');
}

module.exports = {
  startSocketServer,
  io,
  handlePickup,
  handleDelivered,
  handleConnection,
};

// this file is now the brain, instead of just a barrel
// becomes a socket server and handles reciving and routing of messages

