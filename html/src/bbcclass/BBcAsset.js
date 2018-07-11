const DEFAULT_ID_LEN = 8;
import jscu from "js-crypto-utils";

var BSON = require('bson');
let bson = new BSON();

export default class {
    constructor(user_id){
        this.id_length = DEFAULT_ID_LEN;
        this.user_id = user_id; // byte
        this.asset_id = null;
        this.nonce = null; // byte
        this.asset_file_size = 0;
        this.asset_file = null;
        this.asset_file_digest = null;
        this.asset_body_size = 0;
        this.asset_body = null; // byte

    }

    showAsset(){
        console.log("---------showAsset--------");
        if (this.asset_id != null){
            console.log("this.asset_id");
            this.print_bin(this.asset_id);
        }
        console.log("this.user_id");
        console.log(this.user_id);
        console.log("this.nonce");
        console.log(this.nonce);
        console.log("this.asset_file_size");
        console.log(this.asset_file_size);
        console.log("this.asset_file");
        console.log(this.asset_file);
        console.log("this.asset_file_digest");
        console.log(this.asset_file_digest);
        console.log("this.asset_body_size");
        console.log(this.asset_body_size);
        console.log("this.asset_body");
        console.log(this.asset_body);
        console.log("--------------------------");

    }

    async setRandomNonce(){
        this.nonce = await get_random_value(32);
    }

    setNonce(nonce){
        this.nonce = nonce;
    }

    add_user_id(user_id){
        if (user_id != null) {
            this.user_id = user_id
        }
    }

    async add_asset( asset_file, asset_body){
        //"""Add parts in this object"""
        if(asset_file !== null) {
            this.asset_file = asset_file;
            this.asset_file_size = asset_file.length;
            this.asset_file_digest = await jscu.crypto.hash.getHash('SHA-256', asset_file);
        }

        if(asset_body !== null) {
            this.asset_body = asset_body;
            this.asset_body_size = asset_body.length;
        }
        await this.digest();

        return true;
    }

    async digest(){
        let target = this.serialize(true);
        this.asset_id = new Buffer(await jscu.crypto.hash.getHash('SHA-256', target)).slice(0,this.id_length);
        return this.asset_id;
    }

    async set_asset_id(){
        let target = this.serialize(true);
        this.asset_id = await jscu.crypto.hash.getHash('SHA-256', target);
        return this.asset_id;
    }

    get_asset_file(){
        return this.asset_file;
    }

    get_asset_file_digest(){
        return this.asset_file_digest;
    }

    get_asset_digest(){

        return this.asset_file_digest;
    }

    async check_asset_file(asset_file, id_length){
        let digest = await jscu.crypto.hash.getHash('SHA-256', asset_file);
        if(digest === this.asset_file_digest){
            return true;
        }else{
            return false;
        }
    }

    serialize(for_digest_calculation){

        if (for_digest_calculation == true){
            return bson.serialize({
                'user_id': this.user_id,
                'nonce': this.nonce,
                'asset_file_size': this.asset_file_size,
                'asset_file_digest': this.asset_file_digest,
                'asset_body_size': this.asset_body_size,
                'asset_body': this.asset_body
            })

        }else{
            return {
                'asset_id': this.asset_id,
                'user_id': this.user_id,
                'nonce': this.nonce,
                'asset_file_size': this.asset_file_size,
                'asset_file_digest': this.asset_file_digest,
                'asset_body_size': this.asset_body_size,
                'asset_body': this.asset_body
            }
        }
    }

    // TODO: もし値がないときにnullなどを入れる。という処理を入れる
    deserialize(data){
        this.asset_id = data['asset_id'];
        this.user_id = data['user_id'];
        this.nonce = data['nonce'];
        this.asset_file_size = data['asset_file_size'];
        this.asset_file_digest = data['asset_file_digest'];
        this.asset_body_size = data['asset_body_size'];
        this.asset_body = data['asset_body'];
        return true;
    }

    print_bin(bin){
        let d = "";
        for (let i = 0; i < bin.length ; i++){
            if (bin[i] < 16){
                d += "0";
            }
            d += bin[i].toString(16);
        }
        console.log(d);
    }
}

async function get_random_value(num){
    const msg = await jscu.crypto.random.getRandomBytes(num);
    const digest = await jscu.crypto.hash.getHash('SHA-256', msg);
    return digest;
};

