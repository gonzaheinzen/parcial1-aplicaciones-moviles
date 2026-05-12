import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskItem({ task, onDelete }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{task.title}</Text>
        {task.reminderSeconds > 0 && (
          <Text style={styles.subtitle}>Recordatorio en {task.reminderSeconds} segundos</Text>
        )}
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
