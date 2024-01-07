const express = require('express');
const router = express.Router();

const ExpenseModel = require('../../../models/expense');

router.post('/expense', async (req, res) => {
    const { name, description, address, price } = req.body;

    if (!name || !description || !address || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newExpense = new ExpenseModel({
            name,
            description,
            address,
            price,
        });

        const savedExpense = await newExpense.save();

        res.status(201).json({
            status: 'SUCCESS',
            data: savedExpense,
        });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/get_all_expenses', async (req, res) => {
    try {
        const allExpenses = await ExpenseModel.find();
        res.status(201).json({
            status: 'SUCCESS',
            data: allExpenses,
        });
    } catch (error) {
        console.error('Error getting all expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/update_expense/:id', async (req, res) => {
    const expenseId = req.params.id;
    const { name, description, address, price } = req.body;

    if (!name || !description || !address || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const updatedExpense = await ExpenseModel.findByIdAndUpdate(
            expenseId,
            { name, description, address, price },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(201).json({
            status: 'SUCCESS',
            data: updatedExpense,
        });
    } catch (error) {
        console.error('Error updating expense by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete_expense/:id', async (req, res) => {
    const expenseId = req.params.id;

    try {
        const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting expense by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;