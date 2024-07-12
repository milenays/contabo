/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createTodo, getTodos, updateTodo, deleteTodo, addLog } from '../api/todoApi';
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { SortableItem } from '../components/SortableItem';
import { TaskCard } from '../components/TaskCard';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [columns] = useState([
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTodos = useCallback(async () => {
    try {
      const response = await getTodos();
      console.log('Fetched todos:', response.data); // Debug için
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch todos. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchTodos();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeId = active.id;
      const overId = over.id;

      const activeIndex = todos.findIndex((todo) => todo._id === activeId);
      
      if (activeIndex !== -1) {
        const updatedTodos = [...todos];
        const [movedTodo] = updatedTodos.splice(activeIndex, 1);
        const oldStatus = movedTodo.status;
        
        // Determine the new status based on the column it was dropped into
        let newStatus;
        if (columns.some(col => col.id === overId)) {
          // If dropped onto an empty column
          newStatus = overId;
        } else {
          // If dropped onto another todo
          const overIndex = updatedTodos.findIndex((todo) => todo._id === overId);
          newStatus = overIndex !== -1 ? updatedTodos[overIndex].status : oldStatus;
        }
        
        movedTodo.status = newStatus;

        const newIndex = updatedTodos.findIndex(todo => todo.status === newStatus);
        if (newIndex !== -1) {
          updatedTodos.splice(newIndex, 0, movedTodo);
        } else {
          updatedTodos.push(movedTodo);
        }
        
        setTodos(updatedTodos);
        
        try {
          const response = await updateTodo(movedTodo._id, { status: newStatus });
          
          if (response.data) {
            setTodos(prevTodos => 
              prevTodos.map(todo => 
                todo._id === movedTodo._id ? response.data : todo
              )
            );
            
            toast({
              title: "Success",
              description: `Todo moved from ${oldStatus} to ${newStatus}`,
            });
          }
        } catch (error) {
          console.error('Error updating todo status:', error);
          toast({
            title: "Error",
            description: "Failed to update todo status. Please try again.",
            variant: "destructive",
          });
          // Revert the changes if the API call fails
          setTodos(prevTodos => {
            const revertedTodos = [...prevTodos];
            const revertIndex = revertedTodos.findIndex(todo => todo._id === movedTodo._id);
            if (revertIndex !== -1) {
              revertedTodos.splice(revertIndex, 1);
            }
            movedTodo.status = oldStatus;
            revertedTodos.splice(activeIndex, 0, movedTodo);
            return revertedTodos;
          });
        }
      }
    }
  };

  const handleTodoSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const todoData = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      dueDate: formData.get('dueDate'),
    };

    console.log('Submitting todo:', todoData); // Debug için

    try {
      if (selectedTodo) {
        const response = await updateTodo(selectedTodo._id, todoData);
        setTodos(prevTodos => prevTodos.map(todo => todo._id === selectedTodo._id ? response.data : todo));
        toast({
          title: "Success",
          description: "Todo updated successfully",
        });
      } else {
        const response = await createTodo(todoData);
        setTodos(prevTodos => [...prevTodos, response.data]);
        toast({
          title: "Success",
          description: "Todo created successfully",
        });
      }
      setIsDialogOpen(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error('Error saving todo:', error);
      toast({
        title: "Error",
        description: "Failed to save todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddLog = async (todoId, logMessage) => {
    if (!todoId) {
      console.error('Todo ID is undefined');
      toast({
        title: "Error",
        description: "Failed to add log. Invalid todo ID.",
        variant: "destructive",
      });
      return;
    }
    try {
      const updatedTodo = await addLog(todoId, { message: logMessage });
      setTodos(todos.map(todo => todo._id === todoId ? updatedTodo.data : todo));
      toast({
        title: "Success",
        description: "Log added successfully",
      });
    } catch (error) {
      console.error('Error adding log:', error);
      toast({
        title: "Error",
        description: "Failed to add log. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>
      <Button onClick={() => { setSelectedTodo(null); setIsDialogOpen(true); }} className="mb-6 w-full">
        Add New Todo
      </Button>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id} id={column.id} className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[200px]">
              <h2 className="text-xl font-semibold mb-4 text-center">{column.title}</h2>
              <SortableContext
                items={todos.filter(todo => todo.status === column.id).map(todo => todo._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {todos
                    .filter(todo => todo.status === column.id)
                    .map(todo => (
                      <SortableItem key={todo._id} id={todo._id}>
                        <TaskCard
                          task={todo}
                          onEdit={() => { setSelectedTodo(todo); setIsDialogOpen(true); }}
                          onDelete={() => handleDeleteTodo(todo._id)}
                          onAddLog={(logMessage) => handleAddLog(todo._id, logMessage)}
                        />
                      </SortableItem>
                    ))
                  }
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTodoSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={selectedTodo?.title} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={selectedTodo?.description} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedTodo?.status || 'todo'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={selectedTodo?.dueDate} />
            </div>
            <Button type="submit" className="w-full">{selectedTodo ? 'Update' : 'Create'} Todo</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoPage;