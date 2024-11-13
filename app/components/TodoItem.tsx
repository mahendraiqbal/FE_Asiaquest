'use client';

import { Todo } from '@/types/todo';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onToggleComplete: (todo: Todo) => Promise<void>;
}

export default function TodoItem({ todo, onDelete, onEdit, onToggleComplete  }: TodoItemProps) {
  const handleEdit = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Todo',
      html: `
        <input 
          id="swal-input1" 
          class="swal2-input" 
          placeholder="Title" 
          value="${todo.title}"
        >
        <textarea 
          id="swal-input2" 
          class="swal2-textarea" 
          placeholder="Description"
        >${todo.description}</textarea>
        <div class="swal2-checkbox-container">
          <input 
            type="checkbox" 
            id="swal-input3" 
            class="swal2-checkbox" 
            ${todo.completed ? 'checked' : ''}
          >
          <label for="swal-input3">Completed</label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
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
      onEdit({
        ...todo,
        ...formValues
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)} // Tambah handler
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <div>
          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </h3>
          <p className="text-gray-500">{todo.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}