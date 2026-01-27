import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/api/upload', async (req, res) => {
    try {
        const { title, description, category, tags, author, image_url, file_path } = req.body

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
                author,
                created_at: new Date()
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
