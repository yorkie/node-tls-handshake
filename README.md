
TLS Handshake
=============
handshake buffer generator in pure javascript

### Installation
```
$ npm install tls-handshake
```

### Usage
```js
var hello = Object.create(HelloMessage);
console.log(hello.toBuffer());

var handshake = Object.create(Handshake);
handshake.type = 'client_hello';
handshake.body = hello;
console.log(handshake.toBuffer());
```

### License
MIT
