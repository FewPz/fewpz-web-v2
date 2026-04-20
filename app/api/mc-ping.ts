import { createFileRoute } from '@tanstack/react-router'

function writeVarInt(value: number): number[] {
  const bytes: number[] = []
  let v = value >>> 0
  do {
    let temp = v & 0x7F
    v >>>= 7
    if (v !== 0) temp |= 0x80
    bytes.push(temp)
  } while (v !== 0)
  return bytes
}

function readVarInt(buf: Buffer, offset: number): { value: number; size: number } {
  let result = 0
  let shift = 0
  let i = offset
  while (i < buf.length) {
    const byte = buf[i++]
    result |= (byte & 0x7F) << shift
    if ((byte & 0x80) === 0) break
    shift += 7
    if (shift >= 35) throw new Error('VarInt too big')
  }
  return { value: result, size: i - offset }
}

function writeString(str: string): number[] {
  const encoded = Buffer.from(str, 'utf8')
  return [...writeVarInt(encoded.length), ...encoded]
}

async function pingMinecraftServer(host: string, port: number) {
  const { createConnection } = await import('node:net')

  return new Promise<{ status: object; latency: number }>((resolve, reject) => {
    const socket = createConnection({ host, port })
    const chunks: Buffer[] = []
    let pingTime = 0

    const timer = setTimeout(() => {
      socket.destroy()
      reject(new Error('Connection timed out'))
    }, 5000)

    socket.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })

    socket.on('connect', () => {
      const packetId = [0x00]
      const protocolVersion = writeVarInt(0)
      const serverAddress = writeString(host)
      const serverPort = [(port >> 8) & 0xFF, port & 0xFF]
      const nextState = writeVarInt(1)
      const handshakeData = [...packetId, ...protocolVersion, ...serverAddress, ...serverPort, ...nextState]
      const handshake = Buffer.from([...writeVarInt(handshakeData.length), ...handshakeData])

      const statusReq = Buffer.from([...writeVarInt(1), 0x00])

      socket.write(Buffer.concat([handshake, statusReq]))
      pingTime = Date.now()
    })

    socket.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
      const buffer = Buffer.concat(chunks)

      try {
        let offset = 0
        const lenResult = readVarInt(buffer, offset)
        offset += lenResult.size

        if (buffer.length < offset + lenResult.value) return

        const latency = Date.now() - pingTime

        const pkIdResult = readVarInt(buffer, offset)
        offset += pkIdResult.size

        if (pkIdResult.value !== 0x00) {
          clearTimeout(timer)
          socket.destroy()
          reject(new Error('Unexpected packet ID'))
          return
        }

        const jsonLenResult = readVarInt(buffer, offset)
        offset += jsonLenResult.size

        const jsonStr = buffer.subarray(offset, offset + jsonLenResult.value).toString('utf8')
        const status = JSON.parse(jsonStr)

        clearTimeout(timer)
        socket.destroy()
        resolve({ status, latency })
      } catch {
        // wait for more data
      }
    })
  })
}

export const Route = createFileRoute('/api/mc-ping')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const host = url.searchParams.get('host')?.trim()
        const portStr = url.searchParams.get('port') ?? '25565'
        const port = parseInt(portStr, 10)

        if (!host) {
          return new Response(JSON.stringify({ error: 'Missing host parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (isNaN(port) || port < 1 || port > 65535) {
          return new Response(JSON.stringify({ error: 'Invalid port' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          const { status, latency } = await pingMinecraftServer(host, port)
          return new Response(JSON.stringify({ ...status, latency }), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Server unreachable'
          return new Response(JSON.stringify({ error: message }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
