import { BBcAsset } from './BBcAsset.js';
import * as para from '../parameter.js';

export class BBcEvent{
  constructor(asset_group_id) {
    this.id_length = para.DefaultLength.BBcOne;
    this.asset_group_id = asset_group_id;
    this.reference_indices = [];
    this.mandatory_approvers = [];
    this.option_approver_num_numerator = 0;
    this.option_approver_num_denominator = 0;
    this.option_approvers = [];
    this.asset = null;
  }

  show_event() {
    console.log('------show_event-------');

    console.log('id_length :',this.id_length);
    console.log('asset_group_id :',this.asset_group_id.toString('hex'));
    if (this.reference_indices.length > 0) {
      for (let i = 0; i < this.reference_indices.length; i++) {
        console.log('reference_indices[', i, '] :',this.reference_indices[i]);
      }
    }

    if (this.mandatory_approvers.length > 0) {
      for (let i = 0; i < this.mandatory_approvers.length; i++) {
        console.log('mandatory_approvers[', i, '] :', this.mandatory_approvers[i].toString('hex'));
      }
    }

    console.log('option_approver_num_numerator :',this.option_approver_num_numerator);
    console.log('option_approver_num_denominator :',this.option_approver_num_denominator);
    console.log('option_approvers :',this.option_approvers);
    if (this.asset != null) {
      console.log('asset :', this.asset.show_asset());

    }
    console.log('------show_event end-------');
  }

  add_asset_group_id(asset_group_id) {
    this.asset_group_id = asset_group_id;
  }

  add_reference_indices(reference_indices) {
    this.reference_indices.push(reference_indices);
  }

  add_mandatory_approver(mandatory_approver) {
    this.mandatory_approvers.push(mandatory_approver);
  }

  add_option_approver_num_numerator(option_approver_num_numerator) {
    this.option_approver_num_numerator = option_approver_num_numerator;
  }

  add_option_approver_num_denominator(option_approver_num_denominator) {
    this.option_approver_num_denominator = option_approver_num_denominator;
  }

  add_option_approver(option_approver) {
    this.option_approver = option_approver;
  }

  add_asset(asset) {
    this.asset = asset;
  }

  serialize() {
    let asset = null;
    if (this.asset != null) {
      asset = this.asset.serialize(false);
    }
    return {
      'asset_group_id': this.asset_group_id,
      'reference_indices': this.reference_indices,
      'mandatory_approvers': this.mandatory_approvers,
      'option_approver_num_numerator': this.option_approver_num_numerator,
      'option_approver_num_denominator': this.option_approver_num_denominator,
      'option_approvers': this.option_approvers,
      asset
    };
  }

  deserialize(data) {
    this.asset_group_id = data['asset_group_id'];
    this.reference_indices = data['reference_indices'];
    this.mandatory_approvers = data['mandatory_approvers'];
    this.option_approver_num_numerator = data['option_approver_num_numerator'];
    this.option_approver_num_denominator = data['option_approver_num_denominator'];
    this.option_approvers = data['option_approvers'];
    const asset = data['asset'];
    if (asset === null) {
      this.asset = null;
    } else {
      this.asset = new BBcAsset('');
      this.asset.deserialize(asset);
    }
    return true;
  }

}
