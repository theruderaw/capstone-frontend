import React, { useState } from 'react'
import Textbox from './Textbox'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
function Login() {
  const [user, setuser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login', {  // change URL to your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user,
          password: password,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      navigate('/dashboard')
      console.log('Login success:', data)
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/dashboard')
      localStorage.setItem("user_id",data.user_id)
      localStorage.setItem("perms", JSON.stringify(data.perms))
      // redirect or save token here
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-form">
      <Textbox  
        text={user}
        setText={setuser}
        placeholder="User ID or Email"
      />
      <Textbox
        text={password}
        setText={setPassword}
        placeholder="Password"
        type="password"
        className = "password"
      />
      <Button onClick={handleLogin}>Login</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Login
