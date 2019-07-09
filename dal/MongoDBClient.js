var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
var MongoClient = mongodb.MongoClient;
var Db = mongodb.Db;
var Server = mongodb.Server;

var dburl = "mongodb://localhost:27017/";
var dockerURL = "mongodb://192.168.99.104:27017";

class MongoDBClient {
    constructor( dbname, collectionName=null, url=dockerURL ) {
        this.dbname = dbname;
        this.collectionName = collectionName;
        this.url = url;
        this.db = null;
        this.dbo = null;
        this.collection = null;
    }

    async initializeDB() {
        this.db = await mongodb.MongoClient.connect( this.url );
        this.dbo = this.db.db(this.dbname);
        await this.setCollection();
    }

    async setCollection() {
        if ( this.collectionName ) {
            this.collection = this.dbo.collection( this.collectionName );
        }
    }

    setCollectionName( collectionName ) {
        this.collectionName = collectionName;
        this.setCollection();
    }

    async findInCollection( findFilter={} ) {
        if ( !this.db && !this.db.isConnected() ) await this.initializeDB();
        if ( !this.collection ) throw new Error('No Collection set');
        return this.collection.find(findFilter).toArray();
    };

    async findOneInCollection( findFilter={}) {
        if ( !this.db && !this.db.isConnected() ) await this.initializeDB();
        if ( !this.collection ) throw new Error('No Collection set');
        return await this.collection.findOne(findFilter);
    }

    async findById( id ) {
        if ( !this.db && !this.db.isConnected() ) await this.initializeDB();
        if ( !this.collection ) throw new Error('No Collection set');
        return await this.collection.findOne({_id: new ObjectId(id)});
    }

    async getAllInCollection() {
        if ( !this.db && !this.db.isConnected() ) await this.initializeDB();
        if ( !this.collection ) throw new Error('No Collection set');
        return this.collection.find().toArray();
    }

    async addToCollection( newEntry ) {
        if( !this.db && !this.db.isConnected() ) await this.initializeDB();
        if ( !this.collection ) throw new Error('No Collection set');
        try {
            await this.collection.insertOne(newEntry);
        } catch ( err ) {
            console.log(`Failed to add ${newEntry} to ${this.collectionName}`);
            throw err;
        }
        return true;
    }

    async updateInCollection( id, newProperties ) {
        if( !this.db && !this.db.isConnected() ) await this.initializeDB();
        if ( !this.collection ) throw new Error('No Collection set');
        try {
            await this.collection.updateOne({_id:new ObjectId(id)},{$set: newProperties} );
        } catch ( err ) {
            console.log(`Failed to update ${id}`);
            console.error(err);
            throw err;
        }
        return true;
    }

    async deleteById( id ) {
        if( !this.db && !this.db.isConnected() ) await this.initializeDB();
        if ( !this.collection ) throw new Error('No Collection set');
        try {
            await this.collection.deleteOne({_id:new ObjectId(id)});
        } catch ( err ) {
            console.log(`Failed to delete ${id}`);
            throw err;
        }
        return true;
    }
}

module.exports = MongoDBClient;