import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IGallery extends Document {
  imgTitle: string
  description: string
  image: string
  date: Date
}

const GallerySchema: Schema<IGallery> = new Schema({
  imgTitle: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
})

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema)

export default Gallery
