import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from './config/passport.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
    origin: 'https://nexload.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

app.use(passport.initialize())
app.use(passport.session())

const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Auth Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('https://nexload.vercel.app') // Adjust to your frontend URL
    }
)

app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('https://nexload.vercel.app/');
    });
});

app.get('/auth/current_user', (req, res) => {
    res.json(req.user || null)
})

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).json({ error: 'Unauthorized' })
}

app.post('/api/upload', ensureAuthenticated, async (req, res) => {
    try {
        const { title, description, category, tags, author, image_url, file_path } = req.body
        const userId = req.user.id

        if (!image_url || !file_path) {
            return res.status(400).json({ error: 'File and image info are required' })
        }

        const data = await prisma.resource.create({
            data: {
                title,
                description,
                category,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                image_url: image_url,
                file_url: file_path,
                downloads: 0,
                author: req.user.displayName,
                created_at: new Date(),
                userId: userId
            }
        })

        res.status(200).json(data)
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/resources', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 8
        const skip = page * limit

        const data = await prisma.resource.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        })

        res.json(data)
    } catch (error) {
        console.error('Fetch error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q
        if (!query) return res.json([])

        const data = await prisma.resource.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        res.json(data)
    } catch (error) {
        console.error('Search error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
