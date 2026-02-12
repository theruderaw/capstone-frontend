import React, { useState } from 'react'
import Textbox from './Textbox'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
function Login({setIsLoggedIn}) {
  const [user, setuser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {  // change URL to your backend
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

      // persist
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user_id', data.user_id)
      localStorage.setItem('status_id', data.status_id)

      // update React state (THIS FIXES NAVBAR)
      setIsLoggedIn(true)

      // redirect once
      console.log(typeof(data.status_id),data.status_id)
      if(data.status_id == 1){
        navigate('/workerdashboard')
      }
      else if(data.status_id == 2){
        navigate('/supervisordashboard')
      }
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
