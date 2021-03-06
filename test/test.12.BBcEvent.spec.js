import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
import jseu from 'js-encoding-utils';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcEvent`, () => {

  it('serialize and deserialize', async () => {
    console.log('***********************');
    console.log('Test for BBcEvent Class.');

    const asset_group_id = Buffer.from(await jscu.random.getRandomBytes(32));
    const bbcEvent = new bbclib.BBcEvent(asset_group_id);
    const user_id = Buffer.from(await jscu.random.getRandomBytes(32));
    const bbcAsset = new bbclib.BBcAsset(user_id);
    await bbcAsset.set_random_nonce();
    const asset_file = new Buffer(32);

    for(let i = 0; i < 32; i++){
      asset_file[i] = 0xFF & i;
    }

    const asset_body = new Buffer(32);
    for(let i = 0; i < 32; i++){
      asset_body[i] = 0xFF & (i + 32);
    }

    await bbcAsset.add_asset(asset_file, asset_body);

    bbcEvent.add_asset(bbcAsset);
    bbcEvent.add_asset_group_id(asset_group_id);
    bbcEvent.add_mandatory_approver(user_id);

    const serialize_event = bbcEvent.serialize();

    const event_deserialise = new bbclib.BBcEvent(asset_group_id);
    event_deserialise.deserialize(serialize_event);

    //bbcEvent.show_event();

    expect(bbcEvent.asset_group_id).to.be.eq(event_deserialise.asset_group_id);
    expect(bbcEvent.reference_indices).to.be.eq(event_deserialise.reference_indices);
    expect(bbcEvent.mandatory_approvers).to.be.eq(event_deserialise.mandatory_approvers);
    expect(bbcEvent.option_approver_num_numerator).to.be.eq(event_deserialise.option_approver_num_numerator);
    expect(bbcEvent.option_approver_num_denominator).to.be.eq(event_deserialise.option_approver_num_denominator);
    expect(bbcEvent.option_approvers).to.be.eq(event_deserialise.option_approvers);

    expect_uint8Array(bbcEvent.asset.asset_id,event_deserialise.asset.asset_id);
    expect_uint8Array(bbcEvent.asset.user_id,event_deserialise.asset.user_id);
    expect_uint8Array(bbcEvent.asset.nonce,event_deserialise.asset.nonce);
    expect_uint8Array(bbcEvent.asset.asset_file_digest,event_deserialise.asset.asset_file_digest);
    expect_uint8Array(bbcEvent.asset.asset_body,event_deserialise.asset.asset_body);

    expect(bbcEvent.asset.asset_file_size).to.be.eq(event_deserialise.asset.asset_file_size);
    expect(bbcEvent.asset.asset_body_type).to.be.eq(event_deserialise.asset.asset_body_type);
    expect(bbcEvent.asset.asset_body_size).to.be.eq(event_deserialise.asset.asset_body_size);

  });
});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}
