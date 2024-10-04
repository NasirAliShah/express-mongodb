const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config
const errorHandler = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 3000
connectDB();
const app = express();
app.listen(port, () => console.log(`Server started on port ${port}`));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
