import { useEffect, useMemo, useState } from 'react'
import { api, getApiBase } from './api.js'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '')

export default function App() {
  // Auth form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Task form
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  // Data
  const [tasks, setTasks] = useState([])

  // UI & messages
  const [apiBase, setApiBase] = useState(getApiBase())
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [taskError, setTaskError] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loadingTask, setLoadingTask] = useState(false)

  // Derived validation
  const canRegister = useMemo(() =>
    name.trim().length >= 1 && emailOk(email) && password.length >= 6, [name, email, password]
  )
  const canLogin = useMemo(() =>
    emailOk(email) && password.length >= 6, [email, password]
  )
  const canAddTask = useMemo(() => title.trim().length > 0, [title])

  // If token exists, try to fetch tasks on first load
  useEffect(() => { fetchTasks().catch(()=>{}) }, [])

  function saveApiBase() {
    localStorage.setItem('api', apiBase)
    alert('API base saved: ' + apiBase)
  }

  async function fetchTasks() {
    try {
      const data = await api('/api/tasks')
      setTasks(data)
    } catch {
      // not logged in yet; ignore
    }
  }

  async function register() {
    setAuthError(''); setAuthSuccess(''); setLoadingAuth(true)
    try {
      if (!canRegister) {
        setAuthError('Please enter a name, a valid email, and a password (6+ chars).')
        return
      }
      const body = { name: name.trim(), email: email.trim(), password }
      console.log('[UI] register', body)
      await api('/api/auth/register', { method: 'POST', body: JSON.stringify(body) })
      setAuthSuccess('Registered! Now log in.')
    } catch (e) {
      setAuthError(e.message || 'Register failed')
    } finally {
      setLoadingAuth(false)
    }
  }

  async function login() {
    setAuthError(''); setAuthSuccess(''); setLoadingAuth(true)
    try {
      if (!canLogin) {
        setAuthError('Please enter a valid email and password (6+ chars).')
        return
      }
      const body = { email: email.trim(), password }
      console.log('[UI] login', body)
      const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) })
      localStorage.setItem('token', data.token)
      setAuthSuccess(`Welcome, ${data.user?.name || 'user'}!`)
      await fetchTasks()
    } catch (e) {
      setAuthError(e.message || 'Login failed')
    } finally {
      setLoadingAuth(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setTasks([])
    setAuthSuccess('Logged out.')
  }

  async function addTask() {
    setTaskError(''); setLoadingTask(true)
    try {
      if (!canAddTask) {
        setTaskError('Title required')
        return
      }
      const body = { title: title.trim(), dueDate: due || undefined }
      console.log('[UI] addTask', body)
      await api('/api/tasks', { method: 'POST', body: JSON.stringify(body) })
      setTitle(''); setDue('')
      await fetchTasks()
    } catch (e) {
      setTaskError(e.message || 'Could not add task')
    } finally {
      setLoadingTask(false)
    }
  }

  async function toggleDone(id, completed) {
    setTaskError('')
    try {
      console.log('[UI] toggle', id, completed)
      await api('/api/tasks/' + id, { method: 'PATCH', body: JSON.stringify({ completed }) })
      await fetchTasks()
    } catch (e) {
      setTaskError(e.message || 'Could not update task')
    }
  }

  async function removeTask(id) {
    setTaskError('')
    try {
      console.log('[UI] delete', id)
      await api('/api/tasks/' + id, { method: 'DELETE' })
      await fetchTasks()
    } catch (e) {
      setTaskError(e.message || 'Could not delete task')
    }
  }

  return (
    <div className="container">
      <h1>Task Manager (React)</h1>

      {/* API base config */}
      <div className="card">
        <p className="small">API: {apiBase}</p>
        <div className="row">
          <input
            value={apiBase}
            onChange={e=>setApiBase(e.target.value)}
            placeholder="API base (e.g., http://localhost:8080)"
          />
          <button onClick={saveApiBase}>Save API Base</button>
        </div>
      </div>

      {/* Auth */}
      <div className="card">
        <h2>Auth</h2>
        <div className="row">
          <input
            className={name.trim().length === 0 ? 'invalid' : ''}
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Name (register)"
          />
          <input
            className={!emailOk(email) ? 'invalid' : ''}
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className={password.length < 6 ? 'invalid' : ''}
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type="password"
            placeholder="Password (6+ chars)"
          />
        </div>

        {authError && <p className="error">{authError}</p>}
        {authSuccess && <p className="success">{authSuccess}</p>}

        <div className="row">
          <button disabled={!canRegister || loadingAuth} onClick={register}>
            {loadingAuth ? 'Registering…' : 'Register'}
          </button>
          <button disabled={!canLogin || loadingAuth} onClick={login}>
            {loadingAuth ? 'Logging in…' : 'Login'}
          </button>
          <button onClick={logout}>Logout</button>
          <span className="inline muted small">
            Password must be at least 6 characters.
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="card">
        <h2>Tasks</h2>

        <div className="row">
          <input
            className={!canAddTask && title ? 'invalid' : ''}
            value={title}
            onChange={e=>setTitle(e.target.value)}
            placeholder="New task title"
          />
          <input value={due} onChange={e=>setDue(e.target.value)} type="date" />
          <button disabled={!canAddTask || loadingTask} onClick={addTask}>
            {loadingTask ? 'Adding…' : 'Add Task'}
          </button>
        </div>

        {taskError && <p className="error">{taskError}</p>}

        <ul>
          {tasks.length === 0 && <p className="small">No tasks yet.</p>}
          {tasks.map(t => (
            <li key={t._id}>
              <div>
                <span className={t.completed ? 'done' : ''}>
                  {t.title}{t.dueDate ? ` (due ${new Date(t.dueDate).toLocaleDateString()})` : ''}
                </span>
              </div>
              <div className="row">
                <button onClick={()=>toggleDone(t._id, !t.completed)}>
                  {t.completed ? 'Mark Active' : 'Mark Done'}
                </button>
                <button onClick={()=>removeTask(t._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
