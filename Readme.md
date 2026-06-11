# redis-mini

A lightweight Redis server implementation built from scratch using Node.js and TypeScript. This project implements core Redis functionality with RESP (REdis Serialization Protocol) support.

## Overview

redis-mini is an educational implementation of a Redis-compatible server that supports essential Redis commands and the RESP protocol. It's designed to demonstrate how Redis works internally while providing a functional in-memory data store.

## Implementation Status

### ✅ Completed
- Core commands (PING, SET, GET, DEL, AUTH)
- Multi-key operations (MSET, MGET)
- Key expiration (EXPIRE, TTL)
- AOF persistence (data recovery on restart)
- RESP protocol parsing
- TCP server with concurrent client support

### 🔄 In Progress
- Additional string operations (APPEND, STRLEN, GETRANGE)
- Pattern matching (KEYS command)
- Database management (EXISTS, FLUSHDB)

### 📋 Planned
- List data structures (LPUSH, RPUSH, LPOP, RPOP, LRANGE)
- Set operations (SADD, SREM, SMEMBERS, SCARD)
- Hash operations (HSET, HGET, HGETALL, HDEL)
- Pub/Sub system (SUBSCRIBE, PUBLISH)
- Transactions (MULTI, EXEC, DISCARD)
- RDB snapshots (binary format persistence)
- Cluster mode support

## Features

- **Core Commands**: PING, GET, SET, DEL, AUTH
- **Multi-Key Operations**: MGET, MSET for batch operations
- **TTL Support**: EXPIRE, PEXPIRE, TTL commands for key expiration
- **RESP Protocol**: Full Redis Serialization Protocol support
- **TCP Server**: Built on Node.js net module
- **In-Memory Storage**: Key-value store with optional expiration using Map
- **Persistence**: AOF (Append Only File) for data recovery
- **Type-Safe**: Written entirely in TypeScript

## Project Structure

```
src/
├── index.ts                  # Server entry point
├── commands/                 # Command implementations
│   ├── auth.ts              # Authentication command
│   ├── del.ts               # Delete & FLUSHDB commands
│   ├── exp.ts               # EXPIRE command
│   ├── get.ts               # GET command
│   ├── mget.ts              # MGET command
│   ├── mset.ts              # MSET command
│   ├── ping.ts              # PING command
│   ├── registry.ts          # Command router
│   ├── set.ts               # SET command
│   ├── ttl.ts               # TTL command
│   └── ...                  # Other commands
├── handlers/                # Request/response handlers
├── models/
│   └── db.ts                # Database storage model
├── protocols/
│   └── resp.ts              # RESP protocol parser
├── responses/
│   └── formatter.js         # Response formatting
├── server/
│   └── connection.ts        # Client connection handler
└── utils/
    └── aof.ts               # AOF persistence utilities
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

**String Operations:**
- **SET** - Store a key-value pair
  ```
  SET key value
  ```

- **GET** - Retrieve a value by key
  ```
  GET key
  ```

- **MSET** - Set multiple key-value pairs
  ```
  MSET key1 value1 key2 value2 key3 value3
  ```

- **MGET** - Get multiple values
  ```
  MGET key1 key2 key3
  ```

**Key Management:**
- **DEL** - Delete one or more keys
  ```
  DEL key1 key2
  ```

- **EXISTS** - Check if keys exist
  ```
  EXISTS key1 key2
  ```

- **EXPIRE** - Set key expiration (seconds)
  ```
  EXPIRE key 300
  ```

- **TTL** - Get remaining time-to-live
  ```
  TTL key
  ```

- **FLUSHDB** - Delete all keys
  ```
  FLUSHDB
  ```

**Connection:**
- **PING** - Check server connectivity
  ```
  PING
  ```

- **AUTH** - Authenticate with password
  ```
  AUTH password
  ```

## Persistence

### AOF (Append Only File)

redis-mini uses AOF for data persistence. Every write command (SET, DEL, MSET, EXPIRE, FLUSHDB) is logged to `aof.log` file.

**Features:**
- Automatic logging of all write operations
- Data recovery on server restart
- Grows incrementally with each command

**How it works:**
1. Server starts → loads `aof.log` and replays all commands
2. Client sends command → command is executed AND logged to file
3. Server restarts → all persisted data is restored

**Example:**
```bash
# Run server
npm run dev

# In redis-cli
SET name Raj
SET age 25
MSET city Mumbai country India

# Check aof.log file
cat aof.log
# Output:
# SET name Raj
# SET age 25
# MSET city Mumbai country India

# Restart server
# Type: GET name
# Result: Raj (✅ Data persisted!)
```

**File Location:**
- Default: `aof.log` in project root
- Created automatically on first write

## Architecture

### Data Model

Each key in the database stores a `StoredValue` object:

```typescript
type StoredValue = {
  value: string;           // The actual data
  expiresAt?: number;      // Optional expiration timestamp (ms)
};
```

This allows storing both the data and its expiration time together.

### Protocol Layer
The RESP protocol parser handles Redis client communication, converting binary data into command tokens.

### Command Handler
The command registry routes incoming commands to their respective implementations.

### Storage
Data is stored in a JavaScript `Map<string, StoredValue>` for O(1) access times, making it suitable for development and educational purposes.

### Connection Management
Each client connection is handled independently via Node.js socket events.

### Persistence Layer
AOF (Append Only File) system logs all write operations to disk for data recovery on restart.

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
- **Storage**: In-memory Map with AOF persistence
- **AOF File**: `aof.log` in project root (auto-created)
- **Expiration**: Keys automatically checked on access (lazy deletion)

## Future Enhancements

- [ ] More data types (Lists, Sets, Hashes, Sorted Sets)
- [ ] RDB snapshots with AOF compaction
- [ ] Pub/Sub messaging system
- [ ] Transactions (MULTI, EXEC, DISCARD)
- [ ] Cluster mode
- [ ] Performance benchmarking
- [ ] Comprehensive test suite

## License

ISC

## Contributing

This is an educational project. Feel free to fork and extend it! 

**For detailed implementation notes and completed features, see `resources.md`**

## Resources

- [Redis Protocol Specification](https://redis.io/docs/reference/protocol-spec/)
- [Redis Command Documentation](https://redis.io/commands/)
- [Node.js Net Module](https://nodejs.org/api/net.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
