import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMember extends Document {
  name: string
  email: string
  phone: string
  image?: string
  joiningDate: Date
  designation?: string
  fbURL?: string
  instaURL?: string
  twitterURL?: string
  linkedinURL?: string
  isActive: boolean
  priority: number
}

const MemberSchema: Schema<IMember> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  image: { type: String, default: '' },
  joiningDate: { type: Date, default: Date.now },
  designation: { type: String },
  fbURL: { type: String, default: '' },
  instaURL: { type: String, default: '' },
  twitterURL: { type: String, default: '' },
  linkedinURL: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 1000 },
})

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema)

export default Member
