import mongoose, {Schema, Types, model, models} from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id?: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls: boolean;
    owner: Types.ObjectId;
    transformation: {
        height: number;
        width: number;
        qulity:number;
    }
}

const videoSchema = new Schema<IVideo>(
    {
       title: {type: String, required: true},
       description: {type: String, required: true},
       videoUrl: {type: String, required: true},
       thumbnailUrl: {type: String, required: true},
       owner: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
       },
       controls: {type: Boolean, default: true},
       transformation: {
        height: {type: Number, default: VIDEO_DIMENSIONS.height},
        width: {type: Number, default: VIDEO_DIMENSIONS.width},
        qulity: {type: Number, min:1, max:100}
       }
    },
    {
       timestamps: true,
    }
)

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;