import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/api/upload', async (req, res) => {
    try {
        const { title, description, category, tags, author, image_url, file_path } = req.body

        if (!image_url || !file_path) {
            return res.status(400).json({ error: 'File and image info are required' })
        }

        const { data, error } = await supabase
            .from('resources')
            .insert([
                {
                    title,
                    description,
                    category,
                    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                    image_url: image_url,
                    file_url: file_path,
                    downloads: 0,
                    author,
                    created_at: new Date().toISOString()
                }
            ])
            .select()

        if (error) throw error

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
        const start = page * limit
        const end = start + limit - 1

        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .range(start, end)
            .order('created_at', { ascending: false })

        if (error) throw error

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

        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json(data)
    } catch (error) {
        console.error('Search error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
