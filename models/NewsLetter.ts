import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INewsletter extends Document {
  email: string
}

const NewsletterSchema: Schema<INewsletter> = new Schema({
  email: { type: String, required: true },
})

const Newsletter: Model<INewsletter> =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletter>('Newsletter', NewsletterSchema)

export default Newsletter
