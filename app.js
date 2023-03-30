const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const fs = require('fs')

const jsonFilePath = path.resolve(__dirname, 'database', 'db.json')

const io = require('socket.io')(http)

const port = 5000

app.use(express.static(path.resolve(__dirname, 'src')))

function addDataToJSON(comment) {
  fs.readFile(jsonFilePath, (err, fileData) => {
    if (err) {
      console.error(err)
      return
    }
    const jsonData = JSON.parse(fileData)

    const maxId = jsonData.comments.reduce((acc, comment) => {
      return Math.max(acc, comment.id)
    }, 0)

    const newComment = {
      id: maxId + 1,
      body: comment,
      user: {
        id: Math.floor(Math.random() * 1000),
        name: 'faker.name.findName()',
      },
    }
    jsonData.comments.push(newComment)

    fs.writeFile(jsonFilePath, JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  })
}

io.on('connection', (socket) => {
  console.log('connected')

  socket.on('comment', (value) => {
    if (!value) {
      socket.emit('addCommentError', 'Comment cannot be empty')
      return
    }
    addDataToJSON(value)
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

http.listen(port, () => {
  console.log('listening on port 5000...')
})
