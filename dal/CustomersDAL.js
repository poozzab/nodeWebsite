var MongoDBClient = require('./MongoDBClient');

var dbname = 'mycustomers';
var collectionName = 'customers';

class CustomersDal {
    constructor() {
        this.mongoClient = new MongoDBClient(dbname, collectionName );
    }

    async findCustomer( findFilter={}) {
        return await this.mongoClient.findInCollection( findFilter );
    }

    async findOneCustomer( findFilter={}) {
        return await this.mongoClient.findOneInCollection( findFilter );
    }

    async findById(id) {
        return await this.mongoClient.findById( id );
    }

    async getAllCustomers() {
        return await this.mongoClient.getAllInCollection();
    }

    async addCustomer(customer) {
        return await this.mongoClient.addToCollection( customer );
    }

    async updateCustomer(id, newProperties) {
        return await this.mongoClient.updateInCollection( id, newProperties );
    }

    async deleteCustomer(id) {
        return await this.mongoClient.deleteById( id );
    }
}

module.exports = CustomersDal;