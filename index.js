const express = require('express')
const app = express()
const dotenv = require('dotenv').config({ path: './config.env' })
const PORT = process.env.PORT || 3000
const morgan = require('morgan')
const { notFound, errorHandler } = require('./Middlewares/ErrorHandler')
const cookieParser = require('cookie-parser')

// import routes
const authRouter = require('./Routes/AuthRoutes')
const ProductRouter = require('./Routes/ProductsRoutes')
const BlogRouter = require('./Routes/BlogRoutes')
const CategoryRouter = require('./Routes/PodCategoryRoutes')
const BlogCategoryRouter = require('./Routes/BlogCategoryRoutes')
const BrandRouter = require('./Routes/BrandRoutes')
const CouponRouter = require('./Routes/CouponRoutes')

app.use(morgan('dev'))

// database connection
const dbConnection = require('./Config/dbConnection')
dbConnection();

// cookie parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/product', ProductRouter)
app.use('/api/blog', BlogRouter)
app.use('/api/category', CategoryRouter)
app.use('/api/blogCategory', BlogCategoryRouter)
app.use('/api/brand', BrandRouter)
app.use('/api/coupon', CouponRouter)

app.get('/', (req, res) => {
    res.send('Hello World')
})

// error handler
app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})