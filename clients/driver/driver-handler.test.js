const {EVENT_NAMES} = require('../../utility');

const {toTest: {deliver, handlePickup}} = require('./handler');

// sara's uses this from her caps project.
jest.useFakeTimers();

describe('Tests the driver handler functions', () => {
  test('Driver deliver', () => {
    //Arrange
    const io = {emit: jest.fn()};

    //Act
    
    // 'thisisapayloadobject' is this:

    // const payload = {
    //     event: 'pickup', // either pickup or delivered
    //     messageId: event.orderId, // unique id from the original 
    //       payload
    //     clientId: `acme-widgets`, // either acme-widgets or 
    //       1-800-flowers
    //     order: event,
    //   };

    deliver('thisisapayloadobject', io);

    //Assert
    expect(io.emit).toHaveBeenCalledWith(EVENT_NAMES.delivered, 'thisisapayloadobject');
  });
  test('Driver handlePickup', () => {
    // Arrange
    const io = { emit: jest.fn()};

    // Act
    // handlePickup takes the payload (object with key/ values), and the client
    handlePickup(
      {
        store: 'test',
        orderId: '1234',
        customer: 'customer',
        address: '111 Main',
      },
      io
    );
    // Timers - skip setTimeout
    jest.runAllTimers();

    // Assert
    expect(io.emit).toHaveBeenCalledWith(EVENT_NAMES.delivered, {
      store: 'test',
      orderId: '1234',
      customer: 'customer',
      address: '111 Main',
    });
  });
});