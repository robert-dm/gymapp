const API = {
  _token: localStorage.getItem('gym-token'),

  _headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this._token) h['Authorization'] = `Bearer ${this._token}`;
    return h;
  },

  setToken(token) {
    this._token = token;
    if (token) {
      localStorage.setItem('gym-token', token);
    } else {
      localStorage.removeItem('gym-token');
    }
  },

  getToken() {
    return this._token;
  },

  async loginWithGoogle(credential) {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) throw new Error('Auth failed');
    const data = await res.json();
    this.setToken(data.token);
    return data.user;
  },

  async getMe() {
    const res = await fetch('/api/auth/me', { headers: this._headers() });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  logout() {
    this.setToken(null);
  },

  async getExercises() {
    const res = await fetch('/api/exercises', { headers: this._headers() });
    return res.json();
  },

  async getLogs(date) {
    const q = date ? `?date=${date}` : '';
    const res = await fetch(`/api/logs${q}`, { headers: this._headers() });
    return res.json();
  },

  async addLog(exerciseId, setNumber, reps, weight, date, perSide, duration) {
    const body = { exercise_id: exerciseId, set_number: setNumber, reps, weight, duration: duration || null, per_side: perSide || false };
    if (date) body.date = date;
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async getHistory(exerciseId) {
    const res = await fetch(`/api/logs/history/${exerciseId}`, { headers: this._headers() });
    return res.json();
  },

  async deleteLog(id) {
    const res = await fetch(`/api/logs/${id}`, { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  async getCompleted(date) {
    const q = date ? `?date=${date}` : '';
    const res = await fetch(`/api/completed${q}`, { headers: this._headers() });
    return res.json();
  },

  async markCompleted(exerciseId, date) {
    const body = { exercise_id: exerciseId };
    if (date) body.date = date;
    const res = await fetch('/api/completed', {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async unmarkCompleted(exerciseId, date) {
    const q = date ? `?date=${date}` : '';
    const res = await fetch(`/api/completed/${exerciseId}${q}`, { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  // Calendar
  async getCalendar(year, month) {
    const res = await fetch(`/api/calendar/${year}/${month}`, { headers: this._headers() });
    return res.json();
  },

  // Photos
  async getPhotos(date) {
    const q = date ? `?date=${date}` : '';
    const res = await fetch(`/api/photos${q}`, { headers: this._headers() });
    return res.json();
  },

  async uploadPhoto(file, date) {
    const formData = new FormData();
    formData.append('photo', file);
    if (date) formData.append('date', date);
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this._token}` },
      body: formData
    });
    return res.json();
  },

  async deletePhoto(id) {
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  // Body weight
  async getBodyWeight(date) {
    const q = date ? `?date=${date}` : '';
    const res = await fetch(`/api/bodyweight${q}`, { headers: this._headers() });
    return res.json();
  },

  async saveBodyWeight(weight, date) {
    const res = await fetch('/api/bodyweight', {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ weight, date })
    });
    return res.json();
  },

  async deleteBodyWeight(date) {
    const q = date ? `?date=${date}` : '';
    const res = await fetch(`/api/bodyweight${q}`, { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  // Routine
  async getRoutine() {
    const res = await fetch('/api/routine', { headers: this._headers() });
    return res.json();
  },

  async saveRoutine(days) {
    const res = await fetch('/api/routine', {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify({ days })
    });
    return res.json();
  },

  async deleteRoutine() {
    const res = await fetch('/api/routine', { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  // Exercise notes
  async getNote(exerciseId) {
    const res = await fetch(`/api/notes/${exerciseId}`, { headers: this._headers() });
    return res.json();
  },

  async saveNote(exerciseId, note) {
    const res = await fetch(`/api/notes/${exerciseId}`, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify({ note })
    });
    return res.json();
  },

  // Dashboard
  async getDashboard(days) {
    const q = days ? `?days=${days}` : '';
    const res = await fetch(`/api/dashboard${q}`, { headers: this._headers() });
    return res.json();
  },

  // Admin
  async getAdminUsers() {
    const res = await fetch('/api/admin/users', { headers: this._headers() });
    return res.json();
  },

  async updateAdminUser(id, data) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteAdminUser(id) {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  async getAdminExercises() {
    const res = await fetch('/api/admin/exercises', { headers: this._headers() });
    return res.json();
  },

  async createAdminExercise(data) {
    const res = await fetch('/api/admin/exercises', {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateAdminExercise(id, data) {
    const res = await fetch(`/api/admin/exercises/${id}`, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateExerciseIcon(id, svg) {
    const res = await fetch(`/api/admin/exercises/${id}/icon`, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify({ icon_svg: svg })
    });
    return res.json();
  },

  async deleteAdminExercise(id) {
    const res = await fetch(`/api/admin/exercises/${id}`, { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  // AI
  async getAISettings() {
    const res = await fetch('/api/ai/settings', { headers: this._headers() });
    return res.json();
  },

  async saveAISettings(provider, apiKey) {
    const res = await fetch('/api/ai/settings', {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify({ ai_provider: provider, ai_api_key: apiKey })
    });
    return res.json();
  },

  async deleteAISettings() {
    const res = await fetch('/api/ai/settings', { method: 'DELETE', headers: this._headers() });
    return res.json();
  },

  async aiAnalyze(message, includePhotos) {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ message, include_photos: includePhotos })
    });
    return res.json();
  }
};
