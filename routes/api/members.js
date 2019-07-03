const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const CustomersDAL = require('../../dal/CustomersDAL');

var customersDAL = new CustomersDAL();

router.get('/', async (req, res) => {
    var customers = await customersDAL.getAllCustomers();
    res.json(customers);
});

// Get Single Member
router.get('/:id', async (req, res) => {
    try
    {
        const member = await customersDAL.findById( req.params.id );
        if ( member ) {
            res.status(200).json(member);
        } else {
            res.status(400).json({msg:`Member ${req.params.id} not found`});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json( {msg:`Failed to obtain member with id ${req.params.id}`} );
    }
});

// Create a new member
router.post('/', async (req, res) => {
    const newMember = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }
    if (req.body.gender && req.body.gender !== "" ) {
        newMember.gender = req.body.gender;
    }
    if( !newMember.first_name || !newMember.last_name || !newMember.email ) {
        newMember.name = req.body.first_name + ' ' + req.body.last_name;
        return res.status(400).json({msg: 'Please include all required (*) fields'});
    }
    try {
        await customersDAL.addCustomer( newMember );
    } catch ( err ) {
        res.status(500).json({msg: 'Failed to add new member'});
    }
    res.status(201).json({msg:'Successfully added member'});
});

// Update single member
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    if ( !id ) {
        res.status(400).json({msg:'Status 400: cannot update member without identifier'});
    }

    const updateFields = {};
    
    if( req.body.first_name && req.body.first_name !== '' ) {
        updateFields.first_name = req.body.first_name;
    }
    if (req.body.last_name && req.body.last_name !== '' ) {
        updateFields.last_name = req.body.last_name;
    }
    if ( req.body.email && req.body.email !== '' ) {
        updateFields.email = req.body.email;
    }
    if ( req.body.gender && req.body.gender !== '' ) {
        if ( req.body.gender === 'remove' ) {
            updateFields.gender = '';
        } else {
            updateFields.gender = req.body.gender;
        }
    }
    try {
        await customersDAL.updateCustomer( id, updateFields );
        res.status(200).json({msg: `Status 200: Successfully updated ${id}`});
    } catch( err ) {
        res.status(500).json({msg: `500: Failed to update ${id}`});
    }
});

// Delete Member
router.delete('/:id', (req, res) => {
    const deleteFilter = { "_id": req.params.id };
    customersDAL.deleteCustomer( (err, success, numRemoved) => {
        if( success ) {
            res.status(200);
            res.json({msg: `Removed ${numRemoved} customers`});
        } else {
            res.status(400);
            res.json({msg: `Unable to delete customer with id  ${req.params.id }`});
        }
    }, deleteFilter );
});

module.exports = router;