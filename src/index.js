import dotenv from 'dotenv'
import connectDB from './db/index.db.js';

dotenv.config({
    path: './.env',
});

connectDB()





















// (async () => {
//     try {
//         //databases connection
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         //handling error
//         application.on("error", (error) => {
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