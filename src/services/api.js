async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const result = isJson ? await response.json().catch(() => ({})) : {}

  if (!response.ok) {
    throw new Error(result.message || `Permintaan gagal (${response.status})`)
  }

  if (!isJson) {
    throw new Error('Server belum menyediakan endpoint API jadwal.')
  }

  return result
}

export const scheduleApi = {
  health: () => request('/api/health'),
  list: () => request('/api/jadwal'),
  create: (payload) => request('/api/jadwal', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  update: (id, payload) => request(`/api/jadwal/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  remove: (id) => request(`/api/jadwal/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),
}