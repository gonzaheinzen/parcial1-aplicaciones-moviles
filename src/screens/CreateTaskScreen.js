import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { useTaskStore } from '../store/taskStore';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';

export default function CreateTaskScreen({ navigation }) {
  const addTask = useTaskStore((state) => state.addTask);

  // Estados del formulario
  const [title, setTitle] = useState('');
  const [reminderSeconds, setReminderSeconds] = useState('');
  const [syncWithCalendar, setSyncWithCalendar] = useState(false);

  // Estados de recursos del hardware
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [contact, setContact] = useState(null);

  // UI auxiliar para contactos
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Pedir permisos de notificaciones locales al montar la pantalla
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    requestNotificationPermissions();
  }, []);

  // 1. Cámara y Galería: Tomar Foto
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === 'denied') {
        Alert.alert(
          'Permiso denegado',
          'El acceso a la cámara fue denegado. Habilitalo en la configuración para tomar fotos.'
        );
        return;
      }
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.7,
        });

        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara.');
    }
  };

  // 1. Cámara y Galería: Seleccionar desde Galería
  const handleSelectFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'denied') {
        Alert.alert(
          'Permiso denegado',
          'El acceso a la galería fue denegado. Habilitalo en la configuración para seleccionar imágenes.'
        );
        return;
      }
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.7,
        });

        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería.');
    }
  };

  // 2. Ubicación: Obtener Ubicación GPS
  const handleGetLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'denied') {
        Alert.alert(
          'Permiso denegado',
          'El acceso a la ubicación fue denegado. Habilitalo en la configuración para usar el GPS.'
        );
        setLoadingLocation(false);
        return;
      }
      if (status === 'granted') {
        const currentLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = currentLoc.coords;

        // Intentar geocodificación inversa para obtener la dirección
        let addressStr = 'Dirección no encontrada';
        try {
          const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (geocode && geocode.length > 0) {
            const place = geocode[0];
            addressStr = `${place.street || ''} ${place.name || ''}, ${place.city || ''}`;
          }
        } catch (e) {
          console.log('Error en reverse geocode:', e);
        }

        setLocation({
          latitude,
          longitude,
          address: addressStr,
        });
      }
    } catch (error) {
      console.log('Error al obtener ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // 3. Contactos: Abrir el selector nativo de contactos de iOS / Android
  const handleSelectContact = async () => {
    setLoadingContacts(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'denied') {
        Alert.alert(
          'Permiso denegado',
          'El acceso a los contactos fue denegado. Habilítalo en la configuración para poder seleccionar un contacto.'
        );
        setLoadingContacts(false);
        return;
      }
      if (status === 'granted') {
        const contactPicked = await Contacts.presentContactPickerAsync();
        if (contactPicked) {
          let displayName = '';
          try {
            // En iOS, el selector nativo retorna datos mínimos por privacidad.
            // Obtenemos el contacto completo por su ID solicitando explícitamente el nombre.
            const fullContact = await Contacts.getContactByIdAsync(contactPicked.id, [
              Contacts.Fields.Name,
            ]);
            if (fullContact) {
              displayName =
                fullContact.name ||
                [fullContact.firstName, fullContact.middleName, fullContact.lastName]
                  .filter(Boolean)
                  .join(' ');
            }
          } catch (e) {
            console.log('Error al obtener contacto por ID:', e);
          }

          // Si falló u obtuvo un nombre vacío, hacemos fallback a los campos del picker inicial
          if (!displayName) {
            displayName =
              contactPicked.name ||
              [contactPicked.firstName, contactPicked.middleName, contactPicked.lastName]
                .filter(Boolean)
                .join(' ') ||
              'Contacto seleccionado';
          }

          setContact({ name: displayName });
        }
      }
    } catch (error) {
      console.log('Error al obtener contactos:', error);
      Alert.alert('Error', 'No se pudo abrir el selector de contactos.');
    } finally {
      setLoadingContacts(false);
    }
  };

  // 4. Calendario: Buscar o crear un calendario editable
  const getCalendarId = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'denied') {
        Alert.alert(
          'Permiso denegado',
          'El acceso al calendario fue denegado. No se podrá guardar el evento.'
        );
        return null;
      }

      if (status === 'granted') {
        if (Platform.OS === 'ios') {
          const defaultCal = await Calendar.getDefaultCalendarAsync();
          return defaultCal.id;
        } else {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          // Buscar un calendario que admita modificaciones
          const writableCalendar =
            calendars.find((cal) => cal.allowsModifications && cal.source.name === 'Default') ||
            calendars.find((cal) => cal.allowsModifications);

          if (writableCalendar) {
            return writableCalendar.id;
          } else {
            // Crear un calendario local en caso de que no haya ninguno
            const defaultCalendarSource = { isLocalAccount: true, name: 'Expo Calendar' };
            const newCalId = await Calendar.createCalendarAsync({
              title: 'Tareas Parcial 2',
              color: '#4CAF50',
              entityType: Calendar.EntityTypes.EVENT,
              sourceId: defaultCalendarSource.id,
              source: defaultCalendarSource,
              name: 'internal',
              ownerAccount: 'personal',
              accessLevel: Calendar.CalendarAccessLevel.OWNER,
            });
            return newCalId;
          }
        }
      }
    } catch (error) {
      console.log('Error al obtener calendario:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título de la tarea es obligatorio.');
      return;
    }

    const seconds = parseInt(reminderSeconds) || 0;
    let calendarEventId = null;

    try {
      // Si seleccionó sincronizar con calendario
      if (syncWithCalendar) {
        const calId = await getCalendarId();
        if (calId) {
          // Crear un evento que empiece en 'seconds' o en 1 hora por defecto si no ingresó segundos
          const startOffset = seconds > 0 ? seconds * 1000 : 3600 * 1000;
          const startDate = new Date(Date.now() + startOffset);
          const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutos de duración

          calendarEventId = await Calendar.createEventAsync(calId, {
            title: `Tarea: ${title.trim()}`,
            startDate,
            endDate,
            timeZone: 'GMT-3',
            notes: 'Creado desde el Gestor de Tareas',
          });
        }
      }

      // 1. Crear el objeto de la tarea
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        reminderSeconds: seconds,
        imageUri,
        location,
        contact,
        calendarEventId,
      };

      // 2. Guardar en Zustand
      addTask(newTask);

      // 3. Programar notificación local si seconds > 0
      if (seconds > 0) {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '¡Recordatorio de Tarea!',
              body: `No te olvides de: ${newTask.title}`,
              sound: true,
            },
            trigger: {
              type: 'timeInterval',
              seconds: seconds,
              repeats: false,
            },
          });
        } catch (notifError) {
          console.log('Error al programar notificación:', notifError);
        }
      }

      Alert.alert('Éxito', 'Tarea guardada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log('Error al guardar:', error);
      Alert.alert('Error', 'Hubo un problema al guardar la tarea.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      {/* RECURSOS DEL DISPOSITIVO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos del Dispositivo</Text>

        {/* 1. Imagen / Cámara */}
        <Text style={styles.label}>Foto Adjunta:</Text>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.thumbnail} />}
        <View style={styles.row}>
          <TouchableOpacity style={styles.secButton} onPress={handleTakePhoto}>
            <Text style={styles.secButtonText}>📸 Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secButton} onPress={handleSelectFromGallery}>
            <Text style={styles.secButtonText}>🖼️ Galería</Text>
          </TouchableOpacity>
          {imageUri && (
            <TouchableOpacity style={styles.deleteSecButton} onPress={() => setImageUri(null)}>
              <Text style={styles.deleteSecButtonText}>Borrar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 2. Ubicación GPS */}
        <Text style={styles.label}>Ubicación:</Text>
        {location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>📍 {location.address}</Text>
            <Text style={styles.locationCoords}>
              Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
            </Text>
          </View>
        )}
        <View style={styles.row}>
          <TouchableOpacity style={styles.secButton} onPress={handleGetLocation}>
            {loadingLocation ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.secButtonText}>📍 Obtener GPS</Text>
            )}
          </TouchableOpacity>
          {location && (
            <TouchableOpacity style={styles.deleteSecButton} onPress={() => setLocation(null)}>
              <Text style={styles.deleteSecButtonText}>Borrar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. Contactos */}
        <Text style={styles.label}>Contacto Relacionado:</Text>
        {contact && (
          <View style={styles.contactContainer}>
            <Text style={styles.contactText}>👤 {contact.name}</Text>
          </View>
        )}
        <View style={styles.row}>
          <TouchableOpacity style={styles.secButton} onPress={handleSelectContact}>
            {loadingContacts ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.secButtonText}>👤 Elegir Contacto</Text>
            )}
          </TouchableOpacity>
          {contact && (
            <TouchableOpacity style={styles.deleteSecButton} onPress={() => setContact(null)}>
              <Text style={styles.deleteSecButtonText}>Borrar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 4. Calendario */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>📅 ¿Vincular con Calendario local?</Text>
          <TouchableOpacity
            style={[styles.checkbox, syncWithCalendar && styles.checkboxChecked]}
            onPress={() => setSyncWithCalendar(!syncWithCalendar)}
          >
            {syncWithCalendar && <Text style={styles.checkboxTick}>✓</Text>}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Tarea</Text>
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
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  section: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  sectionTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  secButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteSecButton: {
    borderColor: '#F44336',
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  deleteSecButtonText: {
    color: '#F44336',
    fontSize: 14,
  },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#222',
  },
  locationContainer: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderColor: '#333',
    borderWidth: 1,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
  },
  locationCoords: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  contactContainer: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderColor: '#333',
    borderWidth: 1,
  },
  contactText: {
    color: '#fff',
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 15,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    borderColor: '#333',
    borderWidth: 1,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  contactItemText: {
    color: '#fff',
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
