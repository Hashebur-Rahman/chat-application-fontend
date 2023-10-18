import React, { useContext, useEffect } from 'react';

import { MainContext } from '../Auth/AuthContext';
import addChatlistNotification from '../../assets/audio/treasure.mp3';



const SocketIoHandle = () => {
    const {
        user,
        setUser,
        load,
        setLoad,
        chatList,
        setChatList,
        chatListLoad,
        setChatListLoad,
        socket
    } = useContext(MainContext)



    useEffect(() => {
        socket.on('newChatListCreate', async (change) => {
            if (change.chatInfo.participent.find(p => p._id == user._id) || change.chatInfo.createUser._id == user._id) {
                console.log('yes');
                setChatList(prev => [change.chatInfo, ...prev]);
                new Audio(addChatlistNotification).play();
            }

        });
        return () => {
            socket.off('newChatListCreate');
        };
    }, []);

    return (
        <>

        </>
    );
};

export default SocketIoHandle;