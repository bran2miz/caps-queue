# Class 13 Notes

Vendors send (emit) the packages to the hub.

Drivers claim that they are ready. come into the hub and then pickup the package in the queue. goes back to the "car" and deliver the package. 

If the driver is ready:
    - check the package queue
    - if there is a package:
      - driver delivers it
    - if there isn't a package:
      - they go in a queue of drivers

Package comes in:
    - If there is a driver in the driver queue, it will take the package.
    - If there are no available drivers:
      - it will be put into the queue

Add driver emit "available" after they complete a delivery or first log on. 

// New queue stuff

emit "getAll" in case the vendor has missed any deliver messages

on "getAll":
 - save their socket ("address") based on the store (to route things to)
 - hub checks the vendor queue
 - sends any others in the queue and clears it out

essentially problem solving the right store gets the right orders

when on "delivered":
    - emit "received" messageId
      - on "received" remove that package from the queue