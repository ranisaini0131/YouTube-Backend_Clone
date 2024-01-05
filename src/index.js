import dotenv from 'dotenv'
import connectDB from './db/index.db.js';
import { app } from './app.js';

dotenv.config({
    path: './.env',
});



//becoz we used async-await in database connection, so after connection it is returning a promise
connectDB()
    .then(() => {

        //handling error on server
        app.on("error", (error) => {
            console.log('Error: ', error);
            throw error
        })

        //creating server
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening on port : ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGODB Connection failed !!!", err)
    })





















// (async () => {
//     try {
//         //databases connection
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         //handling error
//         app.on("error", (error) => {
//             console.log('Error: ', error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("ERROR: ", error)
//         throw error
//     }

// })()