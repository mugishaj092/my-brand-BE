import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app'

dotenv.config({ path: './config.env' })

interface EnvConfig {
    PORT: string | number
    DATABASE: string
    DATABASE_PASSWORD: string
}

const { PORT, DATABASE, DATABASE_PASSWORD } =
    process.env as unknown as EnvConfig
const DB = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD)

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connection established')
    })
    .catch((err) => {
        console.error('DB connection failed:', err)
    })

const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`)
})

process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection. Shutting down...', err)
    server.close(() => {
        process.exit(1)
    })
})

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception. Shutting down...', err)
    server.close(() => {
        process.exit(1)
    })
})
