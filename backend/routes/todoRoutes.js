const express = require('express');
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo, addLog } = require('../controllers/todoController');

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.post('/:id/log', addLog);

module.exports = router;