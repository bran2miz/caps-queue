// module.exports = {
//   pickup: 'pickupReady', 
//   pickedUp: 'driverPickedUp',
//   inTransit: 'inTransit',
//   delivered:'packageDelivered',
//   announcement:'announcement',
//   ready: 'ready'
// };

//remove the 'events' lib

const chance = require('chance')();
// use the chance library to create unique random orders

const EVENT_NAMES = {
  pickup: 'pickUp',
  delivered: ' packDelivered',
  ready: 'ready',
  // pickedUp: 'driverPickedUp',
  // inTransit: 'inTransit',
  // announcement: 'announcement',
};

class Queue {
  constructor() {
    // the driver queue will hold driver sockets
    // the package queue will hold payloads
    this.queue = [];
  }
  enqueue(item) {
    // The unshift() method adds the specified elements to the beginning of an array and returns the new length of the array.
    this.queue.unshift(item);
  }
  dequeue() {
    return this.queue.pop();
  }
  isEmpty() {
    return this.queue.length === 0;
  }
}
module.exports = { chance, EVENT_NAMES, Queue };