const getRandomBoolean = () => Math.random() < 0.5

const getRandomIntInRange = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Get the indices from an array that are equal to a certain value
 *
 * @param {Array} array
 * @param {*} value
 */
const getIndicesWithValue = (array, value) =>
    array.reduce(
        (accumulator, currentValue, currentIndex) =>
            currentValue === value ? [...accumulator, currentIndex] : accumulator,
        []
    )

export { getRandomBoolean, getRandomIntInRange, getIndicesWithValue }
