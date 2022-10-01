import mongoose from "mongoose";
import { ImageDocumnet } from "../image/image.model";


export interface DeploymentDocumnet extends mongoose.Document {
    imageId: ImageDocumnet["_id"]
    createdAt: Date
    updatedAt: Date
}

const deploymentSchema = new mongoose.Schema(
    {
        imageId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Image" },
    },
    {
        timestamps: true
    }
)

const DeploymentModel = mongoose.model<DeploymentDocumnet>("Deployment", deploymentSchema);

export default DeploymentModel;