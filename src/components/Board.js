import React from 'react'
import BoardSquare from './BoardSquare'

const Board = ({ boardState, handleSquareClick, disabled }) => {
    const boardSquares = boardState.map((squareValue, i) => {
        return (
            <BoardSquare
                onClick={squareValue === '-' ? () => handleSquareClick(i) : null}
                key={i}
                value={squareValue}
            />
        )
    })

    return (
        <div
            className={`border-4 border-gray-800 bg-gray-800 w-60 h-60 grid grid-cols-3 grid-rows-3 gap-1 ${
                disabled ? 'opacity-50 pointer-events-none' : ''
            }`}
        >
            {boardSquares}
        </div>
    )
}

export default Board
