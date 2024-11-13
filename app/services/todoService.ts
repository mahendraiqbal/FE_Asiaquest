import axios from 'axios';
import { Todo, TodoInput } from '@/types/todo';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const todoService = {
  async getAllTodos() {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  async createTodo(todo: TodoInput) {
    const response = await api.post<Todo>('/todos', todo);
    return response.data;
  },

  async updateTodo(id: number, todo: TodoInput) {
    const response = await api.patch<Todo>(`/todos/${id}`, todo);
    return response.data;
  },

  async deleteTodo(id: number) {
    await api.delete(`/todos/${id}`);
  }
};