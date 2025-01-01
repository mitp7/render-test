const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(express.static('dist'));
app.use(cors({
  // origin: 'http://localhost:5173' // Only allowed for front-end
}))

app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}));

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
  
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id);

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes/', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// let persons = [
//   { 
//     "id": "1",
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": "2",
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": "3",
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": "4",
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ];

// app.get("/api/persons", (request, response) => {
//   response.json(persons);
// })

// app.get("/info", (request, response) => {
//   const display = `
//     <p>Phonebook has info for ${persons.length} people</p>
//     <p>${new Date(Date.now())}</p>
//   `;
//   response.send(display);
// })

// app.get("/api/persons/:id", (request, response) => {
//   const id = request.params.id;

//   const person = persons.find(n => n.id == id);

//   if (person) {
//     response.send(person);
//   } else {
//     response.status(404).end();
//   }
// })

// app.delete("/api/persons/:id", (request, response) => {
//   const id = request.params.id;

//   const person = persons.filter(n => n.id != id);

//   response.json(person);
// })

// generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => Number(n.id)))
//     : 0
//   return (maxId + 1).toString()
// }

// app.post("/api/persons/", (request, response) => {
//   const personToAdd = request.body;

//   if(!personToAdd.name) {
//     return response.status(400).json({ 
//       error: 'name is missing' 
//     })
//   } else if (!personToAdd.number) {
//     return response.status(400).json({
//       error: 'number is missing'
//     })
//   }

//   const isNameValid = persons.find(n => n.name === personToAdd.name);
//   if (isNameValid) {
//     return response.status(400).json({
//       error: 'name already exists'
//     })
//   }

//   const person = {
//     "name": personToAdd.name,
//     "number": personToAdd.number,
//     "id": generateId()
//   }

//   persons = persons.concat(person)
//   response.json(persons);
// })

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })