import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Platform, Alert } from 'react-native';
import { useTaskStore } from '../store/taskStore';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  
  // Buscar la tarea en el store global para asegurar reactividad
  const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId));
  const deleteTask = useTaskStore((state) => state.deleteTask);

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró la tarea.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que querés eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleOpenMaps = () => {
    if (!task.location) return;
    const { latitude, longitude } = task.location;
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = encodeURIComponent('Ubicación de Tarea');
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir el mapa.');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{task.title}</Text>

      {/* 1. Cámara / Galería: Imagen grande */}
      {task.imageUri ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Foto adjunta:</Text>
          <Image source={{ uri: task.imageUri }} style={styles.image} resizeMode="cover" />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Foto adjunta:</Text>
          <Text style={styles.placeholderText}>Sin imagen adjunta.</Text>
        </View>
      )}

      {/* 2. Ubicación GPS */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>📍 Ubicación:</Text>
        {task.location ? (
          <View>
            <Text style={styles.valueText}>{task.location.address}</Text>
            <Text style={styles.coordsText}>
              Latitud: {task.location.latitude.toFixed(5)} | Longitud: {task.location.longitude.toFixed(5)}
            </Text>
            <TouchableOpacity style={styles.mapsButton} onPress={handleOpenMaps}>
              <Text style={styles.mapsButtonText}>Ver en Google Maps / Apple Maps</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Sin ubicación registrada.</Text>
        )}
      </View>

      {/* 3. Contactos */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>👤 Responsable / Contacto:</Text>
        {task.contact ? (
          <Text style={styles.valueText}>{task.contact.name}</Text>
        ) : (
          <Text style={styles.placeholderText}>Sin contacto asociado.</Text>
        )}
      </View>

      {/* 4. Notificación y Calendario */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>⚙️ Recordatorios:</Text>
        <Text style={styles.valueText}>
          {task.reminderSeconds > 0
            ? `Notificación programada en ${task.reminderSeconds} segundos.`
            : 'Sin notificación local activa.'}
        </Text>
        {task.calendarEventId && (
          <Text style={styles.calendarText}>
            📅 Tarea vinculada en el calendario de tu celular.
          </Text>
        )}
      </View>

      {/* Botón de eliminación */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Eliminar Tarea</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardLabel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  valueText: {
    color: '#ffffff',
    fontSize: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 15,
    fontStyle: 'italic',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#222',
  },
  coordsText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  mapsButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  mapsButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  calendarText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
