import { validateTaskTitle, formatCoordinates } from '../utils/helpers';

describe('Pruebas de Lógica de Negocio (helpers.js)', () => {
  describe('validateTaskTitle', () => {
    test('debe retornar false para un título vacío o con espacios', () => {
      expect(validateTaskTitle('')).toBe(false);
      expect(validateTaskTitle('   ')).toBe(false);
      expect(validateTaskTitle(null)).toBe(false);
    });

    test('debe retornar true para un título válido', () => {
      expect(validateTaskTitle('Comprar leche')).toBe(true);
      expect(validateTaskTitle('A')).toBe(true);
    });

    test('debe retornar false para un título que supera los 50 caracteres', () => {
      const longTitle = 'a'.repeat(51);
      expect(validateTaskTitle(longTitle)).toBe(false);
    });
  });

  describe('formatCoordinates', () => {
    test('debe retornar "Sin coordenadas" si el objeto es nulo o inválido', () => {
      expect(formatCoordinates(null)).toBe('Sin coordenadas');
      expect(formatCoordinates({})).toBe('Sin coordenadas');
      expect(formatCoordinates({ latitude: 'invalido', longitude: -58 })).toBe('Sin coordenadas');
    });

    test('debe formatear correctamente las coordenadas con 4 decimales', () => {
      const location = { latitude: -34.603722, longitude: -58.381555 };
      expect(formatCoordinates(location)).toBe('Lat: -34.6037, Lng: -58.3816');
    });
  });
});
