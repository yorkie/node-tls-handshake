
var Buffer = require('buffer24');
var constants = require('tls-constants');
var versions = constants.TLS.Versions;
var types = constants.Handshake.Types;

exports.HelloMessage = {

  /*
   * name
   */
  get name () {
    return 'HelloMessage';
  },

  /*
   * handshake version
   */
  get version () {
    return this._version || versions['1.1'];
  },

  /*
   * handshake version
   */
  set version (val) {
    this._version = versions[val] || versions['1.1'];
  },

  /*
   * handshake session id
   */
  get sessionId () {
    return this._sessionId || 0;
  },

  /*
   * handshake session id
   */
  set sessionId (val) {
    this._sessionId = val || 0;
  },

  /*
   * handshake cipher suits
   */
  get ciphers () {
    return this._ciphers || [ 0, 0 ];
  },

  /*
   * handshake cipher suits
   */
  set ciphers (val) {
    if (val.length != 2) throw new Error('wrong arguments');
    this._ciphers = val;
  },

  /*
   * handshake comp
   */
  get compression () {
    return !!this._compression;
  },

  /*
   * handshake comp
   */
  set compression (val) {
    this._compression = !!val;
  },

  /*
   * handshake to buffer
   */
  toBuffer: function() {
    var len = 0
      // version
      + 2
      // random
      + 32
      // session   
      + 2
      // cipher suites
      + 4
      // compression
      + 2
      // extension
      + 2;

    var buf = new Buffer(len);
    var offset = 0;

    // write version(2)
    buf.writeUInt8(this.version[0], offset++);
    buf.writeUInt8(this.version[1], offset++);
    
    // write random(32)
    offset = writeRandom(buf, offset);

    // write session(2)
    buf.writeUInt8(0, offset++);

    // write cipher suites(2+4)
    buf.writeUInt16BE(0x02, offset); offset += 2;
    // write data
    buf.writeUInt16BE(0x0033, offset); offset += 2;

    // write compression(2)
    buf.writeUInt8(1, offset++);
    buf.writeUInt8(0, offset++);

    // write extension(2)
    buf.writeUInt16BE(0, offset);
    offset += 2;
    return buf;
  }

};

exports.Handshake = {

  /*
   * handshake type
   */
  get type () {
    return this._type || types['client_hello'];
  },

  /*
   * handshake type
   */
  set type (val) {
    this._type = types[val] || types['client_hello'];
  },

  /*
   * handshake fragment length
   */
  get length () {
    return this._length || 0;
  },

  /*
   * handshake fragment length
   */
  set length (val) {
    throw new Error('internal usage');
  },

  /*
   * handshake body
   */
  get body () {
    return this._body;
  },

  /*
   * handshake body
   */
  set body (val) {
    var body = val;
    if (val.name == 'HelloMessage' && typeof val.toBuffer == 'function') {
      body = val.toBuffer();
    }
    this._body = body;
    this._length = body.length;
  },

  /*
   * handshake buffer
   */
  toBuffer: function() {
    var buf = new Buffer(4);
    buf.writeUInt8(this.type, 0);
    buf.writeUInt24BE(this.length, 1);
    return Buffer.concat([buf, this.body]);
  }

};

function writeRandom(buf, offset) {
  var time = parseInt(Date.now()/1000);
  buf.writeUInt32BE(time, offset);
  offset += 4;
  for (var i=0; i<28; i++) {
    buf.writeUInt8(parseInt(Math.random()*255), offset++);
  }
  return offset;
}
