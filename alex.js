const { version } = require('typescript');

const express = require('express'), { Pool } = require('pg'), Chance = require('chance'),
	app = express(), port = 3702, pool = new Pool({ user: 'alex', password: 'pass'});

pool.on('error', (err, client) => { console.error('Postgres error', err); process.exit(-1) })

app.get('/staff', async (req, res) => res.send((await pool.query('select * from staff')).rows))
app.get('/staff/db', async (req, res) => res.send({ ver: (await pool.query('select version()')).rows[0].version, 
	staff: (await pool.query({text:`select column_name, udt_name from INFORMATION_SCHEMA.COLUMNS where table_name='staff'`, rowMode: 'array'})).rows
}))

app.put('/add/:n', async (req, res) => { let chance = new Chance(), name, n=req.params.n, IDs = [];
	for (let i=0; i<n; i++) IDs.push((await pool.query('insert into staff(name, kind, dob, custom) values($1, 1, $2, $3) returning id', [name=chance.name(), chance.birthday(),
		{ email: name.split(' ').join('.').toLocaleLowerCase()+'@ac.com', adr: chance.address({short_suffix: true}), city: chance.city(), state: chance.state(), phone: chance.phone() }])).rows[0].id)
	res.send(IDs)
})

app.delete('/clear', async (req, res) => { await pool.query('delete from staff'); res.send({}); })

app.delete('/delete/:id', async (req, res) => { let id = req.params.id; await pool.query('delete from staff where id=$1', [id]); res.send({ id }); })

app.get('/', (req,res) => res.redirect('/index.html'));
app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})