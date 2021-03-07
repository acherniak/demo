const express = require('express')
const app = express()
const port = 3000

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})