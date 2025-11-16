import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IActivitiesNumber extends Document {
  happyPeople: number
  offices: number
  staff: number
  volunteers: number
}

const ActivitiesNumberSchema: Schema<IActivitiesNumber> = new Schema({
  happyPeople: {
    type: Number,
    default: 0,
  },
  offices: {
    type: Number,
    default: 0,
  },
  staff: {
    type: Number,
    default: 0,
  },
  volunteers: {
    type: Number,
    default: 0,
  },
})

const ActivitiesNumber: Model<IActivitiesNumber> =
  mongoose.models.ActivitiesNumber ||
  mongoose.model<IActivitiesNumber>('ActivitiesNumber', ActivitiesNumberSchema)

export default ActivitiesNumber
