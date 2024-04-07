const express = require('express');
const app = express();
const port = 3000;
const ejs = require('ejs'); // Including EJS to avoid reference errors
const path = require('path');
const fs = require('fs');

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies and to serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Mock database
let accounts = [
  { id: 102345, customerId: 10501, balance: 3245, type: 'chequing' },
  { id: 102348, customerId: 10501, balance: 15234, type: 'savings' },
  { id: 102351, customerId: 10501, balance: 50000, type: 'investment' },
  { id: 102354, customerId: 10501, balance: 120000, type: 'retirement' },
  { id: 102357, customerId: 10504, balance: 8750, type: 'chequing' },
  { id: 102360, customerId: 10504, balance: 21500, type: 'savings' },
  { id: 102363, customerId: 10504, balance: 55000, type: 'investment' },
  { id: 102366, customerId: 10504, balance: 130000, type: 'retirement' },
  { id: 102369, customerId: 10507, balance: 9800, type: 'chequing' },
  { id: 102372, customerId: 10507, balance: 24000, type: 'savings' },
  { id: 102375, customerId: 10507, balance: 60000, type: 'investment' },
  { id: 102378, customerId: 10507, balance: 150000, type: 'retirement' },
  { id: 102381, customerId: 10510, balance: 11200, type: 'chequing' },
  { id: 102384, customerId: 10510, balance: 26000, type: 'savings' },
  { id: 102387, customerId: 10510, balance: 70000, type: 'investment' },
  { id: 102390, customerId: 10510, balance: 175000, type: 'retirement' },
  { id: 102393, customerId: 10513, balance: 13400, type: 'chequing' },
  { id: 102396, customerId: 10513, balance: 28000, type: 'savings' },
  { id: 102399, customerId: 10513, balance: 75000, type: 'investment' },
  { id: 102402, customerId: 10513, balance: 200000, type: 'retirement' },
  { id: 102405, customerId: 10516, balance: 14500, type: 'chequing' },
  { id: 102408, customerId: 10516, balance: 30500, type: 'savings' },
  { id: 102411, customerId: 10516, balance: 82000, type: 'investment' },
  { id: 102414, customerId: 10516, balance: 225000, type: 'retirement' },
  { id: 102417, customerId: 10519, balance: 15700, type: 'chequing' },
  { id: 102420, customerId: 10519, balance: 32000, type: 'savings' },
  { id: 102423, customerId: 10519, balance: 88000, type: 'investment' },
  { id: 102426, customerId: 10519, balance: 250000, type: 'retirement' },
  // Additional generated data
  { id: 102429, customerId: 10522, balance: 16500, type: 'chequing' },
  { id: 102432, customerId: 10522, balance: 33500, type: 'savings' },
  { id: 102435, customerId: 10522, balance: 91000, type: 'investment' },
  { id: 102438, customerId: 10522, balance: 275000, type: 'retirement' },
  { id: 102441, customerId: 10525, balance: 17800, type: 'chequing' },
  { id: 102444, customerId: 10525, balance: 35000, type: 'savings' },
  { id: 102447, customerId: 10525, balance: 94000, type: 'investment' },
  { id: 102450, customerId: 10525, balance: 300000, type: 'retirement' },
  { id: 102453, customerId: 10528, balance: 19000, type: 'chequing' },
  { id: 102456, customerId: 10528, balance: 36500, type: 'savings' },
  { id: 102459, customerId: 10528, balance: 98000, type: 'investment' },
  { id: 102462, customerId: 10528, balance: 325000, type: 'retirement' },
];

let customers = [
  { id: 10501, name: 'Olivia Smith' },
  { id: 10504, name: 'Ethan Johnson' },
  { id: 10507, name: 'Michael Smith' },
  { id: 10510, name: 'Sarah Johnson' },
  { id: 10513, name: 'Robert Williams' },
  { id: 10516, name: 'Emily Brown' },
  { id: 10519, name: 'Christopher Davis' },
  { id: 10522, name: 'Patricia Wilson' },
  { id: 10525, name: 'Linda Martinez' },
  { id: 10528, name: 'James Rodriguez' },
];

// Get all accounts
app.get('/accounts', (req, res) => {
  if (req.accepts('html')) {
    // Render a template if HTML is requested
    res.render('layout', {
      bodyTemplate: 'accounts',
      accounts: accounts
    });
  } else if (req.accepts('json')) {
    // Respond with JSON if JSON is requested
    res.json(accounts);
  } else {
    // Default to JSON if no preference
    res.json(accounts);
  }
});

app.get('/', (req, res) => {
  res.render('layout', {
    bodyTemplate: 'index'
  });
});

// Get accounts by customer ID
app.get('/accounts/customer/:customerId', (req, res) => {
  const customerAccounts = accounts.filter(acc => acc.customerId === parseInt(req.params.customerId));
  if (req.accepts('html')) {
    const customer = customers.find(c => c.id === parseInt(req.params.customerId));
    res.render('layout', {
      bodyTemplate: 'customerAccounts',
      accounts: customerAccounts,
      customer: customer
    });
  } else {
    res.json(customerAccounts);
  }
});

// List customers
app.get('/customers', (req, res) => {
  if (req.accepts('html')) {
    res.render('layout', {
      bodyTemplate: 'customers',
      customers: customers
    });
  } else {
    res.json(customers);
  }
});

// Search customers by name
app.get('/customers/search/:name', (req, res) => {
  const customer = customers.find(c => c.name.toLowerCase() === req.params.name.toLowerCase());
  if (customer) {
    res.json({ id: customer.id, name: customer.name });
  } else {
    res.status(404).send('Customer not found');
  }
});

// Transfer money between accounts
app.post('/transfer', (req, res) => {
  const { fromId, toId, amount } = req.body;
  console.log(req.body);
  const fromAccount = accounts.find(acc => acc.id === parseInt(fromId));
  const toAccount = accounts.find(acc => acc.id === parseInt(toId));
  console.log(`Received Transfer IDs: From Account ID: ${fromId}, To Account ID: ${toId}`);
  if (!fromAccount || !toAccount) {
    return res.status(404).send('One or both accounts not found');
  }

  if (fromAccount.balance < amount) {
    return res.status(400).send('Insufficient funds');
  }

  fromAccount.balance -= parseInt(amount);
  toAccount.balance += parseInt(amount);

  if (req.accepts('html')) {
    res.redirect('/accounts');
  } else {
    res.json({ fromAccount, toAccount });
  }
});

app.get('/transfer', (req, res) => {
  res.render('layout', {
    bodyTemplate: 'transfer'
  });
});

app.listen(port, () => {
  console.log(`Bank app listening at http://localhost:${port}`);
});

