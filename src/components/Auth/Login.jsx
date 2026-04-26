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
    }
  }, [user])
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
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
    
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center">

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full max-w-sm px-4 py-2 border rounded-lg"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full max-w-sm px-4 py-2 border rounded-lg"
      />

      <button
        type="button"
        onClick={handleLogin}
        className="w-full max-w-sm bg-black text-white py-2 rounded-lg hover:bg-gray-800"
      >
        Login
      </button>

      {error && <p className="text-red-500">{error}</p>}

    </div>
  )
}

export default Login