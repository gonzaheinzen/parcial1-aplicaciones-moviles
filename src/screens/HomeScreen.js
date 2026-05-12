import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import TaskItem from '../components/TaskItem';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Error al cargar tareas', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la tarea.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
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
    flex: 1, // La lista ocupa todo el espacio entonces los botones van abajo del todo
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
    marginTop: 10, // Espacio entre la lista y los botones
  },
});
