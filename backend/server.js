const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/hari-db')
    .then(() => {
        console.log("Database connection successful");
    }).catch((err) => {
        console.log(err);
    });

// Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
});

// Model creation
const todoModel = mongoose.model('Todo', todoSchema);
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Create an item (POST)
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
    }

    try {
        const newItem = new todoModel({ title, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all items (GET)
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving todos" });
    }
});

// Update an item (PUT)
app.put('/todos/:id', async (req, res) => {
    const { title, description } = req.body;
    const id = req.params.id;

    try {
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true } // Return the updated document
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating todo" });
    }
});

// Delete an item (DELETE)
app.delete("/todos/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTodo = await todoModel.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting todo" });
    }
});

// Listen on port
app.listen(port, () => {
    console.log(port + " is running");
});
