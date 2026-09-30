const sessionStorageKey = 'sistem-jadwal-session'

async function request(path, options = {}) {
  const token = sessionStorage.getItem(sessionStorageKey)
    ? JSON.parse(sessionStorage.getItem(sessionStorageKey)).token
    : null
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(path, {
    ...options,
    headers,
  })

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const result = isJson ? await response.json().catch(() => ({})) : {}

  if (!isJson) {
    throw new Error('Server belum menyediakan endpoint API jadwal.')
  }

  if (!response.ok) {
    throw new Error(result.message || `Permintaan gagal (${response.status})`)
  }

  return result
}

export const authApi = {
  signUp: (credentials) => request('/user-management/users/sign-up', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  signIn: async (credentials) => {
    const session = await request('/user-management/users/sign-in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(session))
    return session
  },
  changePassword: async (credentials) => {
    const session = await request('/user-management/users/change-password', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(session))
    return session
  },
  getSession: () => {
    try {
      return JSON.parse(sessionStorage.getItem(sessionStorageKey) || 'null')
    } catch {
      return null
    }
  },
  signOut: () => sessionStorage.removeItem(sessionStorageKey),
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

export const masterDataApi = {
  list: (resource) => request(`/api/master/${encodeURIComponent(resource)}`),
  create: (resource, payload) => request(`/api/master/${encodeURIComponent(resource)}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  remove: (resource, id) => request(`/api/master/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),
}