import React from 'react'

const Board = ({ value, onClick }) => {
    return (
        <div onClick={onClick} className="bg-green-300 flex-centered cursor-pointer font- font-bold text-3xl">
            {value}
        </div>
    )
}

export default Board
