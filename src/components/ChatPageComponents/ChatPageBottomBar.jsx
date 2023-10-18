import React, { useContext } from 'react';
import { baseURL } from '../../App';
import { IoSend, IoSendSharp } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import { HiOutlineLink } from 'react-icons/hi';
import { MainContext } from '../Auth/AuthContext';

const ChatPageBottomBar = ({
    text,
    setText,
    createChat,
    inputref,
    id,
    oponent,
    typingHandler,
    emojis,
    

}) => {
    const {user, chatList} = useContext(MainContext);
    return (
        <>
            <form onSubmit={createChat} className="bg-white border-t py-5 px-5 gap-4 flex items-center">

                <div className="dropdown dropdown-top">
                    <BsEmojiSmile tabIndex={0} className='text-xl cursor-pointer'></BsEmojiSmile>

                    <div tabIndex={0} className="dropdown-content z-[1]  menu  shadow bg-white w-[280px] p-2 h-[400px] ">
                        <div className='overflow-hidden user-select-none emoji-picker overflow-y-auto flex flex-wrap gap-3 '>
                            {emojis.map((emoji, index) => (
                                <span
                                    key={index}
                                    className={`cursor-pointer text-2xl `}
                                    onClick={() => setText(prev => prev + emoji)}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="dropdown dropdown-top">
                    <HiOutlineLink tabIndex={0} className='text-xl cursor-pointer'></HiOutlineLink>
                    <ul tabIndex={0} className="dropdown-content  z-[1] menu p-2 shadow bg-white border font-semibold rounded-box w-52">
                        <li><label htmlFor="img"><a>Photo</a></label></li>
                        <li><label htmlFor="video"><a>Video</a></label></li>
                    </ul>
                </div>
                <textarea
                    ref={inputref}
                    onKeyDown={(e) => {

                        if (e.key === 'Enter' && !e.shiftKey) {
                            createChat(e);
                        }
                    }}
                    onChange={e => {
                        setText(e.target.value)
                        typingHandler(e);
                    }}
                    value={text}
                    className="flex-grow focus:outline-none bg-transparent md:py-2"
                    placeholder='Type a message...' type="text" name="message"
                    rows={1}
                ></textarea>
                {text.length > 0 && <IoSend
                    onClick={createChat}
                    className='text-2xl cursor-pointer text-blue-600'></IoSend>}

                {/* <AudioRecorder
    onRecordingComplete={addAudioElement}
    recorderControls={recoderControler}
/> */}
                {/* <input onChange={e => setText(e.target.value)}
    id="" /> */}

            </form>

            <input
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('jsonData', JSON.stringify({
                        chatId: id,
                        message: 'image',
                        reciver: oponent?._id,
                        type: 'image'
                    }));

                    e.target.value = null;


                    fetch(`${baseURL}/chat/img`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                        body: formData
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                        })
                }}
                type="file"
                className='h-0 w-0 overflow-hidden'
                name="img"
                id="img" />
            <input
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return
                    const formData = new FormData();
                    formData.append('video', file);
                    formData.append('jsonData', JSON.stringify({
                        chatId: id,
                        message: 'video',
                        reciver: oponent?._id,
                        type: 'video'
                    }));

                    e.target.value = null;

                    fetch(`${baseURL}/chat/video`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                        body: formData
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }}
                type="file"
                className='h-0 w-0 overflow-hidden'
                name="video"
                id="video" />

        </>
    );
};

export default ChatPageBottomBar;