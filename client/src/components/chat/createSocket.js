import io from 'socket.io-client'
const CHAT_HOST = process.env.REACT_APP_CHAT_HOST
const CHAT_PORT = process.env.REACT_APP_CHAT_PORT

export default function createSocket () {
  return io.connect(`${CHAT_HOST}:${CHAT_PORT}`)
}
