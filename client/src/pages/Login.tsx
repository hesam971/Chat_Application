import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ setAuth }: { setAuth: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [email, SetEmail] = useState('')
  const [password, SetPassowrd] = useState('')
  const [error, SetError] = useState('')
  const navigate = useNavigate()

  async function loginInformation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !password) {
      SetError('Please fill all fields')
      clearInformation()
    } else {
      const loginInfo = { email, password }
      try {
        const response = await axios.post('http://localhost:3000/login', loginInfo, {withCredentials: true})
        const { tokenId } = response.data
        localStorage.setItem("token", tokenId)
        setAuth(true)
        navigate('/dashboard', { replace: true })
      } catch (error: any) {
        SetError(error.response.data.message)
        clearInformation()
      }
    }
  }

  function clearInformation() {
    SetEmail('')
    SetPassowrd('')
  }

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="col-md-6">
          <form onSubmit={loginInformation} className="border p-4 shadow rounded bg-light">
            {error &&
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => SetError('')} aria-label="Close"></button>
              </div>
            }
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" value={email} onChange={(prev) => SetEmail(prev.target.value)} className="form-control" placeholder='email' />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" value={password} onChange={(prev) => SetPassowrd(prev.target.value)} className="form-control" placeholder='password' />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login;
