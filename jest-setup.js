import '@testing-library/jest-native/extend-expect';

// Mock para React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock para AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock para Expo Notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {
    MAX: 4,
  },
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
}));

// Mock para Expo Image Picker
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: 'camera-uri' }] })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: 'gallery-uri' }] })),
}));

// Mock para Expo Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: -34.6037, longitude: -58.3816 },
    })
  ),
  reverseGeocodeAsync: jest.fn(() =>
    Promise.resolve([{ street: 'Corrientes', name: '1234', city: 'CABA' }])
  ),
  Accuracy: {
    Balanced: 3,
  },
}));

// Mock para Expo Contacts
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getContactsAsync: jest.fn(() =>
    Promise.resolve({
      data: [{ id: '1', name: 'Juan Perez' }],
    })
  ),
  presentContactPickerAsync: jest.fn(() =>
    Promise.resolve({
      name: 'Juan Perez',
    })
  ),
  Fields: {
    Name: 'name',
    PhoneNumbers: 'phoneNumbers',
  },
}));

// Mock para Expo Calendar
jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCalendarsAsync: jest.fn(() =>
    Promise.resolve([{ id: 'cal-1', allowsModifications: true, source: { name: 'Default' } }])
  ),
  createEventAsync: jest.fn(() => Promise.resolve('event-id-123')),
  EntityTypes: {
    EVENT: 'event',
  },
}));
