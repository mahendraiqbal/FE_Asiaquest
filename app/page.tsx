'use client';

import { useEffect, useState } from 'react';
import { Todo, TodoInput } from '@/types/todo';
import { todoService } from './services/todoService';
import TodoItem from './components/TodoItem';
import Swal from 'sweetalert2';
import { Plus } from 'lucide-react'; // Import icon untuk tombol Add

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch todos',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const showTodoForm = async (todo?: Todo) => {
    const { value: formValues } = await Swal.fire({
      title: todo ? 'Edit Todo' : 'Add New Todo',
      html: `
        <input 
          id="swal-input1" 
          class="swal2-input" 
          placeholder="Title" 
          value="${todo?.title || ''}"
        >
        <textarea 
          id="swal-input2" 
          class="swal2-textarea" 
          placeholder="Description"
        >${todo?.description || ''}</textarea>
        <div class="swal2-checkbox-container">
          <input 
            type="checkbox" 
            id="swal-input3" 
            class="swal2-checkbox" 
            ${todo?.completed ? 'checked' : ''}
          >
          <label for="swal-input3">Completed</label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: todo ? 'Update' : 'Create',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const title = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const description = (document.getElementById('swal-input2') as HTMLTextAreaElement).value;
        const completed = (document.getElementById('swal-input3') as HTMLInputElement).checked;
        
        if (!title.trim()) {
          Swal.showValidationMessage('Title is required');
          return false;
        }
        
        return {
          title,
          description,
          completed
        };
      }
    });

    if (formValues) {
      if (todo) {
        await handleUpdate(todo.id, formValues);
      } else {
        await handleCreate(formValues);
      }
    }
  };

  const handleCreate = async (todo: TodoInput) => {
    try {
      await todoService.createTodo(todo);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Todo created successfully',
        showConfirmButton: false,
        timer: 1500
      });
      fetchTodos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create todo',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleUpdate = async (id: number, todo: TodoInput) => {
    try {
      await todoService.updateTodo(id, todo);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Todo updated successfully',
        showConfirmButton: false,
        timer: 1500
      });
      fetchTodos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update todo',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await todoService.deleteTodo(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Todo has been deleted.',
          showConfirmButton: false,
          timer: 1500
        });
        fetchTodos();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete todo',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await todoService.updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed
      });
      
      // Optional: Tampilkan notifikasi kecil
      Swal.fire({
        icon: 'success',
        title: todo.completed ? 'Task unmarked' : 'Task completed',
        showConfirmButton: false,
        timer: 1000,
        position: 'top-end',
        toast: true
      });
      
      fetchTodos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update todo status',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <button
          onClick={() => showTodoForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Todo
        </button>
      </div>

      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onEdit={() => showTodoForm(todo)}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>
    </main>
  );
}