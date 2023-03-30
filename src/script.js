const socket = io()

let comment = document.getElementById('comment')

comment.addEventListener('click', () => {
  textarea = document.getElementById('textarea')
  const value = textarea.value
  socket.emit('comment', value)
})
