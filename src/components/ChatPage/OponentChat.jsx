import React, { useContext } from 'react';
import { MainContext } from '../Auth/AuthContext';
import { baseURL } from '../../App';
import moment from 'moment';

const OponentChat = ({
    c,
    pImg,
    senderCheck,
    chatInfo,
    setViewIMg,
    
}) => {
    const {user, chatList} = useContext(MainContext);
    return (
        <>
            <div key={c._id} className='flex  items-start justify-start gap-2 w-full mb-4'>
                {chatInfo?.chatType == 'group' && <img className='h-8 w-8 rounded-full' src={baseURL + '/uploads/' + pImg} alt="" />}
                <div>
                    {chatInfo?.chatType == 'group' && <p className='text-xs opacity-90 text-left mt-1'>{senderCheck?.name || chatInfo?.createUserDetails?.name}</p>}

                    {c?.image || c?.video ?
                        <>
                            {c?.image && <img
                                onClick={() => {
                                    setViewIMg(baseURL + '/uploads/' + c?.image)
                                    window.my_modal_2.showModal()
                                }}
                                src={baseURL + '/uploads/' + c?.image} className='max-w-[200px] cursor-pointer lg:max-w-[300px]' alt="" />}
                            {c?.video && <video src={baseURL + '/videos/' + c?.video} className='max-w-[200px] lg:max-w-[300px]' controls></video>}
                        </> :
                        <p className='whitespace-pre-wrap bg-gradient-to-r from-cyan-500 to-blue-500  max-w-[300px]  md:max-w-[500px] rounded-e-xl rounded-ss-xl px-4 py-2 text-white'>{c?.message}</p>
                    }

                    <p className='text-xs opacity-90 text-right mt-1'>{moment(c.createdAt).fromNow()}</p>
                </div>

            </div>
        </>
    );
};

export default OponentChat;