
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
    var buf = new Buffer(40);
    buf.writeUInt8(this.version[0], 0);
    buf.writeUInt8(this.version[1], 1);
    writeRandom(buf, 2);

    buf.writeUInt8(0, 34);
    buf.writeUInt8(this.ciphers[0], 35);
    buf.writeUInt8(this.ciphers[1], 36);
    if (this.compression) {
      buf.writeUInt8(255, 37);
    } else {
      buf.writeUInt8(0, 37);
    }

    buf.writeUInt8(0, 38);
    buf.writeUInt8(0, 39);
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
    var buf = new Buffer(3);
    buf.writeUInt8(this.type, 0);
    buf.writeUInt16BE(this.length, 1);
    return Buffer.concat([buf, this.body]);
  }

};

function writeRandom(buf, offset) {
  buf.writeUInt32BE(0, offset);
  buf.fill(0, offset + 4, offset + 27);
  return buf;
}

