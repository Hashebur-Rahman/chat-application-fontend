import React, { useContext, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { baseURL } from '../../App';
import { MainContext } from '../Auth/AuthContext';

const Login = () => {
    const [passState, setPassState] = useState('password');
    const { setUser, user, load } = useContext(MainContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    

    const handle = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!email || !password) {
            setError('Please fill all the fields');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }



        fetch(`${baseURL}/account/sign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLoading(false);
                    setError('');
                    Swal.fire(
                        'Login Successfully!',
                        '',
                        'success'
                    )
                    localStorage.setItem('token', data.token);
                    setUser(data.userInfo);

                    navigate('/');
                    // window.location.href = '/login';
                }
                else {
                    setError(data.message);
                    setLoading(false);
                    console.log(data);
                }
            })

    }
    return (
        <div>
            <div className="lg:flex ">
                <div className="lg:w-1/2 xl:max-w-screen-sm lg:flex lg:justify-center lg:items-center">

                    <div className="mt-10 lg:mt-0 px-12 sm:px-24 md:px-48 lg:px-12  xl:px-24 xl:max-w-2xl w-full">
                        <h2 className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">Log in</h2>
                        <div className="mt-12">
                            {error && <p className='text-red-500  my-4 text-lg'>{error}</p>}
                            <form onSubmit={handle}>
                                <div>
                                    <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        name='email'
                                        className="w-full text-lg py-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                        type="text"
                                        placeholder="mike@gmail.com"
                                    />
                                </div>
                                <div className="mt-8 relative">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm font-bold text-gray-700 tracking-wide">Password</div>
                                        <div>
                                            <a
                                                className="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                            >
                                                Forgot Password?
                                            </a>
                                        </div>
                                    </div>
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        name='password'
                                        className="w-full text-lg bg-transparent py-2 border-b pe-10 border-gray-300 focus:outline-none focus:border-indigo-500"
                                        type={passState}
                                        placeholder="Enter your password"
                                    />
                                    {passState == 'password' ? <FaEyeSlash onClick={() => setPassState('text')} className='absolute right-2  top-9 cursor-pointer opacity-60 text-xl'></FaEyeSlash> : <FaEye onClick={() => setPassState('password')} className='absolute right-2  top-9 cursor-pointer opacity-60 text-xl'></FaEye>}
                                </div>
                                <div className="mt-10">
                                    <button
                                        disabled={loading}
                                        className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display flex justify-center items-center gap-2 focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg"
                                        type="submit"
                                    >
                                        {loading && <FaSpinner className='text-lg animate-spin'></FaSpinner>}
                                        Log In
                                    </button>

                                </div>
                            </form>
                            <div className="mt-7 text-sm font-display font-semibold text-gray-700 text-center">
                                Don't have an account? <Link to='/register' className="cursor-pointer text-indigo-600 hover:text-indigo-800">Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex items-center justify-center  flex-1 h-screen">
                    <div className=" transform duration-200  cursor-pointer">
                        <img src={'https://media.tenor.com/p0G_bmA2vSYAAAAd/login.gif'} className='w-full scale-x-[-1]' alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;