import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";


type UserInfo = {
    username: string,
    lastname: string,
    email: string,
    password: string
}

function Register() {
    const [username, SetUsername] = useState('')
    const [lastname, SetLastname] = useState('')
    const [email, SetEmail] = useState('')
    const [password, SetPassowrd] = useState('')
    const [error, SetError] = useState('')
    const navigate = useNavigate();

    function userInformation(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(!username || !lastname || !email || !password){
            SetError('All fields are required')
            clearInformation()
        }else if(password.length < 8){
            SetError('password must be at least 8 characters')
            clearInformation()
        }else{
            const fetchUserInfo: UserInfo = {username, lastname, email, password}
            const postData = async () => {
                try {
                    const response: AxiosResponse = await axios.post('http://localhost:3000/register', fetchUserInfo)
                    console.log(response.data.message)
                    navigate("/login", {replace: true});
                } catch (error: any) {
                    SetError(error.response.data.message)
                    clearInformation()
                }
            }
            postData()
        }
    }

    function clearInformation () {
        SetUsername('')
        SetLastname('')
        SetEmail('')
        SetPassowrd('')
    }


  return (
    <>
        <form onSubmit={userInformation}>
            <div>
                {error? error: ''}
            </div>
        <div>
            <label htmlFor="username">Username</label>
            <input type="text" value={username} onChange={(prev) => SetUsername(prev.target.value)} placeholder='username' />
        </div>
        <div>
            <label htmlFor="lastname">Lastname</label>
            <input type="text" value={lastname} onChange={(prev) => SetLastname(prev.target.value)}  placeholder='lastname' />
        </div>
        <div>
            <label htmlFor="email">Email</label>
            <input type="email" value={email} onChange={(prev) => SetEmail(prev.target.value)} placeholder='email' />
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input type="password" value={password} onChange={(prev) => SetPassowrd(prev.target.value)} placeholder='password' />
        </div>
        <button type="submit">Register</button>  
        </form>
    </>
  )
}

export default Register