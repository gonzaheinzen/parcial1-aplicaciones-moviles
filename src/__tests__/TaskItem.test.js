import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../components/TaskItem';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('<TaskItem />', () => {
  const mockTask = {
    id: '123',
    title: 'Hacer ejercicio',
    reminderSeconds: 10,
    imageUri: 'test-uri',
    location: { address: 'Gym' },
    contact: { name: 'Juan' },
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar el título de la tarea y sus etiquetas correctamente', async () => {
    const { getByText } = await render(<TaskItem task={mockTask} onDelete={mockOnDelete} />);

    expect(getByText('Hacer ejercicio')).toBeTruthy();
    expect(getByText('🔔 Recordatorio')).toBeTruthy();
    expect(getByText('📍 Ubicación')).toBeTruthy();
    expect(getByText('👤 Contacto')).toBeTruthy();
  });

  test('debe llamar a onDelete con el ID correcto cuando se presiona el botón X', async () => {
    const { getByText } = await render(<TaskItem task={mockTask} onDelete={mockOnDelete} />);
    const deleteButton = getByText('X');

    fireEvent.press(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith('123');
  });

  test('debe navegar al detalle de la tarea al presionar el contenedor', async () => {
    const { getByText } = await render(<TaskItem task={mockTask} onDelete={mockOnDelete} />);
    const taskTitle = getByText('Hacer ejercicio');

    fireEvent.press(taskTitle);
    expect(mockNavigate).toHaveBeenCalledWith('DetalleTarea', { taskId: '123' });
  });
});
