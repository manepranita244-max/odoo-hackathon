const Expense = require("../models/Expense");

async function addExpense(req, res) {

    try {

        const expense = new Expense(req.body);

        await expense.save();

        res.status(201).json({

            message: "Expense Added Successfully",

            expense

        });

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

async function getAllExpenses(req, res) {

    try {

        const expenses = await Expense.find().populate("vehicle");

        res.status(200).json(expenses);

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

module.exports = {

    addExpense,

    getAllExpenses

};