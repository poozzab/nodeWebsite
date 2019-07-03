const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const exphbs = require('express-handlebars');
const members = require('./Members');
const CustomersDAL = require('./dal/CustomersDAL');

const customersDAL = new CustomersDAL();

const app = express();

// Init middleware
//app.use(logger);

// Handlebars middleware
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Homepage route
app.get('/', async (req, res) => {
    var viewModel = { title: 'Members App' }
    viewModel.members = await customersDAL.getAllCustomers();
    res.render('index', viewModel );
});

app.get('/about', (req, res) => {
    res.render('about', { title:'About the Author', authorInfo: require('./viewmodel/AuthorInfo')});
});

app.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    var viewModel = { title: 'Update Member' };
    const member = await customersDAL.findById(id);
    if ( !member ) {
        res.status(400).json({msg:'Could not find requested member'});
    } else {
        viewModel = {...viewModel,...member};
        res.render('update', viewModel);
    }
});

// would not have the below using static along with the app.get('/'...) above

// Set static folder, this is used in lieu of having to write the get command myself
//app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public/js'));
app.use(express.static('public/'));

// Members api routes
app.use('/api/members', require('./routes/api/members') );

const PORT = process.env.PORT || 5000;

app.listen( PORT, () => {
    console.log(`Server started on ${PORT}`);
});