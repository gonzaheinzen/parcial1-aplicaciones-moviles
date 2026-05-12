import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function CreateTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [reminderSeconds, setReminderSeconds] = useState('');

  // Pedir permisos de notificaciones al cargar la pantalla
  useEffect(() => {
    const requestPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Aviso', 'No se concedieron permisos para notificaciones en iOS.');
      }
    };
    requestPermissions();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título de la tarea es obligatorio.');
      return;
    }

    try {
      // 1. Cargar las tareas existentes
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];

      // 2. Crear la nueva tarea
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        reminderSeconds: parseInt(reminderSeconds) || 0,
      };

      // 3. Guardar la lista actualizada
      tasks.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

      // 4. Programar notificación si los segundos son mayores a 0
      if (newTask.reminderSeconds > 0) {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '¡Recordatorio de Tarea!',
              body: `No te olvides de: ${newTask.title}`,
              sound: true,
            },
            trigger: {
              type: 'timeInterval',
              seconds: newTask.reminderSeconds,
              repeats: false
            },
          });
        } catch (notifError) {
          console.log('Error al programar notificación:', notifError);
          Alert.alert('Aviso', 'La tarea se guardó, pero hubo un error con la notificación: ' + notifError.message);
        }
      }

      Alert.alert('Éxito', 'Tarea guardada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.log('Error general:', error);
      Alert.alert('Error', 'No se pudo guardar la tarea.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título de la tarea:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Comprar pan"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Recordatorio en segundos (Opcional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 10"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={reminderSeconds}
        onChangeText={setReminderSeconds}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
