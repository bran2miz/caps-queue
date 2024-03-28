const { chance, EVENT_NAMES } = require('../../utility');

function deliver(payload, client) {
  console.log('Driver finished delivery', payload.messageId);
  client.emit(EVENT_NAMES.delivered, payload);
  client.emit(EVENT_NAMES.ready);
}

function handlePickup(payload, client) {
  // this function logs that it has picked up the delivery, then sets a timer for 2-5 seconds
  // then the time is up it emits that delivery was made
  console.log('Driver received a pickup event!', payload.messageId);
  setTimeout(
    () => deliver(payload, client),
    chance.integer({ min: 10000, max: 20000 })
  );
}

function startDriver(client) {
  // When driver starts
  console.log('Driver is started');

  // they will emit that they are ready to pickup packages
  client.emit(EVENT_NAMES.ready);

  // passing the connection so we can emit
  // (payload)=> is a wrapper / its a funtion within a function that takes in handlePickup(payload, client) have to currie it in.
  client.on(EVENT_NAMES.pickup, (payload) => {
    handlePickup(payload, client);
  });
  // can't do this 
  // client.on(EVENT_NAMES.pickup, handlePickup(payload, client));
}

module.exports = { startDriver, toTest: { deliver, handlePickup } };