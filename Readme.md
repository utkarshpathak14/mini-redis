# redis-mini

A lightweight Redis server implementation built from scratch using Node.js and TypeScript. This project implements core Redis functionality with RESP (REdis Serialization Protocol) support.

## Overview

redis-mini is an educational implementation of a Redis-compatible server that supports essential Redis commands and the RESP protocol. It's designed to demonstrate how Redis works internally while providing a functional in-memory data store.

## Features

- **Core Commands**: PING, GET, SET, DEL, AUTH
- **RESP Protocol**: Full Redis Serialization Protocol support
- **TCP Server**: Built on Node.js net module
- **In-Memory Storage**: Simple key-value store using JavaScript Map
- **Type-Safe**: Written entirely in TypeScript

## Project Structure

```
src/
├── index.ts                  # Server entry point
├── commands/                 # Command implementations
│   ├── auth.ts              # Authentication command
│   ├── del.ts               # Delete key command
│   ├── get.ts               # Get value command
│   ├── ping.ts              # Ping command
│   ├── registry.ts          # Command router
│   └── set.ts               # Set key-value command
├── handlers/                # Request/response handlers
├── models/
│   └── db.ts                # Database storage model
├── protocols/
│   └── resp.ts              # RESP protocol parser
├── responses/
│   └── formatter.ts         # Response formatting
└── server/
    └── connection.ts        # Client connection handler
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd redis-mini
```

2. Install dependencies:
```bash
npm install
```

3. Build TypeScript (if needed):
```bash
npm run build
```

## Usage

### Development Mode

Run with auto-reload on file changes:
```bash
npm run dev
```

### Production Mode

Start the server:
```bash
npm start
```

The server will listen on port `6000` by default.

## Testing

Connect to the server using a Redis client or telnet:

```bash
# Using redis-cli
redis-cli -p 6000

# Using telnet
telnet localhost 6000
```

### Supported Commands

- **PING**: Check server connectivity
  ```
  PING
  ```

- **SET**: Store a key-value pair
  ```
  SET key value
  ```

- **GET**: Retrieve a value by key
  ```
  GET key
  ```

- **DEL**: Delete a key
  ```
  DEL key
  ```

- **AUTH**: Authenticate with password (if configured)
  ```
  AUTH password
  ```

## Architecture

### Protocol Layer
The RESP protocol parser handles Redis client communication, converting binary data into command tokens.

### Command Handler
The command registry routes incoming commands to their respective implementations.

### Storage
Data is stored in a JavaScript `Map` for O(1) access times, making it suitable for development and educational purposes.

### Connection Management
Each client connection is handled independently via Node.js socket events.

## Requirements

- Node.js 18+
- npm or yarn
- TypeScript 6.0.3

## Dependencies

- **Runtime**: 
  - `net` - Node.js built-in networking module
  - `redis` - Redis client library (optional, for testing)

- **Development**:
  - `typescript` - TypeScript compiler
  - `ts-node` - TypeScript execution for Node.js
  - `nodemon` - File watcher for development
  - `@types/node` - TypeScript definitions for Node.js

## Configuration

- **Port**: Default is `6000` (configurable in `src/index.ts`)
- **Storage**: In-memory Map (non-persistent)

## Limitations

- Single-threaded design
- No persistence (data lost on restart)
- Limited command set (extend in `src/commands/`)
- No cluster support
- No replication

## Future Enhancements

- [ ] Expiration support (TTL)
- [ ] More data types (Lists, Sets, Hashes, Sorted Sets)
- [ ] Persistence (RDB, AOF)
- [ ] Pub/Sub messaging
- [ ] Transactions


## License

ISC

## Contributing

This is an educational project. Feel free to fork and extend it!

## Resources

- [Redis Protocol Specification](https://redis.io/docs/reference/protocol-spec/)
- [Redis Command Documentation](https://redis.io/commands/)
- [Node.js Net Module](https://nodejs.org/api/net.html)
