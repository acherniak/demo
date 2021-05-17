const express = require('express'),Chance = require('chance'), app = express(), port = 3701,
	mongoose = require('mongoose'), got = require('got');//{ addAvatar } = require('./avatar');

mongoose.connect('mongodb://127.0.0.1/alex', {useNewUrlParser: true, useUnifiedTopology: true});
let mongo = mongoose.connection,
	schema = new mongoose.Schema({ name: String, dob: Date, avatar: String,
		custom: { email: String, phone: String, adr: String, city: String, state: String }
	}),
	person = new mongoose.model('person', schema);

app.get('/info', async (req, res) => res.send({db: 'MongoDB'}));
app.get('/staff', async (req, res) => person.find({}, (err,staff) => res.send(staff.map(p=>p._doc))));
app.get('/staff/db', async (req, res) => res.send({ ver: 'MongoDB', 
	staff: '{ name: String, dob: Date, avatar: String, custom: { email: String, phone: String, adr: String }}'
}))

app.put('/add/:n', async (req, res) => { let chance = new Chance(), n=req.params.n, IDs = [];
	for (let i=0; i<n; i++) { let pers, id, gender = chance.gender().toLowerCase(), name = chance.name({gender:gender}), state;
		pers = await person.create({ name: name, dob: chance.birthday(),
			custom: { state: state=chance.state(), adr: chance.address({short_suffix: true}), city: chance.city(),
			phone: chance.phone(), email: `${name.split(' ').join('.').toLocaleLowerCase()}@${state.toLowerCase()}.us.net` }
		});
		IDs.push(id = pers._id.toString());
		(async(pers, gender, id) => { pers.avatar = (await got(`https://avatars.dicebear.com/api/${gender}/${id}.svg`)).body; await pers.save();
		})(pers, gender, id);
	}
	res.send(IDs)
});

app.delete('/clear', async (req, res) => person.deleteMany({}, (err) => res.send({})));

app.delete('/delete/:id', async (req, res) => { let id = req.params.id;
	person.deleteOne({_id:id}, err=> { if (err) console.log(err); else res.send({ id })});
})

app.get('/', (req,res) => res.redirect('/index.html'));
app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})