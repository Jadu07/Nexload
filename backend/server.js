import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from './config/passport.js'

dotenv.config()

import { PrismaSessionStore } from '@quixo3/prisma-session-store'

const app = express()
const port = process.env.PORT || 3000

const prisma = new PrismaClient()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.set('trust proxy', 1)

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000, // 2 minutes
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    ),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use(passport.initialize())
app.use(passport.session())


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Auth Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173')
    }
)

app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
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

app.get('/api/user/resources', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id

        const data = await prisma.resource.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        res.json(data)
    } catch (error) {
        console.error('Fetch user resources error:', error)
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

app.get('/api/resources/:id', async (req, res) => {
    try {
        const resourceId = parseInt(req.params.id)

        const resource = await prisma.resource.findUnique({
            where: { id: resourceId },
            include: {
                user: {
                    select: {
                        image: true,
                        displayName: true
                    }
                }
            }
        })

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' })
        }

        res.json(resource)
    } catch (error) {
        console.error('Fetch resource error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/stats', async (req, res) => {
    try {
        const [resourceCount, userCount, downloadData] = await Promise.all([
            prisma.resource.count(),
            prisma.user.count(),
            prisma.resource.aggregate({
                _sum: {
                    downloads: true
                }
            })
        ])

        res.json({
            resources: resourceCount,
            users: userCount,
            downloads: downloadData._sum.downloads || 0
        })
    } catch (error) {
        console.error('Stats error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/resources/:id', ensureAuthenticated, async (req, res) => {
    try {
        const resourceId = parseInt(req.params.id)
        const userId = req.user.id
        const { title, description, category, tags, image_url, file_path } = req.body

        // Check if resource exists and belongs to user
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId }
        })

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' })
        }

        if (resource.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to edit this resource' })
        }

        // Build update data object
        const updateData = {
            title,
            description,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        }

        // Add image_url and file_url if provided
        if (image_url) {
            updateData.image_url = image_url
        }
        if (file_path) {
            updateData.file_url = file_path
        }

        // Update resource
        const updatedResource = await prisma.resource.update({
            where: { id: resourceId },
            data: updateData
        })

        res.json(updatedResource)
    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/resources/:id', ensureAuthenticated, async (req, res) => {
    try {
        const resourceId = parseInt(req.params.id)
        const userId = req.user.id

        // Check if resource exists and belongs to user
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId }
        })

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' })
        }

        if (resource.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this resource' })
        }

        // Delete resource from database
        await prisma.resource.delete({
            where: { id: resourceId }
        })

        res.json({ message: 'Resource deleted successfully' })
    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
