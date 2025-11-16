import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDonator extends Document {
  name: string
  email: string
  phone?: string
  amount: number
  paymentMode?: string
  transactionId: string
  date: Date
  isVerified: boolean
}

const DonatorsSchema: Schema<IDonator> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  amount: { type: Number, required: true },
  paymentMode: { type: String },
  transactionId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
})

const Donators: Model<IDonator> =
  mongoose.models.Donators ||
  mongoose.model<IDonator>('Donators', DonatorsSchema)

export default Donators
