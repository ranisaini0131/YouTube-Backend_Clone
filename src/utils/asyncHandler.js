// asyncHandeler is a arrow fun which takes a single argument requestHandler, requestHandler is assumed to be an asynchronous function that handles HTTP requests.
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        //Promise is used to wrap the result of invoking requestHandler in a promise. The Promise.resolve function is a way to ensure that the value is always wrapped in a promise, whether it is a promise itself or not.
        Promise
            .resolve(
                requestHandler(req, res, next)
            )
            .catch(
                (err) => next(err)
            )
    }
}



export { asyncHandler }


// const asyncHandler = () => { }
// const asyncHandeler = (func) => { () => { } }
// const asyncHandeler = () => async() => { }

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }