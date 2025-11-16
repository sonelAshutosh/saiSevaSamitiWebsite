import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IVolunteer extends Document {
  name: string
  email: string
  phone: string
  role?: string
  joiningDate: Date
  image?: string
  dateOfBirth?: Date
  fbURL?: string
  instaURL?: string
  twitterURL?: string
  linkedinURL?: string
  showInList: boolean
  isActive: boolean
}

const VolunteerSchema: Schema<IVolunteer> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String },
  joiningDate: { type: Date, default: Date.now },
  image: { type: String, default: '' },
  dateOfBirth: { type: Date },
  fbURL: { type: String },
  instaURL: { type: String },
  twitterURL: { type: String },
  linkedinURL: { type: String },
  showInList: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
})

const Volunteer: Model<IVolunteer> =
  mongoose.models.Volunteer ||
  mongoose.model<IVolunteer>('Volunteer', VolunteerSchema)

export default Volunteer
