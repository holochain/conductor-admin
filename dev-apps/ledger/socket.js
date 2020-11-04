const server = require('http').createServer()
const options = {
  /* ... */
}
const io = require('socket.io')(server, options)
// const fs = require("fs");
// const path = require("path");
const { spawn } = require('child_process')
const holochain = spawn('holochain', ['-c', './conductor/developer.toml'])

const SERVER_PORT = 11381
const HOLOCHAIN_ADMIN_PORT = 26971
// // const HOLOCHAIN_APP_PORT = 15108;
const holochainAdminWebSocket = require('@holochain/conductor-api')
  .AdminWebsocket
// // const holochainAppWebSocket = require("@holochain/conductor-api").AppWebsocket;
const hcClient = {}

io.on('connection', socket => {
  console.log('Connected', socket.id)

  socket.on('YOUR_SOCKET_EMIT_FROM_CLIENT', (payload, callback) => {
    console.log(payload)
    callback()
    socket.emit('YOUR_SOCKET_BACK_TO_CLIENT', 'message')
  })
})
io.on('error', () => {
  console.log('Error')
})

holochain.stdout.on('data', data => {
  if (`${data}`.indexOf('Conductor ready.') !== -1) {
    console.log('Connecting to Holochain conductor')
    holochainAdminWebSocket
      .connect(`ws://localhost:${HOLOCHAIN_ADMIN_PORT}`)
      .then(client => {
        hcClient.admin = client
        console.log('hcClient.admin connected')
      })
      .catch(e => console.log(e))

    // holochainAppWebSocket.connect(`ws://localhost:${HOLOCHAIN_APP_PORT}`).then(client => {
    //     hcClient.app = client;
    //     console.log("hcClient.app connected")
    // }).catch(e => console.log(e));
  }
  console.log(`${data}`)
})

holochain.stderr.on('data', data => {
  console.error(`stderr: ${data}`)
})

holochain.on('close', code => {
  console.log(`holochain process exited with code ${code}`)
})

server.listen(SERVER_PORT, () => {
  console.log(`Listening on port:${SERVER_PORT}`)
})
