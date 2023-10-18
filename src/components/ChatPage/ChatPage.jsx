import EmojiPicker from 'emoji-picker-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { HiOutlineLink } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../App';
import { MainContext } from '../Auth/AuthContext';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import sound from '../../assets/audio/facebookchat.mp3';
import sound2 from '../../assets/audio/out-of-nowhere-message-tone.mp3';
import { PiChecks } from 'react-icons/pi';
import Lottie from 'react-lottie';
import typingAnimation from '../../components/LottieAnimation/TypingAnimation.json';
import ChatList from '../ChatList/ChatList';
import Wrap from '../Wrap/Wrap';
import ScrollableFeed from 'react-scrollable-feed'
import ScrollableFeedVirtualized from 'react-scrollable-feed-virtualized'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { IoSend } from 'react-icons/io5';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import { AiFillCloseSquare, AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import AddNewGrpUserModal from '../modal/AddNewGrpUserModal';
import ShowImgModal from '../modal/ShowImgModal';
import OponentProfileDetailsModal from '../modal/OponentProfileDetailsModal';
import ChatLoadItem from '../ChatListLoadItem/ChatLoadItem';
import OwnChats from '../Chats/OwnChats';
import OponentChat from './OponentChat';
import ChatPageTopBar from '../ChatPageComponents/ChatPageTopBar';
import ChatPageBottomBar from '../ChatPageComponents/ChatPageBottomBar';




const ChatPage = () => {
    const [text, setText] = useState('')
    const id = useParams().id;
    const [chatInfo, setChatInfo] = useState({})
    const [chatData, setChatData] = useState([])
    const [chatLoad, setChatLoad] = useState(true)
    const navigate = useNavigate();
    const [loadMore, setLoadMore] = useState(false)
    const { user, socket, chatList, setChatList } = useContext(MainContext)
    const oponent = chatInfo?.createUserDetails?._id == user?._id ? chatInfo?.participentDetails[0] : chatInfo?.createUserDetails;
    const [typing, setTyping] = useState(false);
    const [typingTf, setTypingTf] = useState(false)
    const inputref = useRef(null)
    const [grpSelectuser, setGrpSelectuser] = useState([])
    const [newMemberAddLoad, setNewMemberAddLoad] = useState(false)


    useEffect(() => {
        inputref.current.focus()
    }, [id])


    const newChatAdded = (change) => {

        // console.log(change.chatInfo);

        const mathChat = chatList?.find((d) => d?._id == change?.chatInfo?.chatId);
        // console.log(mathChat);
        if (mathChat) {
            if (id != change?.chatInfo?.chatId) {
                toast(change?.chatInfo?.message, {
                    onClick: () => {
                        navigate(`/chat/${change?.chatInfo?.chatId}`);
                    }
                })
                const audio = new Audio(sound2);
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







        if (change?.chatInfo?.chatId == id) {
            // console.log(change.chatInfo);

            // setText('');
            // console.log(change.chatInfo);
            setChatData(prev => [...prev, change.chatInfo]);
            const audio = new Audio(sound).play()

            if (change.chatInfo.sender == user?._id) setTypingTf(false)

            if (change.chatInfo.sender != user?._id || change?.chatInfo?.sender == change?.chatInfo?.reciver) {

                // console.log(change.chatInfo?._id);

                setTyping(false);
                socket.emit('seenByOn', { chatId: id, seenByUser: user?._id, senMessageId: [change.chatInfo._id] })

                fetch(`${baseURL}/chat/seenBy`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        unSeenId: [change.chatInfo._id]
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);
                    })
            }
        }
    }

    // new chat create
    useEffect(() => {
        socket.on('newChatAdd', newChatAdded);
        return () => {
            socket.off('newChatAdd');
        };
    }, [newChatAdded, chatList, id]);

    // console.log(user?._id);

    // catch seenBy
    useEffect(() => {
        socket.on('seenBy', async (change) => {
            if (change?.chatId == id) {
                // console.log(change?.senMessageId);
                setChatData(prev => prev.map(c => {
                    const seen = change?.senMessageId.find(s => s == c._id)
                    if (seen) {
                        c.seenBy = [...c.seenBy, change.seenByUser]
                        return c
                    }
                    else {
                        return c
                    }
                }))
            }

        });
        return () => {
            socket.off('seenBy');
        };
    }, [id, chatList]);


    useEffect(() => {
        if (chatData.length === 0) return
        const findUnSeenChat = chatData?.filter(c => {
            const chk = c.seenBy?.find(s => s == user?._id)
            if (chk) return
            else return c._id
        })
        const onlyId = findUnSeenChat?.map(c => c._id)
        // console.log(onlyId);
        if (onlyId.length > 0) {
            socket.emit('seenByOn', { chatId: id, seenByUser: user?._id, senMessageId: onlyId })
            fetch(`${baseURL}/chat/seenBy`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    unSeenId: onlyId
                })
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                })
        }

    }, [chatLoad])

    useEffect(() => {
        setTyping(false);
        setChatData([])
        setChatLoad(true);
        fetch(`${baseURL}/chatList/chat/${id}?skip=0`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.success) {
                    // console.log(data);
                    setChatInfo(data);
                    setChatData(data.chat);
                    setChatLoad(false);
                    if (data.chat.length >= 15) {
                        setLoadMore(true)
                    }
                    else {
                        setLoadMore(false)
                    }
                }
                else {
                    setChatInfo({});
                    setChatData([]);
                    setChatLoad(false);
                    navigate('/');
                }
            })
            .catch(err => {
                navigate('/');
                setChatInfo({});
                setChatData([]);
                setChatLoad(false);
            })
    }, [id])

    useEffect(() => {
        socket.on('typing_start', async (change) => {
            // console.log(id);
            if (change.chatId == id && change.action != user?._id) {
                setTyping(true);
            }

        });
        return () => {
            socket.off('typing_start');
        };
    }, [id])
    useEffect(() => {
        socket.on('typing_end', async (change) => {
            if (change.chatId == id && change.action != user?._id) {
                setTyping(false);
            }

        });
        return () => {
            socket.off('typing_end');
        };
    }, [id])

    // console.log(chatLoad);

    const createChat = (e) => {
        if (!user || chatLoad) return
        inputref.current.focus()
        e.preventDefault();
        if (!text) return;
        const text2 = text
        setText('');
        fetch(`${baseURL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                chatId: id,
                message: text2,
                reciver: oponent?._id,
                type: 'text'
            })
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                // if (data.success) {
                //     console.log(data);
                //     setText('');
                // }
                // else {
                //     console.log(data);
                // }
            })
            .catch(err => {
                console.log(err);
                navigate('/');
            })
    }

    const groupUserRemove2 = (change) => {
        if (change?.userId == user?._id && change?.chatId == id) {
            navigate('/');
        }
    }


    useEffect(() => {
        socket.on('group User Remove2', groupUserRemove2);
        return () => {
            socket.off('group User Remove2');
        };
    }, [groupUserRemove2])

    const loadMoreChat = () => {
        if (chatLoad) return
        fetch(`${baseURL}/chatList/chat/${id}?skip=${chatData.length}`,
            {
                headers:
                    { 'Authorization': `${localStorage.getItem('token')}` }
            })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.success) {
                    console.log(data);
                    setChatInfo(data);
                    setChatData(prev => [...data.chat, ...prev]);
                    setChatLoad(false);
                    if (data.chat.length >= 15) {
                        setLoadMore(true)
                    }
                    else {
                        setLoadMore(false)
                    }
                }
                else {
                    setChatInfo({});
                    setChatData([]);
                    setChatLoad(false);
                    navigate('/');
                }
            })
            .catch(err => {
                navigate('/');
                setChatInfo({});
                setChatData([]);
                setChatLoad(false);
            })
    }



    const typingHandler = (e) => {
        if (chatLoad) return

        if (!typingTf) {
            setTypingTf(true)
            socket.emit('typingOn', { chatId: id, action: user?._id })


            var timerLength = 4000;
            setTimeout(() => {
                socket.emit('typingOf', { chatId: id, action: user?._id })
                setTypingTf(false)

            }, timerLength);
        }

    };

    const addNewGroupMember = () => {
        if (grpSelectuser.length == 0) return
        setNewMemberAddLoad(true)
        fetch(`${baseURL}/chatList/groupUserAdd`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                chatId: id,
                newUser: grpSelectuser
            })
        })
            .then(res => res.json())
            .then(data => {
                setNewMemberAddLoad(false)
                if (data.success) {

                    setChatInfo(prev => {
                        return {
                            ...prev,
                            participentDetails: data?.chatInfo?.participent
                        }
                    })
                    setGrpSelectuser([])
                    window.add_new_grp_user_modal.close()
                    console.log(data);
                }
            })
            .catch(err => {
                console.log(err);
                setNewMemberAddLoad(false)
            })
    }


    // const debug = chatData[chatData?.length - 1]?.seenBy?.find(f => f == oponent?._id && 'text-green-600')

    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', '😊', '😇', '🙂',
        '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪',
        '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁',
        '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😮‍💨', '😤', '😠', '😡', '🤬', '🤯',
        '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤔', '🫢', '🤭',
        '🤫', '🤥', '😶', '😶‍🌫️', '😐', '😑', '😬', '🫠', '🙄', '😯', '😦', '😧', '😮',
        '😲', '🥱', '😴', '🤤', '😪', '😵', '😵‍💫', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧',
        '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️',
        '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
    ];

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: typingAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    // const recoderControler = useAudioRecorder()
    // const addAudioElement = (blob) => {
    //     console.log(blob);
    // };
    const [viewIMg, setViewIMg] = useState('')

    const imgUrl = chatInfo?.chatType == 'group' ? chatInfo?.groupImg : oponent?.profileImg
    const name = chatInfo?.chatType == 'group' ? chatInfo?.groupName : oponent?.name
    const [userRemoveLoad, setUserRemoveLoad] = useState(false)

    const groupUserRemove = (userId) => {
        setUserRemoveLoad(true)
        fetch(`${baseURL}/chatList/groupUserRemove`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                chatId: id,
                userId: userId
            })
        })
            .then(res => res.json())
            .then(data => {
                setUserRemoveLoad(false)
                if (data.success) {
                    setChatInfo(prev => {
                        const newParticipent = prev.participentDetails.filter(p => p._id != userId)
                        return {
                            ...prev,
                            participentDetails: newParticipent
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err);
                setUserRemoveLoad(false)
            })
    }

    const selectUserForGroup = (u) => {
        if (grpSelectuser.find(f => f._id == u._id)) {
            setGrpSelectuser(prev => prev.filter(f => f._id != u._id))
        }
        else {
            setGrpSelectuser(prev => [...prev, u])
        }
    }

    const [deleteLoad, setDeleteLoad] = useState(false)

    const deleteFunction = () => {
        setDeleteLoad(true)
        fetch(`${baseURL}/chatList/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setDeleteLoad(false)
                console.log(data);
                // if (data.success) {
                //     navigate('/')
                // }
            })
            .catch(err => {
                setDeleteLoad(false)
                console.log(err);
            })
    }


    useEffect(() => {
        socket.on('chat Delete2', (change) => {
            if (change?.chatId == id) {
                navigate('/')
            }
        });
        return () => {
            socket.off('chat Delete2');
        };
    }, [id])



    return (
        <div className="h-screen flex flex-col w-full overflow-x-auto relative">

            {deleteLoad && <p className="absolute top-2 left-2/4 -translate-x-2/4 rounded-md animate-pulse bg-black text-white p-3 py-1">Please wait...</p>}

            <div className='flex-grow'>
                <ChatPageTopBar
                    name={name}
                    imgUrl={imgUrl}
                    chatInfo={chatInfo}
                    chatLoad={chatLoad}
                    deleteFunction={deleteFunction}
                ></ChatPageTopBar>
            </div>


            {
                chatLoad ?
                    <ChatLoadItem></ChatLoadItem>
                    :
                    <ScrollToBottom

                        initialScrollBehavior='smooth'
                        className="  px-5 max-w-6xl mx-auto w-full  overflow-x-hidden lg:px-10 py-3 overflow-y-auto flex flex-col  ">



                        {loadMore && <div className='text-center'>
                            <button onClick={loadMoreChat} className="btn btn-sm btn-primary mb-3">Load more</button>
                        </div>}


                        <div>

                            {chatData.map((c, index) => {


                                const senderCheck = chatInfo?.participentDetails?.find(p => p._id == c.sender)
                                const pImg = senderCheck?.profileImg || chatInfo?.createUserDetails?.profileImg


                                return c.sender == user._id ?
                                    <OwnChats
                                        key={c._id}
                                        c={c}
                                        oponent={oponent}
                                        chatData={chatData}
                                        setViewIMg={setViewIMg}
                                    ></OwnChats>
                                    :
                                    <OponentChat
                                        key={c._id}
                                        c={c}
                                        pImg={pImg}
                                        senderCheck={senderCheck}
                                        chatInfo={chatInfo}
                                        setViewIMg={setViewIMg}
                                    ></OponentChat>
                            }
                            )}
                            {chatData[chatData.length - 1]?.seenBy?.filter(s => s != user?._id).length > 0 && <PiChecks className={`text-right text-green-600 ms-auto text-xl -mt-1 ${chatData[chatData.length - 1].sender != user?._id && 'hidden'}`}></PiChecks>}
                        </div>



                        {typing && <div className='flex items-center gap-1 mt-6 '>
                            <img className='h-8 w-8 rounded-full' src={baseURL + '/uploads/' + imgUrl} alt="" />
                            <div className='bg-gray-200 rounded-e-xl rounded-ss-xl' >
                                <Lottie
                                    options={defaultOptions}
                                    height={35}
                                    width={70}
                                    style={{ margin: '0 0 0 0' }}
                                    className={` ml-0`}
                                ></Lottie>
                            </div>
                        </div>}




                    </ScrollToBottom>
            }

            <ChatPageBottomBar
                text={text}
                setText={setText}
                createChat={createChat}
                inputref={inputref}
                id={id}
                oponent={oponent}
                typingHandler={typingHandler}
                emojis={emojis}

            ></ChatPageBottomBar>


            <OponentProfileDetailsModal
                oponent={oponent}
                name={name}
                imgUrl={imgUrl}
                chatInfo={chatInfo}
                userRemoveLoad={userRemoveLoad}
                groupUserRemove={groupUserRemove}
            ></OponentProfileDetailsModal>

            <ShowImgModal
                viewIMg={viewIMg}
                setViewIMg={setViewIMg}
            ></ShowImgModal>

            <AddNewGrpUserModal
                newMemberAddLoad={newMemberAddLoad}
                grpSelectuser={grpSelectuser}
                selectUserForGroup={selectUserForGroup}
                addNewGroupMember={addNewGroupMember}
                chatList={chatInfo?.participentDetails}
                chatInfo={chatInfo}
                user={user}
            ></AddNewGrpUserModal>

        </div >
    );
};

export default ChatPage;