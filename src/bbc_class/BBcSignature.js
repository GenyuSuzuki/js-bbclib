import { KeyPair } from './KeyPair.js';
import jseu from 'js-encoding-utils';
import * as helper from '../helper.js';

import { Buffer } from 'buffer';

export class BBcSignature{
  constructor(key_type) {
    this.key_type = key_type;
    this.signature = null;
    this.pubkey = null;
    this.pubkey_byte = null;
    this.keypair = null;
    this.not_initialized = true;
  }

  show_sig() {
    console.log('key_type :',this.key_type);
    console.log('signature :', this.signature.toString('hex'));
    console.log('pubkey :', this.pubkey);
    console.log('pubkey_byte :', this.pubkey_byte.toString('hex'));
    console.log('keypair :', this.keypair);
    console.log('not_initialized :',this.not_initialized);
  }

  async add(signature, pub_key) {
    if (signature != null) {
      this.not_initialized = false;
      this.signature = signature;
    }

    if (pub_key != null) {
      this.pubkey = pub_key;
      this.pubkey_byte = await helper.create_pubkey_byte(pub_key);
      this.keypair = new KeyPair();
      this.keypair.set_key_pair(null, pub_key);
    }

    return true;
  }

  add_signature(signature) {
    this.signature = signature;
  }

  serialize() {
    const pubkey_len_bit = this.pubkey_byte.length * 8;
    const sig_len_bit = this.signature.length * 8;

    return {
      'key_type': this.key_type,
      'pubkey_len': pubkey_len_bit,
      'pubkey': this.pubkey_byte,
      'signature_len': sig_len_bit,
      'signature': new Buffer(this.signature),
    };
  }

  async deserialize(data) {
    this.key_type = data['key_type'];
    const pubkey = data['pubkey'];
    const signature = data['signature'];

    //65byteの鍵形式からJwkへ変換してinput
    await this.add(signature, this.convertRawHexKeyToJwk(pubkey, 'P-256'));
    return true;
  }

  async verify(digest) {
    if (this.keypair === null) {
      return false;
    }
    return await this.keypair.verify(digest, this.signature);
  }

  convertRawHexKeyToJwk(hexKeyObj, algorithm) {
    const len = 16;
    const offset = 1;
    const hexX = hexKeyObj.slice(offset, offset + len * 2);
    const hexY = hexKeyObj.slice(offset + len * 2, offset + len * 4);
    const b64uX = jseu.encoder.encodeBase64Url(hexX);
    const b64uY = jseu.encoder.encodeBase64Url(hexY);

    return { // https://www.rfc-editor.org/rfc/rfc7518.txt
      crv: algorithm,
      ext: true,
      kty: 'EC', // or "RSA", "oct"
      x: b64uX, // hex to base64url
      y: b64uY
    };
  }

}

