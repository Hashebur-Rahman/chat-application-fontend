import { AiFillCloseSquare } from "react-icons/ai";
import { FaArrowRight, FaSearch, FaSpinner } from "react-icons/fa";
import { baseURL } from "../../App";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../Auth/AuthContext";

const AddUserModal = () => {
    const [searchUserInput, setSearchUserInput] = useState('')
    const [searchUser, setSearchUser] = useState([])
    const [grpSelectuser, setGrpSelectuser] = useState([])
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const navigate = useNavigate()
    const [createGroupError, setCreateGroupError] = useState('')
    const [groupLoad, setGroupLoad] = useState(false)
    const { user, chatList } = useContext(MainContext)
    const [groupName, setGroupName] = useState('')
    const [groupImage, setGroupImage] = useState(null)

    const searchUserHandler = (e) => {
        e.preventDefault()
        if (!searchUserInput) return setSearchUser([])
        setLoading(true)
        fetch(`${baseURL}/chatList/search/${searchUserInput}`, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setSearchUser(data?.userList)
                // setSearchUser(data)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }


    const newChatListCreate = (d) => {
        setLoading2(true)
        fetch(`${baseURL}/chatList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                participent: [d?._id],
                chatType: 'private'
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.success) {
                    setLoading2(false)
                    console.log(data)
                    setSearchUser([])
                    setSearchUserInput('')
                    navigate(`/chat/${data?.chatInfo?._id}`)
                    window.add_user_modal.close()
                }
                else {
                    setLoading2(false)
                    console.log(data)
                }
            })
            .catch(err => {
                setLoading2(false)
                console.log(err)
            })
    }

    const selectUserForGroup = (u) => {
        if (grpSelectuser?.find(d => d?._id == u?._id)) {
            setGrpSelectuser(prev => prev.filter(d => d?._id != u?._id))
        }
        else {
            setGrpSelectuser(prev => [...prev, u])
        }
    }

    const createGroupHandler = () => {
        setCreateGroupError('')

        if (!groupName) return setCreateGroupError('Group name is required')
        if (!groupImage) return setCreateGroupError('Group image is required')

        setGroupLoad(true)

        const formData = new FormData()
        formData.append('image', groupImage)
        formData.append('jsonData', JSON.stringify({
            groupName,
            participent: grpSelectuser.map(d => d?._id)
        }))

        fetch(`${baseURL}/chatList/group`, {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: formData

        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setGroupLoad(false)
                if (data.success) {
                    window.details_group_modal.close()
                    navigate(`/chat/${data?.chatInfo?._id}`)
                }
            })
            .catch(err => {
                setGroupLoad(false)
                setCreateGroupError('Something went wrong')
            })
    }


    return (
        <>
            <dialog id="add_user_modal" className="modal px-4">
                <div className="modal-box w-full bg-white overflow-y-auto max-w-3xl rounded-none relative ">
                    {loading2 && <p className="absolute top-2 left-2/4 -translate-x-2/4 rounded-md animate-pulse bg-black text-white p-3 py-1">Please wait...</p>}
                    <AiFillCloseSquare
                        onClick={() => {
                            setSearchUser([])
                            setSearchUserInput('')
                            window.add_user_modal.close()
                        }}
                        className='absolute cursor-pointer top-0 right-0 text-4xl'>
                    </AiFillCloseSquare>
                    <form onSubmit={searchUserHandler} className=' mb-4 py-2 mt-7'>
                        <div className=' flex items-center gap-2 border-green-500 border-b'>
                            <input
                                onChange={e => setSearchUserInput(e.target.value)}
                                value={searchUserInput}
                                type="text"
                                placeholder='search by email or username'
                                name="chatlistname"
                                className='w-full  bg-white focus:outline-none  py-1 px-5'
                                id="" />
                            {!loading && <FaSearch onClick={searchUserHandler} className='bg-green-500 hover:bg-green-700 p-2 cursor-pointer text-5xl  text-white btn'></FaSearch>}
                            {loading && <span className='bg-green-500 hover:bg-green-700'><FaSpinner className=' p-2 animate-spin text-5xl  text-white'></FaSpinner></span>}
                        </div>
                    </form>

                    {!loading && <div>
                        {searchUser.length > 0 ?
                            <div>
                                {searchUser.map((user, index) => (
                                    <div
                                        onClick={() => newChatListCreate(user)}
                                        key={index}
                                        className='flex items-center gap-4 border-b py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-200'
                                    >
                                        <img className='h-16 w-16 ' src={baseURL + '/uploads/' + user?.profileImg} alt="" />
                                        <div>
                                            <h1 className='text-lg font-medium'>{user?.name}</h1>
                                            <p className='text-sm text-gray-500'>{user?.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            : <h1 className='text-lg text-center font-medium '>No user found!!</h1>}
                    </div>}
                </div>
            </dialog>



            <dialog id="add_group_modal" className="modal px-4">
                <div className="modal-box w-full bg-white overflow-y-auto max-w-3xl rounded-none relative ">
                    <AiFillCloseSquare
                        onClick={() => {
                            window.add_group_modal.close()
                        }}
                        className='absolute cursor-pointer top-0 right-0 text-4xl'>
                    </AiFillCloseSquare>

                    <h1 className="text-center text-xl font-semibold mb-7">Create Group</h1>

                    {grpSelectuser?.length > 0 && <div div className="flex flex-wrap gap-4 p-3 rounded-md border">
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
                                window.add_group_modal.close()
                                window.details_group_modal.showModal()
                            }}
                            className="btn btn-neutral btn-sm mt-1 mb-4 text-white flex items-center gap-3 ms-auto me-2">next <FaArrowRight /></button>
                    </div>}

                    {chatList.map((c, index) => {
                        if (c?.createUser?._id == c?.participent[0]?._id) return
                        if (c.chatType == 'private') {

                            const findChatUser = c?.createUser?._id == user?._id ? c?.participent[0] : c?.createUser

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



            <dialog id="details_group_modal" className="modal px-4">
                <div className="modal-box w-full bg-white overflow-y-auto max-w-3xl rounded-none relative ">
                    <AiFillCloseSquare
                        onClick={() => {
                            window.details_group_modal.close()
                        }}
                        className='absolute cursor-pointer top-0 right-0 text-4xl'>
                    </AiFillCloseSquare>

                    {groupLoad && <p className="absolute top-2 left-2/4 -translate-x-2/4 rounded-md animate-pulse bg-black text-white p-3 py-1">Please wait...</p>}




                    <h1 className="text-center text-xl font-semibold mb-7">Group Details</h1>
                    <p className="text-red-500">{createGroupError}</p>
                    <input
                        onChange={e => setGroupName(e.target.value)}
                        type="text"
                        placeholder="Group Name*"
                        className="px-2 focus:outline-none py-1 border-gray-500  bg-transparent w-full  border-b mb-4"
                    />
                    <p className="mb-1">Group Image*:</p>
                    <input
                        onChange={e => setGroupImage(e.target.files[0])}
                        type="file"
                        className="file-input file-input-bordered w-full bg-transparent"
                    />

                    {<div className="text-right">
                        <button
                            onClick={() => {
                                createGroupHandler()
                            }}
                            className="btn btn-primary btn-sm mt-4 text-white flex items-center gap-3 ms-auto me-2">Create Group <FaArrowRight /></button>
                    </div>}



                </div>
            </dialog >




        </>
    );
};

export default AddUserModal;