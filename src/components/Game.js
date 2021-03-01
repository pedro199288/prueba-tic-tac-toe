import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getRandomBoolean, getRandomIntInRange, getIndicesWithValue } from '../helpers'
import Board from './Board'
import Button from './Button'
import Modal from './Modal'

const dash = '-'
const circle = 'O'
const cross = 'X'

const victoryPositionsCases = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const cornerSquaresPositions = [0, 2, 6, 8]
const sideSquaresPositions = [1, 3, 5, 7]
const diagonalPositionsCases = [
    [0, 8],
    [6, 2],
]
const centerSquarePosition = 4

const initialBoardState = Array(9).fill(dash)

function Game() {
    const [matchId, setMatchId] = useState(null)
    const [boardState, setBoardState] = useState(initialBoardState)
    const [lastMove, setLastMove] = useState(null)
    const [isBotTurn, setIsBotTurn] = useState(null)
    const [isCirclesTurn, setIsCirclesTurn] = useState(false)
    const [chooseMarkModalOpen, setChooseMarkModalOpen] = useState(false)
    const [winner, setWinner] = useState(null)

    const botTimeout = useRef(null)

    const handleCloseModal = useCallback(() => setChooseMarkModalOpen(false), [])

    const endGame = () => {
        if (botTimeout.current) {
            clearTimeout(botTimeout.current)
            botTimeout.current = null
        }
        setMatchId(null)
    }

    const prepareNewGame = useCallback(() => {
        endGame()
        // get if bot will begin
        const botWillBegin = getRandomBoolean()
        setIsBotTurn(botWillBegin)
        if (botWillBegin) {
            // if bot begins, he chooses mark randomly
            setIsCirclesTurn(getRandomBoolean())
            startNewGame()
        } else {
            setChooseMarkModalOpen(true)
        }
    }, [])

    const startNewGame = () => {
        setWinner(null)
        setMatchId(uuidv4())
        setBoardState(initialBoardState)
        setLastMove(null)
    }

    const fillSquare = (position, char) => {
        const newBoarsState = [...boardState]
        newBoarsState[position] = char
        setBoardState(newBoarsState)
        setIsCirclesTurn(!isCirclesTurn)
        setIsBotTurn(!isBotTurn)
        if (char !== dash) {
            // if the move is not an "undo action", store it as last move
            setLastMove({ char, position })
        }
    }

    const makeMove = (position) => {
        fillSquare(position, isCirclesTurn ? circle : cross)
    }

    const undoLastMove = () => {
        if (lastMove) {
            fillSquare(lastMove.position, dash)
            setLastMove(undefined)
        }
    }

    const handleSquareClick = (index) => {
        if (!isBotTurn) {
            return makeMove(index)
        }
        alert('wait for the bot! he also wants to play')
    }

    const chooseCircles = useCallback(() => {
        setIsCirclesTurn(true)
        setChooseMarkModalOpen(false)
        startNewGame()
    }, [])

    const chooseCrosses = useCallback(() => {
        setIsCirclesTurn(false)
        setChooseMarkModalOpen(false)
        startNewGame()
    }, [])

    // gets an empty corner position, if no corners available, it will return null
    const getRandomEmptyCornerIndex = () => {
        const emptyCornersPositions = cornerSquaresPositions.filter((position) => boardState[position] === dash)
        if (!emptyCornersPositions.length) return null
        const emptyPositionIndex = getRandomIntInRange(0, emptyCornersPositions.length - 1)
        return emptyCornersPositions[emptyPositionIndex]
    }

    // gets an empty side position, if no side available, it will return null
    const getRandomEmptySideIndex = () => {
        const emptySidePositions = sideSquaresPositions.filter((position) => boardState[position] === dash)
        if (!emptySidePositions.length) return null
        const emptyPositionIndex = getRandomIntInRange(0, emptySidePositions.length - 1)
        return emptySidePositions[emptyPositionIndex]
    }

    const getBestChoice = () => {
        const botMark = isCirclesTurn ? 'circles' : 'crosses'
        const humanMark = isCirclesTurn ? 'crosses' : 'circles'
        const emptySquaresPositions = getIndicesWithValue(boardState, dash)
        const positionsByMarks = {
            circles: getIndicesWithValue(boardState, circle),
            crosses: getIndicesWithValue(boardState, cross),
        }
        const botPositions = positionsByMarks[botMark]
        const humanPositions = positionsByMarks[humanMark]
        if (!emptySquaresPositions.length) {
            return null
        }
        // determines if bot bgun the match
        const botBegunTheMatch = isBotTurn && botPositions.length === humanPositions.length

        // Check if board is empty, that means that bot begins so it will chose any corner
        if (boardState.every((squareValue) => squareValue === dash)) {
            return getRandomEmptyCornerIndex()
        }

        // find the first closest victory case (i.e., it just need one move)
        const botClosestVictoryCase = victoryPositionsCases.find(
            (victoryCasePositions) =>
                victoryCasePositions.filter((position) => botPositions.includes(position)).length === 2 &&
                !victoryCasePositions.some((position) => humanPositions.includes(position))
        )
        const humanClosestVictoryCase = victoryPositionsCases.find(
            (victoryCasePositions) =>
                victoryCasePositions.filter((position) => humanPositions.includes(position)).length === 2 &&
                !victoryCasePositions.some((position) => botPositions.includes(position))
        )

        // If board is not empty, look if bot is close to win and win
        if (botClosestVictoryCase) {
            return botClosestVictoryCase.find((position) => !botPositions.includes(position))
        }
        // if bot is not close to win,  look if human is close to win and avoid it
        if (humanClosestVictoryCase) {
            return humanClosestVictoryCase.find((position) => !humanPositions.includes(position))
        }

        // none of the players can win in one move, check best options
        if (botBegunTheMatch) {
            // if botBegunTheMatch, always look for corners if there is no direct win/lose possibilty
            return (
                getRandomEmptyCornerIndex() ??
                emptySquaresPositions[getRandomIntInRange(0, emptySquaresPositions.length - 1)]
            )
        } else if (emptySquaresPositions.includes(centerSquarePosition)) {
            // if !botBegunTheMatch and center is available, take the center
            return centerSquarePosition
        } else {
            // if human chose diagonal positions, don't chose corner, chose side instead
            if (
                diagonalPositionsCases.some((diagonalCasePositions) =>
                    diagonalCasePositions.every((position) => humanPositions.includes(position))
                )
            ) {
                // don't chose corner, chose a side
                return getRandomEmptySideIndex()
            } else {
                return (
                    getRandomEmptyCornerIndex() ??
                    emptySquaresPositions[getRandomIntInRange(0, emptySquaresPositions.length - 1)]
                )
            }
        }
    }

    useEffect(() => {
        if (matchId) {
            if (isBotTurn && !botTimeout.current) {
                botTimeout.current = setTimeout(() => {
                    const botBestChoice = getBestChoice()
                    makeMove(botBestChoice)
                }, getRandomIntInRange(1000, 3000))
            }
            if (!isBotTurn && botTimeout.current) {
                clearTimeout(botTimeout.current)
                botTimeout.current = null
            }
        }
    }, [isBotTurn, matchId])

    useEffect(() => {
        const checkVictory = () => {
            const positionsWithCrosses = getIndicesWithValue(boardState, cross)
            const positionsWithCircles = getIndicesWithValue(boardState, circle)
            let winningMark = null
            // check circles has won
            if (!boardState.filter((squareValue) => squareValue === dash).length) {
                winningMark = 'tie'
            }
            victoryPositionsCases.forEach((victoryPositionsCase) => {
                if (victoryPositionsCase.every((position) => positionsWithCrosses.includes(position))) {
                    winningMark = 'Crosses'
                }
                if (victoryPositionsCase.every((position) => positionsWithCircles.includes(position))) {
                    winningMark = 'Circles'
                }
            })
            return winningMark
        }
        const winningMark = checkVictory()
        if (winningMark) {
            endGame()
            setWinner(winningMark)
        }
    }, [boardState])

    const winnerInfo = winner ? (winner === 'tie' ? 'Tie!' : `${winner} has won the match!`) : null
    const turnInfo = isBotTurn ? 'Bot moves.' : 'You move!'
    const infoMessage = winnerInfo || (matchId && turnInfo)

    return (
        <div className="w-full h-full flex-centered flex-col">
            <h1 className="text-2xl font-semibold mb-6">Tick Tack Toe</h1>
            <Button onClick={prepareNewGame} className="bg-purple-400 mb-4">
                new game
            </Button>
            <div className="h-20 my-3 flex-center">
                {infoMessage && (
                    <div className="text-lg text-blue-800 bg-blue-100 rounded-sm py-2 px-8 border border-blue-800">
                        {infoMessage}
                    </div>
                )}
            </div>
            <Board handleSquareClick={handleSquareClick} boardState={boardState} disabled={!matchId} />
            <Button disabled={!lastMove || !matchId} onClick={undoLastMove} className="mt-4 bg-purple-400">
                undo last move
            </Button>
            <Modal title="You choose!" isOpen={chooseMarkModalOpen} onClose={handleCloseModal}>
                <Button onClick={chooseCrosses} className="bg-green-500">
                    x
                </Button>
                <Button onClick={chooseCircles} className="bg-green-500">
                    o
                </Button>
            </Modal>
        </div>
    )
}

export default Game
