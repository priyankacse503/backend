const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

const addExpense = async (req, res) => {
  const user = req.user;
  const { amount, description, category } = req.body;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const expense = await user.createExpense({ amount: amount, description: description, category: category }, { transaction });
    const totalExpenses = await Expense.sum('amount', { where: { UserId: user.id }, transaction });
    await user.update({ totalexpenses: totalExpenses }, { transaction });
    await transaction.commit();
    res.status(201).json({ allExpenses: expense, message: 'Data added successfully' });
  }
  catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: err })
  }
}

const getExpenses = async (request, response, next) => {
  try {
    //const expenses = await Expense.findAll();
   
    const page = request.query.page;
    const limit = Number(request.query.noitem);
    const offset = (page - 1) * 5;
    const user = request.user;
    const expenses = await user.getExpenses({ offset: offset, limit: limit });
    response.status(200).json({
      allExpenses: expenses,
      totalexpenses: user.totalexpenses,
      hasMoreExpenses: expenses.length === limit,
      hasPreviousExpenses: page > 1
    });

  } catch (error) {
    console.log(error);
    return response.status(401).json({ message: 'Fetching Data Failed' });
  }
}

const deleteExpense = async (request, response, next) => {
   let transaction;
  try {
    transaction = await sequelize.transaction();
    const dID = request.params.id;
    const user = request.user;
    const result = await Expense.destroy({ where: { id: dID, userId: request.user.id }, transaction });
    const totalExpenses = await Expense.sum('amount', { where: { UserId: user.id }, transaction });
    if (totalExpenses) await user.update({ totalexpenses: totalExpenses }, { transaction });
    else await user.update({ totalexpenses: 0 });
    if (result == 0) {
      return response.status(401).json({ message: 'You are not Authorized' });
    } else {
      response.status(200).json({ message: 'Succeffully deleted' });
    }
    await transaction.commit();
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
  }
}
module.exports = {
  addExpense,
  getExpenses,
  deleteExpense
}