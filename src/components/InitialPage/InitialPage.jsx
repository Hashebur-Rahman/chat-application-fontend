import React from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import LeftSideBar from '../LeftSideBar/LeftSideBar';

const InitialPage = () => {
    return (
        <div className="h-screen overflow-hidden overflow-y-auto flex w-full md:justify-center md:items-center bg-white md:bg-transparent">
            <div className='px-4 hidden md:block text-center'>
                <AiOutlineMessage className="text-6xl text-blue-500 mx-auto"></AiOutlineMessage>
                <h1 className="text-3xl font-bold my-2">Messages</h1>

                <p className='opacity-90'> Messages is a feature that helps you converse with applicants and landlords. Let’s send your first message.</p>
            </div>

            <div className='block md:hidden w-full'>
                <LeftSideBar></LeftSideBar>
            </div>

        </div>
    );
};

export default InitialPage;