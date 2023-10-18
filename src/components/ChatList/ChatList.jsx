import { NavLink } from "react-router-dom";
import { MainContext } from "../Auth/AuthContext";
import { useContext } from "react";
import { baseURL } from "../../App";
import moment from "moment/moment";
import { PiChecks } from "react-icons/pi";

const ChatList = ({ c }) => {
    const { user } = useContext(MainContext)

    // console.log(c);


    const findChatUser = c?.createUser?._id == user?._id ? c?.participent[0] : c?.createUser
    const lastMsg = c?.lastMessage?.seenBy?.find(s => s == user?._id)
    const imgUrl = c?.chatType == 'group' ? c?.groupImg : findChatUser?.profileImg

   

    return (
        <NavLink to={`/chat/${c._id}`} className={({ isActive }) => `flex px-5 py-5 hover:bg-gray-200 duration-150 transform shadow-sm justify-between relative items-start ${isActive && 'bg-gray-200'}`}>
            <div className="flex items-start gap-3">
                <div className="relative">
                    <img src={baseURL + '/uploads/' + imgUrl} className="h-12 w-12 rounded-full" alt="" />
                    {findChatUser?.activeStatus && <p className="h-3 absolute  bottom-0 right-0 w-3 bg-green-500 border border-white rounded-full"></p>}
                </div>
                <div>
                    <p className="font-medium flex items-center gap-1 text-lg">{c?.chatType == 'group' ? c?.groupName : findChatUser?.name}
                        <span className="opacity-40 font-normal">{c?.chatType == 'group' && '(group)'}</span></p>
                    {
                        c?.lastMessage ?
                            <>
                                {c?.lastMessage?.sender == user?._id ?
                                    <div className="flex items-center gap-1">
                                        <PiChecks className={`text-lg ${c?.lastMessage?.seenBy?.filter(s => s != user?._id).length > 0 && 'text-green-600'}`}></PiChecks>
                                        <span className={`text-sm opacity-90 `}>{c?.lastMessage?.message.slice(0, 20)}</span>
                                    </div> :
                                    <>
                                        <p className={`text-sm opacity-90 ${!lastMsg && 'font-bold'}`}><span>{c?.lastMessage ? c?.lastMessage?.message.slice(0, 20) : 'click to send message'}</span></p>
                                    </>}
                            </> :
                            <>
                                <p className="opacity-90">click to send message</p>
                            </>
                    }
                    {/*  */}
                </div>
            </div>
            <p className={`text-xs ${!lastMsg && 'font-bold'}`}>{moment(c.updatedAt).fromNow()}</p>

            {!lastMsg && <p className="h-2 w-2 bg-green-500 rounded-full absolute right-4 top-2/4 -translate-y-2/4"></p>}

        </NavLink>
    );
};

export default ChatList;