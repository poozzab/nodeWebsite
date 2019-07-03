var MongoDBClient = require('./MongoDBClient');

var dbname = 'mycustomers';
var collectionName = 'customers';

class CustomersDal {
    constructor() {
        this.mongoClient = new MongoDBClient(dbname);
    }

    async findCustomer( findFilter={}) {
        return await this.mongoClient.findInCollection( collectionName, findFilter);
    }

    async findOneCustomer( findFilter={}) {
        return await this.mongoClient.findOneInCollection( collectionName, findFilter );
    }

    async findById(id) {
        return await this.mongoClient.findById( collectionName, id );
    }

    async getAllCustomers() {
        return await this.mongoClient.getAllInCollection( collectionName );
    }

    async addCustomer(customer) {
        return await this.mongoClient.addToCollection( customer, collectionName );
    }

    async updateCustomer(id, newProperties) {
        return await this.mongoClient.updateInCollection( id, newProperties, collectionName );
    }

    async deleteCustomer(id) {
        return await this.mongoClient.deleteCustomer( collectionName, id );
    }
}

module.exports = CustomersDal;