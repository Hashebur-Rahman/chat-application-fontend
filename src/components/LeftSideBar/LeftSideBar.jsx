import { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { IoPersonAddSharp } from "react-icons/io5";
import { MainContext } from "../Auth/AuthContext";
import ChatList from "../ChatList/ChatList";
import ChatListLoadItem from "../ChatListLoadItem/ChatListLoadItem";
import { baseURL } from "../../App";

const LeftSideBar = () => {

    const {
        user,
        setUser,
        load,
        setLoad,
        chatList,
        setChatList,
        chatListLoad,
        setChatListLoad,
        chatList2,
        setChatList2
    } = useContext(MainContext)

    const searchFilter = (e) => {
        const value = e.target.value;
        if (value.length == 0) {
            setChatList(chatList2);
            return;
        }
        const newChatList = chatList2.filter(c => {
            const match1 = c?.createUser?.name.toLowerCase().includes(value.toLowerCase())
            const match2 = c?.participent[0]?.name.toLowerCase().includes(value.toLowerCase())
            const match3 = c?.groupName?.toLowerCase().includes(value.toLowerCase())
            if (match1 || match2 || match3) {
                return c;
            }
        });
        setChatList(newChatList);
    }

    return (
        <>
            <div className=' w-full md:w-[380px]   overflow-y-auto h-full  border-e py-5'>
                <div className='flex justify-between items-center px-4 py-3 border-b mb-1'>
                    <h1 className='text-2xl font-semibold'>Chats</h1>
                    <div className='flex items-center gap-4'>
                        <IoPersonAddSharp
                            onClick={() => window.add_user_modal.showModal()}
                            className='text-xl cursor-pointer'>
                        </IoPersonAddSharp>
                        <HiUserGroup
                            onClick={() => window.add_group_modal.showModal()}
                            className='text-2xl cursor-pointer'></HiUserGroup>
                        <img
                            onClick={() => window.profile_details.showModal()}
                            className='h-10 w-10 rounded-full cursor-pointer' src={baseURL + '/uploads/' + user?.profileImg} alt="" />
                    </div>
                </div>
                <div className='px-5 mb-4 py-2'>
                    <div className=' flex items-center gap-2 border-green-500 border-b px-4'>
                        <input
                            onChange={searchFilter}
                            type="text" placeholder='search by name' name="chatlistname" className='w-full  bg-transparent focus:outline-none px-2 py-1' id="" />
                        <FaSearch></FaSearch>
                    </div>
                </div>
                {chatListLoad ?
                    <ChatListLoadItem></ChatListLoadItem>
                    :

                    <>
                        {chatList.length == 0 ?
                            <>
                                <p className='text-center text-xl font-semibold'>No Chat Found</p>

                                <div
                                    onClick={() => window.add_user_modal.showModal()}
                                    className="text-center opacity-40 mt-10 cursor-pointer">
                                    <IoPersonAddSharp className="mx-auto text-7xl border-2  p-2 border-black rounded-full"></IoPersonAddSharp>
                                    <p className="text-xl font-semibold mt-1">Add User</p>
                                </div>
                            </>
                            :

                            chatList.map((c) => <ChatList key={c._id} c={c}></ChatList>)
                        }
                    </>
                }
            </div>

            {/* You can open the modal using document.getElementById('ID').showModal() method */}

        </>
    );
};

export default LeftSideBar;