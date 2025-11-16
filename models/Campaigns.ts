import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICampaign extends Document {
  name: string
  description: string
  image: string
  date: Date
}

const CampaignSchema: Schema<ICampaign> = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
})

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>('Campaign', CampaignSchema)

export default Campaign
