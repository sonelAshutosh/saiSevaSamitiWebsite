import mongoose from 'mongoose'

interface IConnection {
  isConnected?: number
}

const connection: IConnection = {}

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return
  }

  const DB_USER = process.env.MONGO_DB_USER
  const DB_PASS = process.env.MONGO_DB_PASS

  if (!DB_USER || !DB_PASS) {
    throw new Error('Missing DB_USER or DB_PASS environment variables')
  }

  try {
    const db = await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.0rs40o3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )

    connection.isConnected = db.connections[0].readyState

    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

export default dbConnect
