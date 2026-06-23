import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import TaskItem from '../components/TaskItem';

export default function HomeScreen({ navigation }) {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const logout = useTaskStore((state) => state.logout);

  const handleDelete = (id) => {
    deleteTask(id);
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis tareas</Text>

      <View style={styles.listContainer}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tenés tareas guardadas. ¡Agregá una!</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TaskItem task={item} onDelete={handleDelete} />
            )}
          />
        )}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CrearTarea')}
        >
          <Text style={styles.addButtonText}>+ Nueva Tarea</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  listContainer: {
    flex: 1,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButtonText: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 10,
  },
});
