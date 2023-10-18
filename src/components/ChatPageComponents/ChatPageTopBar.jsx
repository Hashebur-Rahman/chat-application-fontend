import React, { useContext } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MainContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../App';

const ChatPageTopBar = ({
    name,
    imgUrl,
    chatInfo,
    chatLoad,
    deleteFunction,
}) => {
    const navigate = useNavigate();
    const {user, chatList} = useContext(MainContext);
    return (
        <>
            <div className='flex lg:px-10 px-5 py-4 bg-white border-b justify-between items-center'>
                <div className=" flex items-center gap-4">
                    <MdKeyboardArrowLeft
                        onClick={() => navigate('/')}
                        className='md:hidden text-3xl cursor-pointer'></MdKeyboardArrowLeft>
                    {chatLoad ? <p className='w-11 h-11 rounded-full bg-slate-300 animate-pulse'></p> : <img
                        onClick={() => window.oponent_profile_details.showModal()}
                        className='h-11 cursor-pointer w-11 rounded-full' src={baseURL + '/uploads/' + imgUrl} alt="" />}
                    {chatLoad ? <p className='h-5 w-14 rounded-full bg-slate-300 animate-pulse'></p> : <h1 className="text-xl font-medium flex items-center gap-1">{name}
                        <span className='opacity-50 font-normal'>{chatInfo?.chatType == 'group' && '(group)'}</span></h1>}
                </div>

                {!chatLoad && <div>
                    {chatInfo?.chatType == 'private' && <div className="dropdown dropdown-end">
                        <BiDotsVerticalRounded tabIndex={0} className='text-2xl cursor-pointer'></BiDotsVerticalRounded>
                        <div tabIndex={0} className="dropdown-content z-[1] menu p-2 bg-transparent rounded-box w-52">
                            <p
                                onClick={deleteFunction}
                                className='flex items-center gap-2 text-white cursor-pointer px-2 py-2 rounded-md bg-red-500'>
                                <AiFillDelete
                                    className='text-xl '></AiFillDelete> Delete Chat</p>
                        </div>
                    </div>}
                    {chatInfo?.chatType == 'group' && <>
                        {chatInfo?.createUserDetails?._id == user?._id &&
                            <div className="dropdown dropdown-end">
                                <BiDotsVerticalRounded tabIndex={0} className='text-2xl cursor-pointer'></BiDotsVerticalRounded>
                                <div tabIndex={0} className="dropdown-content z-[1] menu p-2 bg-transparent rounded-box w-52">
                                    <p
                                        onClick={deleteFunction}
                                        className='flex items-center gap-2 text-white cursor-pointer px-2 py-2 rounded-md bg-red-500'>
                                        <AiFillDelete
                                            className='text-xl '></AiFillDelete> Delete Chat</p>
                                </div>
                            </div>
                        }
                    </>}
                </div>}
            </div>
        </>
    );
};

export default ChatPageTopBar;