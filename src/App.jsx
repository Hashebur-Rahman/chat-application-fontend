import React, { useContext, useEffect, useState } from 'react';
import { IoPersonAddSharp } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi';
import ChatList from './components/ChatList/ChatList';
import { FaSearch, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AiFillCloseSquare, AiOutlineClose } from 'react-icons/ai';
import AddUserModal from './components/AddUserModal/AddUserModal';
import AuthContext, { MainContext } from './components/Auth/AuthContext';
import SocketIoHandle from './components/SocketIoHandle/SocketIoHandle';
import LeftSideBar from './components/LeftSideBar/LeftSideBar';
import sound from './assets/audio/out-of-nowhere-message-tone.mp3';
import sound2 from './assets/audio/treasure.mp3';
import Wrap from './components/Wrap/Wrap';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

export const baseURL = 'https://chat-backend-4iff.onrender.com'


const App = () => {
  const navigate = useNavigate();

  const { user, setUser, load, socket, setLoad, chatList, setChatList, setChatList2, chatListLoad, setChatListLoad } = useContext(MainContext);


  useEffect(() => {
    if (!user) return;

    fetch(`${baseURL}/account/active-status/online`, {
      method: 'PUT',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })

    setTimeout(() => {

    }, 20000);


  }, [user]);


  const path = useLocation().pathname;
  const chatIdPath = path?.split('/')[path?.split('/').length - 1]

  const newChatAdded = (change) => {
    if (!chatIdPath) {
      const mathChat = chatList?.find((d) => d?._id == change?.chatInfo?.chatId);
      // console.log(mathChat);
      if (mathChat) {

        if (chatIdPath != change?.chatInfo?.chatId) {
          toast(change?.chatInfo?.message, {
            onClick: () => {
              navigate(`/chat/${change?.chatInfo?.chatId}`);
            }
          })
          const audio = new Audio(sound);
          audio.play();
          console.log('yes');
        }

        setChatList(prev => [
          {
            ...mathChat,
            lastMessage: change?.chatInfo,
            updatedAt: change?.chatInfo?.updatedAt
          }
          , ...prev.filter((d) => d?._id != change?.chatInfo?.chatId)]);



      }
    }
  }



  const seenByFunction = (change) => {
    // console.log(change);
    const check = chatList?.find(c => c?._id == change?.chatId)
    // console.log(check);
    if (check) {
      // console.log(check?.lastMessage?._id, change?.senMessageId[change?.senMessageId?.length - 1]);
      if (check?.lastMessage?._id == change?.senMessageId[change?.senMessageId?.length - 1]) {
        const newChatList = chatList?.map(c => {
          if (c?._id == change?.chatId) {
            return {
              ...c,
              lastMessage: {
                ...c?.lastMessage,
                seenBy: [...c.lastMessage?.seenBy, change?.seenByUser]
              }
            }
          }
          else {
            return c;
          }
        })

        setChatList(newChatList);

      }
    }
  }

  const groupUserRemove = (change) => {
    if (change?.userId == user?._id) {
      setChatList(prev => prev.filter(c => c?._id != change?.chatId));
    }
  }

  const grpNewUserAdd = (change) => {
    if (change?.newUserId?.find(u => u == user?._id)) {
      setChatList(prev => [
        change?.chatInfo,
        ...prev.filter(c => c?._id != change?.chatInfo?._id)
      ])
      const audio = new Audio(sound2);
      audio.play();
    }
  }


  const chatDelete = (change) => {
    if (chatList?.find(c => c?._id == change?.chatId)) {
      setChatList(prev => prev.filter(c => c?._id != change?.chatId));
    }
  }


  const userOnlineStatus = (change) => {
    setChatList(prev => prev.map(c => {
      if (c?.createUser?._id == change?.userId) {
        return {
          ...c,
          createUser: {
            ...c?.createUser,
            activeStatus: true
          }
        }
      }
      else if (c?.participent?.find(p => p?._id == change?.userId)) {
        return {
          ...c,
          participent: c?.participent?.map(p => {
            if (p?._id == change?.userId) {
              return {
                ...p,
                activeStatus: true
              }
            }
            else {
              return p;
            }
          })
        }
      }
      else {
        return c;
      }
    }))
  }
  const userOflineStatus = (change) => {
    setChatList(prev => prev.map(c => {
      if (c?.createUser?._id == change?.userId) {
        return {
          ...c,
          createUser: {
            ...c?.createUser,
            activeStatus: false
          }
        }
      }
      else if (c?.participent?.find(p => p?._id == change?.userId)) {
        return {
          ...c,
          participent: c?.participent?.map(p => {
            if (p?._id == change?.userId) {
              return {
                ...p,
                activeStatus: false
              }
            }
            else {
              return p;
            }
          })
        }
      }
      else {
        return c;
      }
    }))
  }


  useEffect(() => {
    socket.on('newChatAdd2', newChatAdded);
    socket.on('seenBy2', seenByFunction);
    socket.on('group User Remove', groupUserRemove);
    socket.on('grp New User Add', grpNewUserAdd);
    socket.on('chat Delete', chatDelete);
    socket.on('user online status', userOnlineStatus);
    socket.on('user ofline status', userOflineStatus);

    return () => {
      socket.off('newChatAdd2');
      socket.off('seenBy2');
      socket.off('group User Remove');
      socket.off('grp New User Add');
      socket.off('chat Delete');
      socket.off('user online status');
      socket.off('user ofline status');
    };
  }, [newChatAdded, seenByFunction, groupUserRemove, grpNewUserAdd, chatList, chatDelete, userOnlineStatus, userOflineStatus]);





  return (
    <div className='h-screen overflow-hidden overflow-y-auto flex'>


      <div className='hidden md:block'>

        <LeftSideBar></LeftSideBar>
      </div>


      <div className='h-full flex-grow bg-slate-100 overflow-x-auto'>
        <Outlet></Outlet>
      </div>



      <AddUserModal></AddUserModal>
      <SocketIoHandle></SocketIoHandle>

      <dialog id="profile_details" className="modal px-3">
        <div className="modal-box bg-white max-w-xl relative">
          <AiOutlineClose
            onClick={() => window.profile_details.close()}
            className='absolute right-4 text-2xl cursor-pointer top-4'></AiOutlineClose>
          <img className="h-24 w-24 mx-auto rounded-full" src={baseURL + '/uploads/' + user?.profileImg} alt="" />
          <h1 className="text-center text-2xl font-semibold capitalize mt-3">{user?.name}</h1>
          <p className="text-center mt-1 text-lg">{user?.email}</p>
          <p className="text-center mt-1 opacity-50">Join at: {moment(user?.createdAt).format('MMMM Do YYYY')}</p>
          <p
            onClick={() => {
              window.profile_details.close();
              setChatList([]);
              setChatList2([]);
              localStorage.removeItem('token');
              setUser(null);
            }}
            className='text-center flex justify-center items-center gap-2 cursor-pointer text-xl mt-5 text-red-500'>Log Out <FaSignOutAlt></FaSignOutAlt></p>
        </div>
      </dialog>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </div>
  );
};

export default App;