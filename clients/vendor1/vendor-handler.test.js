const {EVENT_NAMES} = require('../../utility');

const{
  toTest: {sendPickup, acknowledgeDelivery},
} = require('./handler.js');

describe('tests the vendor functions', ()=> {
  test('sendPickup should emit an order', () => {
    //arange
    const io = {emit: jest.fn()};

    //act 
    sendPickup(io);

    //assert 
    expect(io.emit).toHaveBeenCalledWith(
      EVENT_NAMES.pickup,
      expect.any(Object)
    );
  });

  test('acknowledgeDelivery should say thank you and have the order number', ()=> {
    //arrange
  
    const logMock = jest.spyOn(console, 'log');
    //act
    const payload = { messageId: '1234' }; // Mock payload object
    const client = { emit: jest.fn() }; // Mock client object
    acknowledgeDelivery(payload, client);

    //assert
    expect(logMock).toHaveBeenCalledWith('Thank you for the delivery','1234');
    expect(client.emit).toHaveBeenCalledWith('received', payload);
  });
});