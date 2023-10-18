import React, { useContext } from 'react';
import { PiChecks } from 'react-icons/pi';
import { baseURL } from '../../App';
import moment from 'moment';
import { MainContext } from '../Auth/AuthContext';

const OwnChats = ({
    c,
    oponent,
    chatData,
    setViewIMg,
     
}) => {
    const { user } = useContext(MainContext)
    return (
        <>
            <div key={c._id} className='flex items-end flex-col justify-start  w-full mb-4'>
                <div>

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
                        <p className=' whitespace-pre-wrap bg-gray-300 max-w-[300px]  md:max-w-[500px] rounded-tr-xl rounded-s-xl px-4 py-2 text-black'>{c?.message}</p>
                    }

                    <p className='text-xs opacity-90 text-right mt-1'>{moment(c.createdAt).fromNow()}</p>
                </div>
                {/* <p className={`text-right ${chatData?.length == 0 && 'hidden'} ${c?.seenBy.find(s => s == oponent?._id) ? 'text-green-600 hidden' : ''}`}>hello</p> */}
                <PiChecks className={`text-right ${chatData?.length == 0 && 'hidden'} ${c?.seenBy.filter(s => s != user?._id).length > 0 ? 'text-green-600 hidden' : ''}`}></PiChecks>

            </div>
        </>
    );
};

export default OwnChats;