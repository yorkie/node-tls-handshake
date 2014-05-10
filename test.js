
var Handshake = require('./index').Handshake;
var HelloMessage = require('./index').HelloMessage;

var hello = Object.create(HelloMessage);
console.log(hello.toBuffer());

var handshake = Object.create(Handshake);
handshake.body = hello;
console.log(handshake.toBuffer());