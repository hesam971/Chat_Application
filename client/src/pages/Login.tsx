import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Login() {
  const [email, SetEmail] = useState('')
  const [password, SetPassowrd] = useState('')
  const [error, SetError] = useState('')
  const navigate = useNavigate()

  async function loginInformation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if(!email || !password){
      SetError('Please fill in all fields')
      clearInformation() 
    }else{
      const loginInfo = {email, password}
      try {
        const response = await axios.post('http://localhost:3000/login', loginInfo)
        console.log(response.data.message)
        const {userId} = response.data
        navigate('/dashboard/' + userId, {replace: true})
      } catch (error: any) {
        SetError(error.response.data.message)
        clearInformation() 
    }
  }
}

function clearInformation () {
  SetEmail('')
  SetPassowrd('')
}

  return (
    <>
    <form onSubmit={loginInformation}>
        <div>
            {error? error: ''}
        </div>
    <div>
        <label htmlFor="email">Email</label>
        <input type="email" value={email} onChange={(prev) => SetEmail(prev.target.value)} placeholder='email' />
    </div>
    <div>
        <label htmlFor="password">Password</label>
        <input type="password" value={password} onChange={(prev) => SetPassowrd(prev.target.value)} placeholder='password' />
    </div>
    <button type="submit">Login</button>  
    </form>
</>
  )
}

export default Login