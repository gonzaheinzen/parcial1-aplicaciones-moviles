import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      isLoggedIn: false,
      currentUser: null,
      users: [], // Array de { username, password } para registro simple

      registerUser: (username, password) => {
        set((state) => {
          // Verificar si ya existe el usuario
          const exists = state.users.some((u) => u.username.toLowerCase() === username.toLowerCase());
          if (exists) {
            throw new Error('El usuario ya existe');
          }
          return {
            users: [...state.users, { username, password }],
          };
        });
      },

      login: (username) => set({ isLoggedIn: true, currentUser: username }),
      logout: () => set({ isLoggedIn: false, currentUser: null }),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      updateTask: (updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        })),
    }),
    {
      name: 'task-store-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
