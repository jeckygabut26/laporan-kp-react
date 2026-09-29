import { useState } from 'react'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './pages/Login.jsx'

function App() {
  const [username, setUsername] = useState('')

  if (username) {
    return <AdminDashboard username={username} onLogout={() => setUsername('')} />
  }

  return <Login onLogin={({ username: account }) => setUsername(account)} />
}

export default App
