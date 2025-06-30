import { Document, model, Schema } from "mongoose";

export interface INote extends Document {
    _id: string;
    message: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>(
    {
        message: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, 'Message must be at least 2 characters long.'],
            maxLength: [300, 'Message cannot exceed 50 characters.']
        },
        signature: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, 'Signature must be at least 2 characters long.'],
            maxLength: [50, 'Signature cannot exceed 20 characters.'],
        }
    },
    {
        timestamps: true
    }
);

export const Note = model<INote>('Note', noteSchema);