import React, { useContext } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { baseURL } from '../../App';
import { MainContext } from '../Auth/AuthContext';

const AddNewGrpUserModal = ({
    newMemberAddLoad, 
    grpSelectuser, 
    selectUserForGroup, 
    addNewGroupMember,
    chatInfo,

  
}) => {

const { chatList, user } = useContext(MainContext);

    return (
        <>
            <dialog id="add_new_grp_user_modal" className="modal px-4">
                <div className="modal-box w-full bg-white overflow-y-auto max-w-3xl rounded-none relative ">
                    {newMemberAddLoad && <p className="absolute top-2 left-2/4 -translate-x-2/4 rounded-md animate-pulse bg-black text-white p-3 py-1">Please wait...</p>}

                    <AiFillCloseSquare
                        onClick={() => {
                            window.add_new_grp_user_modal.close()
                        }}
                        className='absolute cursor-pointer top-0 right-0 text-4xl'>
                    </AiFillCloseSquare>

                    <h1 className="text-center text-xl font-semibold mb-7">New Member Add</h1>

                    {grpSelectuser?.length > 0 && <div className="flex flex-wrap gap-4 p-3 rounded-md border">
                        {grpSelectuser.map((u, index) =>
                            <p key={u?._id}
                                className="bg-violet-600 flex items-center gap-3 text-white px-2 py-1"
                            >{u?.name} <AiFillCloseSquare
                                    onClick={() => selectUserForGroup(u)}
                                    className="text-2xl cursor-pointer" /></p>)}
                    </div>}
                    {grpSelectuser.length > 0 && <div className="text-right">
                        <button
                            onClick={() => {
                                addNewGroupMember()
                            }}
                            className="btn btn-neutral btn-sm mt-1 mb-4 text-white flex items-center gap-3 ms-auto me-2">add</button>
                    </div>}

                    {chatList.map((c, index) => {
                        if (c?.createUser?._id == c?.participent[0]?._id) return
                        if (c.chatType == 'private') {

                            const findChatUser = c?.createUser?._id == user?._id ? c?.participent[0] : c?.createUser
                            const findChatUserpast = chatInfo?.participentDetails?.find(p => p?._id == findChatUser?._id)

                            if (findChatUserpast) return


                            return <div
                                onClick={() => selectUserForGroup(findChatUser)}
                                key={c._id}
                                className="flex items-center border-b mb-3 px-4 py-2 cursor-pointer justify-between">
                                <div className=" flex  gap-4" >
                                    <img src={baseURL + '/uploads/' + findChatUser?.profileImg} className="h-14 rounded-xl w-14" alt="" />
                                    <div>
                                        <p className=" font-semibold">{findChatUser?.name}</p>
                                        <p className="font-light">{findChatUser?.email}</p>
                                    </div>
                                </div>
                                <input
                                    checked={grpSelectuser?.find(d => d?._id == findChatUser?._id)}
                                    type="checkbox"
                                    className="checkbox checkbox-primary" />
                            </div>
                        }
                    })}

                    {chatList.length == 0 && <p className="text-center">No user found!!</p>}

                </div>
            </dialog >
        </>
    );
};

export default AddNewGrpUserModal;