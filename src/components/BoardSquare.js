import React, { memo } from 'react'

const BoardSquare = ({ value, onClick }) => {
    return (
        <div onClick={onClick} className="bg-green-300 flex-centered cursor-pointer font- font-bold text-3xl">
            {value}
        </div>
    )
}

export default memo(BoardSquare, (prev, next) => prev.value === next.value && prev.onClick === next.onClick)
