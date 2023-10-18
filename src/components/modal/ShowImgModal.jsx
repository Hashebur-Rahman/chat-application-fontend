import React from 'react';

const ShowImgModal = ({
    viewIMg,
    setViewIMg
}) => {
    return (
        <>
            <dialog id="my_modal_2" className="modal ">
                <div
                    className="modal-box   p-12 flex justify-center items-center rounded-none shadow-none max-w-full w-full max-h-full h-full bg-black bg-opacity-60  mx-auto relative">
                    <p
                        onClick={() => { window.my_modal_2.close(); setViewIMg('') }}
                        className='z-30 absolute top-0 left-0 w-full cursor-pointer h-full'></p>
                    <img src={viewIMg} className='mx-auto max-w-full max-h-full relative z-40' alt="" />
                </div>
            </dialog>
        </>
    );
};

export default ShowImgModal;