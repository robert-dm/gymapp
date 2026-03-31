const TRANSLATIONS = {
  es: {
    appTitle: 'Gym Tracker',
    all: 'Todos',
    chest: 'Pecho',
    back: 'Espalda',
    shoulders: 'Hombros',
    biceps: 'Bíceps',
    triceps: 'Tríceps',
    legs: 'Piernas',
    abs: 'Abdominales',
    today: 'Hoy',
    set: 'Serie',
    reps: 'Reps',
    weight: 'Peso (kg)',
    addSet: '+ Serie',
    recentHistory: 'Historial reciente',
    history: 'Historial',
    noSetsToday: 'Sin series hoy. ¡Empieza a entrenar!',
    noHistory: 'Sin historial para este ejercicio.',
    noLogsDate: 'Sin registros para esta fecha.',
    confirmDelete: '¿Eliminar esta serie?',
    repsPlaceholder: 'Reps',
    weightPlaceholder: 'kg',
    markComplete: '&#10003; Completado',
    markIncomplete: '&#10003; Completado',
    calendar: 'Calendario',
    photos: 'Fotos',
    uploadPhoto: 'Subir foto',
    deletePhoto: 'Eliminar',
    confirmDeletePhoto: '¿Eliminar esta foto?',
    noPhotos: 'Sin fotos para este día',
    mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom',
    months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  },
  en: {
    appTitle: 'Gym Tracker',
    all: 'All',
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    legs: 'Legs',
    abs: 'Abs',
    today: 'Today',
    set: 'Set',
    reps: 'Reps',
    weight: 'Weight (kg)',
    addSet: '+ Set',
    recentHistory: 'Recent history',
    history: 'History',
    noSetsToday: 'No sets today. Start training!',
    noHistory: 'No history for this exercise.',
    noLogsDate: 'No logs for this date.',
    confirmDelete: 'Delete this set?',
    repsPlaceholder: 'Reps',
    weightPlaceholder: 'kg',
    markComplete: '&#10003; Complete',
    markIncomplete: '&#10003; Completed',
    calendar: 'Calendar',
    photos: 'Photos',
    uploadPhoto: 'Upload photo',
    deletePhoto: 'Delete',
    confirmDeletePhoto: 'Delete this photo?',
    noPhotos: 'No photos for this day',
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  }
};

let currentLang = localStorage.getItem('gym-lang') || 'es';

function t(key) {
  return TRANSLATIONS[currentLang][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('gym-lang', lang);
}

function getLang() {
  return currentLang;
}
