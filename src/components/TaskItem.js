import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TaskItem({ task, onDelete }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DetalleTarea', { taskId: task.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      {/* Miniatura de la imagen si existe */}
      {task.imageUri && (
        <Image source={{ uri: task.imageUri }} style={styles.thumbnail} />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {task.title}
        </Text>

        {/* Subtítulos informativos sobre la tarea */}
        <View style={styles.infoRow}>
          {task.reminderSeconds > 0 && (
            <Text style={styles.tag}>🔔 Recordatorio</Text>
          )}
          {task.location && (
            <Text style={styles.tag}>📍 Ubicación</Text>
          )}
          {task.contact && (
            <Text style={styles.tag}>👤 Contacto</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
        activeOpacity={0.6}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#222',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    color: '#aaa',
    fontSize: 11,
    marginRight: 8,
    marginVertical: 4,
    backgroundColor: '#2b2b2b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
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
