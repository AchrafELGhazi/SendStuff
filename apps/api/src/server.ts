import app from './app'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🚀 SendStuff API Server running on port ${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/health`)
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/v1/auth`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// process.on('SIGINT', () => {
//     console.log('\n👋 Shutting down SendStuff API Server...')
//     process.exit(0)
// })

// process.on('SIGTERM', () => {
//     console.log('\n👋 Shutting down SendStuff API Server...')
//     process.exit(0)
// })