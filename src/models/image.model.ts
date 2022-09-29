import mongoose from "mongoose";

export interface ImageDocumnet extends mongoose.Document {
    name: string
    repository: string
    version: string
    metadata: object
    createdAt: Date
    updatedAt: Date
}

const imageSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        repository: {type: String, required: true},
        version: {type: String, required: true},
        metadata: {type: Object, required: false}
    },
    {
        timestamps: true
    }
)

const ImageModel = mongoose.model<ImageDocumnet>("Image", imageSchema);

export default ImageModel;