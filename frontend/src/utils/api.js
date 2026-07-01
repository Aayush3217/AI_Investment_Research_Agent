import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function streamResearch(company, onProgress, onComplete, onError) {
  const token = localStorage.getItem('token');
  const url = `${BASE}/api/research/stream?company=${encodeURIComponent(company)}`;
  const es = new EventSource(`${url}&token=${token}`);

  // EventSource doesn't support custom headers, so we use a workaround
  // The backend needs to accept token as query param OR we use fetch with ReadableStream
  const controller = new AbortController();

  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      onError(err.error || 'Research failed');
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      let eventType = 'message';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);
            if (eventType === 'progress') onProgress(data);
            else if (eventType === 'complete') onComplete(data);
            else if (eventType === 'error') onError(data.message);
          } catch {}
          eventType = 'message';
        }
      }
    }
  }).catch((err) => {
    if (err.name !== 'AbortError') onError(err.message || 'Connection failed');
  });

  return () => controller.abort();
}

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/api/auth/login', data).then((r) => r.data),
  me: () => api.get('/api/auth/me').then((r) => r.data),
};

export const researchAPI = {
  history: () => api.get('/api/research/history').then((r) => r.data),
  getReport: (id) => api.get(`/api/research/${id}`).then((r) => r.data),
  deleteReport: (id) => api.delete(`/api/research/${id}`).then((r) => r.data),
};

export default api;
