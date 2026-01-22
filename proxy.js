import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: 'https://syncro-production-30a.up.railway.app'
}))
app.use(express.json())

app.post('/webhook/formulario-PT', async (req, res) => {
  try {
    const response = await fetch(
      'http://187.157.36.37:5678/webhook/formulario-PT',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    )

    const text = await response.text()
    res.status(200).send(text)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error enviando a n8n' })
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy n8n activo')
})
