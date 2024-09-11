import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

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

    function userInformation(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!username || !lastname || !email || !password) {
            SetError('All fields are required')
            clearInformation()
        } else if (password.length < 8) {
            SetError('Password must be at least 8 characters')
            clearInformation()
        } else {
            const fetchUserInfo: UserInfo = { username, lastname, email, password }
            const postData = async () => {
                try {
                    const response: AxiosResponse = await axios.post('http://localhost:3000/register', fetchUserInfo)
                    console.log(response.data.message)
                    navigate("/login", { replace: true });
                } catch (error: any) {
                    SetError(error.response.data.message)
                    clearInformation()
                }
            }
            postData()
        }
    }

    function clearInformation() {
        SetUsername('')
        SetLastname('')
        SetEmail('')
        SetPassowrd('')
    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="col-md-6">
                    <form onSubmit={userInformation} className="border p-4 shadow rounded bg-light">
                        {error &&
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                {error}
                                <button type="button" className="btn-close" onClick={() => SetError('')} aria-label="Close"></button>
                            </div>
                        }
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" value={username} onChange={(prev) => SetUsername(prev.target.value)} className="form-control" placeholder='username' />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastname" className="form-label">Lastname</label>
                            <input type="text" value={lastname} onChange={(prev) => SetLastname(prev.target.value)} className="form-control" placeholder='lastname' />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" value={email} onChange={(prev) => SetEmail(prev.target.value)} className="form-control" placeholder='email' />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" value={password} onChange={(prev) => SetPassowrd(prev.target.value)} className="form-control" placeholder='password' />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register;
