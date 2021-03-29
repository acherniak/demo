const { version } = require('typescript');

const express = require('express'), { Pool } = require('pg'), Chance = require('chance'),
	app = express(), port = 3702, pool = new Pool({ user: 'alex', password: 'pass'});

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/alex', {useNewUrlParser: true, useUnifiedTopology: true});
let mongo = mongoose.connection,
	schema = new mongoose.Schema({
		name: String,
		dob: Date,
		custom: {
			email: String,
			phone: String,
			adr: String
		}
	}),
	person = new mongoose.model('person', schema);

person.create({name: 'Jane Doe', custom: {}}, (err,res) => {
	let aa = res._id.toString();
})
pool.on('error', (err, client) => { console.error('Postgres error', err); process.exit(-1) })

app.get('/staff', async (req, res) => person.find({}, (err,staff) => res.send(staff.map(p=>p._doc))));
app.get('/staff/db', async (req, res) => res.send({ ver: 'MongoDB', 
	staff: '{ name: String, dob: Date, custom: { email: String, phone: String, adr: String }}'
}))

app.put('/add/:n', async (req, res) => { let chance = new Chance(), name, n=req.params.n, IDs = [];
	for (let i=0; i<n; i++) IDs.push((await pool.query('insert into staff(name, kind, dob, custom) values($1, 1, $2, $3) returning id', [name=chance.name(), chance.birthday(),
		{ email: name.split(' ').join('.').toLocaleLowerCase()+'@ac.com', adr: chance.address({short_suffix: true}), city: chance.city(), state: chance.state(), phone: chance.phone() }])).rows[0].id)
	res.send(IDs)
})

app.delete('/clear', async (req, res) => person.deleteMany({}, (err) => res.send({})));

app.delete('/delete/:id', async (req, res) => { let id = req.params.id;
	person.deleteOne({_id:id}, 
		err=> { 
			if (err) console.log(err); else res.send({ id })
});
})

app.get('/', (req,res) => res.redirect('/index.html'));
app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})