import { BBcAsset } from './BBcAsset.js';
import { BBcPointer } from './BBcPointer.js';
import * as para from '../parameter.js';
import { Buffer } from 'buffer';

export class BBcRelation{
  constructor(asset_group_id) {
    this.id_length = para.DefaultLength.BBcOne;
    if (asset_group_id != null) {
      this.asset_group_id = asset_group_id;
    } else {
      this.asset_group_id = new Buffer(this.id_length);
    }

    this.pointers = [];
    this.asset = null;
  }

  show_relation() {
    console.log('asset_group_id :',this.asset_group_id.toString('hex'));
    if (this.pointers.length > 0) {
      for (let i = 0; i < this.pointers.length; i++) {
        console.log('pointers[',i,'] :',this.pointers[i].show_pointer());
      }
    }

    if (this.asset != null) {
      console.log('asset');
      this.asset.show_asset();
    }
  }

  add_asset_group_id(asset_group_id) {
    if (asset_group_id != null) {
      this.asset_group_id = asset_group_id;
    }
  }

  set_asset(asset) {
    this.asset = asset;
  }

  add_pointer(pointer) {
    if (pointer != null) {
      this.pointers.push(pointer);
    }
  }

  serialize() {
    let asset = null;
    if (this.asset != null) {
      asset = this.asset.serialize();
    }

    const pointer = [];
    if (this.pointers.length > 0) {
      for (let i = 0; i < this.pointers.length; i++) {
        pointer.push(this.pointers[i].serialize());
      }
    }

    return {
      'asset_group_id': this.asset_group_id,
      'pointers': pointer,
      asset
    };
  }

  deserialize(data) {
    this.asset_group_id = data['asset_group_id'];
    const ptrdat = data['pointers'];
    if (ptrdat.length > 0) {
      for (let i = 0; i < ptrdat.length; i++) {
        const ptr = new BBcPointer(null, null);
        ptr.deserialize(ptrdat[i]);
        this.pointers.push(ptr);
      }
    }

    const assetdat = data['asset'];
    if (assetdat != null) {

      this.asset = new BBcAsset(null);
      this.asset.deserialize(assetdat);
    }
    return true;
  }

}

