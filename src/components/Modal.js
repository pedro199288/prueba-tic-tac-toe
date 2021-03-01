import React from 'react'

const Modal = ({ isOpen, onClose, children, title }) => {
    const handleClose = () => {
        onClose()
    }

    return (
        <div
            onClick={handleClose}
            className={`fixed w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-25 ${
                isOpen ? '' : 'hidden'
            }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="shadow-xl rounded-lg bg-white border border-gray-800 p-20 relative"
            >
                <button onClick={handleClose} className="text-2xl font-semibold absolute right-3 top-1 cursor-pointer">
                    x
                </button>
                <div className="text-2xl font-semibold mb-6">{title}</div>
                <div className="flex justify-between">{children}</div>
            </div>
        </div>
    )
}

export default Modal
