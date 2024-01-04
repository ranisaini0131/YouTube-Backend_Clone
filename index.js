import dotenv from 'dotenv'
import express from "express"
const app = express()

const port = 4000

dotenv.config({
    path: './.env',
})
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`)
})