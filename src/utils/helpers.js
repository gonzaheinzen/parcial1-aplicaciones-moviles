/**
 * Valida si un título de tarea es válido.
 * Debe ser un texto no vacío y tener un máximo de 50 caracteres.
 */
export function validateTaskTitle(title) {
  if (!title) return false;
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= 50;
}

/**
 * Formatea un objeto de coordenadas a un string amigable.
 */
export function formatCoordinates(location) {
  if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
    return 'Sin coordenadas';
  }
  return `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`;
}
