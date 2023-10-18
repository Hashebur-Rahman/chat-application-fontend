import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthContext from './components/Auth/AuthContext.jsx'
import Login from './components/Authentication/Login.jsx'
import Signup from './components/Authentication/Signup.jsx'
import Protected from './components/ProtectedRoute/Protected.jsx'
import InitialPage from './components/InitialPage/InitialPage.jsx'
import ChatPage from './components/ChatPage/ChatPage.jsx'
import LoginRouteProtected from './components/ProtectedRoute/LoginRouteProtected.jsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <Protected><App /></Protected>,
    children: [
      {
        path: '/',
        element: <InitialPage></InitialPage>
      },
      {
        path: '/chat/:id',
        element: <ChatPage></ChatPage>
      }
    ]
  },
  {
    path: '/login',
    element: <LoginRouteProtected><Login /></LoginRouteProtected>
  },
  {
    path: '/register',
    element: <LoginRouteProtected><Signup /></LoginRouteProtected>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='text-black bg-white'>
      <AuthContext>
        <RouterProvider router={router} />
      </AuthContext>
    </div>
  </React.StrictMode>,
)
