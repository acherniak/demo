const express = require('express'), { Pool } = require('pg'), Chance = require('chance'),
	app = express(), port = 3702, pool = new Pool({ user: 'alex', password: 'pass'});

pool.on('error', (err, client) => { console.error('Postgres error', err); process.exit(-1) })

app.get('/staff', async (req, res) => {
	res.send((await pool.query('select * from staff')).rows)
})

app.put('/add/:n', async (req, res) => { let chance = new Chance(), name, n=req.params.n, IDs = [];
	for (let i=0; i<n; i++) IDs.push((await pool.query('insert into staff(name, kind, dob, custom) values($1, 1, $2, $3) returning id', [name=chance.name(), chance.birthday(),
		{ email: name.split(' ').join('.').toLocaleLowerCase()+'@ac.com', adr: chance.address({short_suffix: true}), city: chance.city(), state: chance.state(), phone: chance.phone() }])).rows[0].id)
	res.send(IDs)
})

app.delete('/clear', (req, res) => {
  res.send({})
})

app.delete('/delete/:id', (req, res) => {
  res.send({id: req.params.id})
})

app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})