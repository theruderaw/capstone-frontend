import React, { useState,useEffect } from 'react'
import {useAuth} from '../../AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const {user,setUser,logout} = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (user.user_id) {
      navigate("/dashboard")
      console.log(user)
    }
  }, [user])
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: username,
          password: password
        })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      if (data.user_id){
        setUser("user_id",data.user_id)
        setUser("status_id",data.status_id)
        
      }
      console.log("Response:", data)
    
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <div>
      <input
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Username'
      />

      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />

      <button type="button" onClick={handleLogin}>
        Login
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Login