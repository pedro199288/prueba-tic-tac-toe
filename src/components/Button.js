import React, { memo } from 'react'

const Button = ({ onClick, children, disabled, className }) => {
    return (
        <button disabled={disabled} className={`btn text-white ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default memo(
    Button,
    (prev, next) =>
        next.onClick === prev.onClick &&
        next.children === prev.children &&
        next.disabled === prev.disabled &&
        next.className === prev.className
)
