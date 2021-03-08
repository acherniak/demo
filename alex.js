const express = require('express'), { Pool } = require('pg'), 
	app = express(), port = 3702,
	pool = new Pool({ database: 'postgres', user: 'alex', password: 'pass'});

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1)
})

app.get('/staff', async (req, res) => {
	res.send((await pool.query('select * from staff')).rows)
})

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})