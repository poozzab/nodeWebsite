var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
var MongoClient = mongodb.MongoClient;
var Db = mongodb.Db;
var Server = mongodb.Server;

var dburl = "mongodb://localhost:27017/";
var dockerURL = "mongodb://192.168.99.104:27017";

class MongoDBClient {
    constructor( dbname, collectionName, url=dockerURL ) {
        this.dbname = dbname;
        this.collectionName = collectionName;
        this.url = url;
        this.db = null;
        this.dbo = null;
    }

    async initializeDB() {
        this.db = await mongodb.MongoClient.connect( this.url );
        this.dbo = this.db.db(this.dbname);
    }

    async findInCollection( findFilter={} ) {
        if ( !this.db ) await this.initializeDB();
        return this.dbo.collection( this.collectionName ).find(findFilter).toArray();
    };

    async findOneInCollection( findFilter={}) {
        if ( !this.db ) await this.initializeDB();
        return await this.dbo.collection( this.collectionName ).findOne(findFilter);
    }

    async findById( id ) {
        if ( !this.db ) await this.initializeDB();
        return await this.dbo.collection( this.collectionName ).findOne({_id: new ObjectId(id)});
    }

    async getAllInCollection() {
        if ( !this.db ) await this.initializeDB();
        return this.dbo.collection( this.collectionName ).find().toArray();
    }

    async addToCollection( newEntry ) {
        if( !this.db ) await this.initializeDB();
        try {
            await this.dbo.collection(this.collectionName).insertOne(newEntry);
        } catch ( err ) {
            console.log(`Failed to add ${newEntry} to ${this.collectionName}`);
            throw err;
        }
        return true;
    }

    async updateInCollection( id, newProperties ) {
        if( !this.db ) await this.initializeDB();
        try {
            await this.dbo.collection(this.collectionName).updateOne({_id:new ObjectId(id)},{$set: newProperties} );
        } catch ( err ) {
            console.log(`Failed to update ${id}`);
            console.error(err);
            throw err;
        }
        return true;
    }

    async deleteById( id ) {
        if( !this.db ) await this.initializeDB();
        try {
            await this.dbo.collection( this.collectionName ).deleteOne({_id:new ObjectId(id)});
        } catch ( err ) {
            console.log(`Failed to delete ${id}`);
            throw err;
        }
        return true;
    }
}

module.exports = MongoDBClient;