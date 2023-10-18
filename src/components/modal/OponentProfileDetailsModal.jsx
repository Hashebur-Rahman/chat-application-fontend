import React, { useContext } from 'react';
import { MainContext } from '../Auth/AuthContext';
import { AiOutlineClose } from 'react-icons/ai';
import moment from 'moment';
import { baseURL } from '../../App';

const OponentProfileDetailsModal = ({
    oponent,
    name,
    imgUrl,
    chatInfo,
    userRemoveLoad,
    groupUserRemove

    
}) => {

    const { user } = useContext(MainContext);
    return (
        <>
            <dialog id="oponent_profile_details" className="modal px-3">
                <div className="modal-box bg-white max-w-xl relative">

                    {userRemoveLoad && <p className="absolute top-2 left-2/4 -translate-x-2/4 rounded-md animate-pulse bg-black text-white p-3 py-1">Please wait...</p>}

                    <AiOutlineClose
                        onClick={() => window.oponent_profile_details.close()}
                        className='absolute right-4 text-2xl cursor-pointer top-4'></AiOutlineClose>
                    <img className="h-24 w-24 mx-auto rounded-full" src={baseURL + '/uploads/' + imgUrl} alt="" />
                    <h1 className="text-center text-2xl font-semibold capitalize mt-3">{name}</h1>
                    {chatInfo?.chatType == 'private' && <p className="text-center mt-1 text-lg">{oponent?.email}</p>}
                    {chatInfo?.chatType == 'private' && <p className="text-center mt-1 opacity-50">Join at: {moment(oponent?.createdAt).format('MMMM Do YYYY')}</p>}
                    {chatInfo?.chatType == 'group' && <div>
                        <p className='font-semibold mt-2 text-lg'>Group Member:</p>
                        <div className='flex items-center border-b bg-slate-200 px-2 py-1 gap-2 mt-2'>
                            <img className='h-8 w-8 rounded-full' src={baseURL + '/uploads/' + chatInfo?.createUserDetails?.profileImg} alt="" />
                            <p className='flex items-center gap-1'>{chatInfo?.createUserDetails?.name} <span>(admin)</span></p>
                        </div>
                        {chatInfo?.participentDetails.map((p, index) => {
                            return <div key={index} className=' border-b items-center flex justify-between bg-slate-200 px-2 py-1  mt-2'>
                                <div className='flex items-center gap-2'>
                                    <img className='h-8 w-8 rounded-full' src={baseURL + '/uploads/' + p?.profileImg} alt="" />
                                    <p>{p?.name}</p>
                                </div>
                                {chatInfo?.createUserDetails?._id == user?._id && <button onClick={() => groupUserRemove(p?._id)} className='btn btn-sm btn-error'>remove</button>}
                            </div>
                        })}
                        {chatInfo?.createUserDetails?._id == user?._id && <div className='text-right mt-3'>
                            <button onClick={() => window.add_new_grp_user_modal.showModal()} className="btn btn-sm btn-primary">add new member</button>
                        </div>}
                    </div>}
                </div>
            </dialog>
        </>
    );
};

export default OponentProfileDetailsModal;