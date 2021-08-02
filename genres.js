const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

const Albums = [
  { id: 1, name: 'tamlym3ak' },  
  { id: 2, name: 'a7laWa7laa' },  
  { id: 3, name: 'm3diElnas' },  
];

app.get('/api/albums', (req, res) => {
  res.send(Albums);
});

app.post('/api/albums', (req, res) => {
  const { error } = validateAlbume(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const album = {
    id: Albums.length + 1,
    name: req.body.name
  };
  Albums.push(album);
  res.send(Albums);
});

app.put('/api/albums/:id', (req, res) => {
  const album = Albums.find(c => c.id === parseInt(req.params.id));
  if (!album) return res.status(404).send('The album with the given ID was not found is notfound y negm .');

  const { error } = validateAlbume(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  album.name = req.body.name; 
  res.send(album);
});

app.delete('/api/albums/:id', (req, res) => {
  const album = Albums.find(c => c.id === parseInt(req.params.id));
  if (!album) return res.status(404).send('The album with the given ID was not found.');

  const index = Albums.indexOf(album);
  Albums.splice(index, 1);

  res.send(album);
});

app.get('/api/albums/:id', (req, res) => {
  const album = Albums.find(c => c.id === parseInt(req.params.id));
  if (!album) return res.status(404).send('The album with the given ID was not found.');
  res.send(album);
});

function validateAlbume(album) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });

  return schema.validate(album);
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));