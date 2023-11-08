const path = require('path');
const cors = require("cors");
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const helmet=require('helmet');
const morgan=require('morgan');

const User = require('./models/user');
const Expense = require('./models/expense');
const Orders = require('./models/orders');
const Forgotpasswords=require('./models/forgotpassword');
const Downloads=require('./models/downloads');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes=require('./routes/password');


const app = express();
//const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags: 'a'});

//app.use(helmet());
//app.use(morgan('combined',{stream: accessLogStream}));
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));


app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get('/expense', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main.html'));
})
app.get('/purchase', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main.html'));
})

app.get('/premium', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main.html'));
})
app.get('/password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Orders);
Orders.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Forgotpasswords);
Forgotpasswords.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

User.hasMany(Downloads);
Downloads.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

async function initiate() {
  try {
    await sequelize.sync();
    app.listen(3000, () => {
      console.log("Server is running at 3000");
    });
  } catch (error) {
    console.log(error);
  }
}
initiate();
