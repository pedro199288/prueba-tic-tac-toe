import React, { memo } from 'react'

const Button = ({ color, onClick, children }) => {
    return (
        <button className={`btn text-white bg-${color}-500`} onClick={onClick}>
            {children}
        </button>
    )
}

export default memo(
    Button,
    (prev, next) => next.color === prev.color && next.onClick === prev.onClick && next.children === prev.children
)
