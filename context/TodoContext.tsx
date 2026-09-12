import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Todo } from "../types";

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  clearAll: () => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | null>(null);

const STORAGE_KEY = "@todos";

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setTodos(JSON.parse(data));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const persistTodos = async (nextTodos: Todo[]) => {
    setTodos(nextTodos);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
  };

  const addTodo = async (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    await persistTodos([...todos, newTodo]);
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await persistTodos(
      todos.map((t) => (t.id === id ? { ...t, completed } : t))
    );
  };

  const editTodo = async (id: string, text: string) => {
    await persistTodos(
      todos.map((t) => (t.id === id ? { ...t, text } : t))
    );
  };

  const deleteTodo = async (id: string) => {
    await persistTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = async () => {
    setTodos((prev) => {
      const next = prev.filter((t) => !t.completed);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearAll = async () => {
    setTodos([]);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }; 

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        clearCompleted,
        clearAll,
        refreshTodos: loadTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodo must be used within TodoProvider");
  return ctx;
};