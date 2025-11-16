import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICertificate extends Document {
  name: string
  issuedBy: string
  image: string
}

const CertificateSchema: Schema<ICertificate> = new Schema({
  name: { type: String, required: true },
  issuedBy: { type: String, default: '' },
  image: { type: String, required: true },
})

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>('Certificate', CertificateSchema)

export default Certificate
