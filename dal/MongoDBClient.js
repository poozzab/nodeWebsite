var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
var MongoClient = mongodb.MongoClient;
var Db = mongodb.Db;
var Server = mongodb.Server;

var dburl = "mongodb://localhost:27017/";

class MongoDBClient {
    constructor( dbname, url=dburl ) {
        this.dbname = dbname;
        this.url = url;
        this.db = null;
        this.dbo = null;
    }

    async initializeDB() {
        this.db = await mongodb.MongoClient.connect( dburl );
        this.dbo = this.db.db(this.dbname);
    }

    async findInCollection( collectionName, findFilter={} ) {
        if ( !this.db ) await this.initializeDB();
        return this.dbo.collection( collectionName ).find(findFilter).toArray();
    };

    async findOneInCollection( collectionName, findFilter={}) {
        if ( !this.db ) await this.initializeDB();
        return await this.dbo.collection( collectionName ).findOne(findFilter);
    }

    async findById( collectionName, id ) {
        if ( !this.db ) await this.initializeDB();
        return await this.dbo.collection( collectionName ).findOne({_id: new ObjectId(id)});
    }

    async getAllInCollection( collectionName ) {
        if ( !this.db ) await this.initializeDB();
        return this.dbo.collection( collectionName ).find().toArray();
    }

    async addToCollection( newEntry, collectionName ) {
        if( !this.db ) await this.initializeDB();
        try {
            await this.dbo.collection(collectionName).insertOne(newEntry);
        } catch ( err ) {
            console.log(`Failed to add ${newEntry} to ${collectionName}`);
            throw err;
        }
        return true;
    }

    async updateInCollection( id, newProperties, collectionName ) {
        if( !this.db ) await this.initializeDB();
        try {
            await this.dbo.collection(collectionName).findOneAndUpdate({_id:new ObjectId(id)},newProperties);
        } catch ( err ) {
            console.log(`Failed to update ${id}`);
            console.error(err);
            throw err;
        }
        return true;
    }

    async deleteCustomer( collectionName, id ) {
        if( !this.db ) await this.initializeDB();
        try {
            await this.dbo.collection( collectionName ).deleteOne({_id:new ObjectId(id)});
        } catch ( err ) {
            console.log(`Failed to delete ${id}`);
            throw err;
        }
        return true;
    }
}

module.exports = MongoDBClient;