import { act } from 'react-test-renderer';
import { useTaskStore } from '../store/taskStore';

describe('Pruebas del Store Global (Zustand - taskStore)', () => {
  beforeEach(() => {
    // Resetear el estado del store antes de cada test para evitar contaminación
    act(() => {
      useTaskStore.setState({
        tasks: [],
        isLoggedIn: false,
        currentUser: null,
        users: [],
      });
    });
  });

  test('debe agregar una tarea correctamente', () => {
    const task = { id: '1', title: 'Hacer compras' };

    act(() => {
      useTaskStore.getState().addTask(task);
    });

    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0]).toEqual(task);
  });

  test('debe eliminar una tarea correctamente por id', () => {
    const task1 = { id: '1', title: 'Tarea 1' };
    const task2 = { id: '2', title: 'Tarea 2' };

    act(() => {
      useTaskStore.getState().addTask(task1);
      useTaskStore.getState().addTask(task2);
    });

    act(() => {
      useTaskStore.getState().deleteTask('1');
    });

    const state = useTaskStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toEqual(task2);
  });

  test('debe registrar un usuario y permitir el login', () => {
    act(() => {
      useTaskStore.getState().registerUser('gonza', '1234');
    });

    const users = useTaskStore.getState().users;
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({ username: 'gonza', password: '1234' });

    act(() => {
      useTaskStore.getState().login('gonza');
    });

    const state = useTaskStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.currentUser).toBe('gonza');

    act(() => {
      useTaskStore.getState().logout();
    });

    expect(useTaskStore.getState().isLoggedIn).toBe(false);
    expect(useTaskStore.getState().currentUser).toBeNull();
  });
});
