import { Request, Response } from "express";
import { isBlank } from "../utils/isBlank";
import { Note } from "../models/note.model";

// Create Note
export const createNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, signature } = req.body;

        if (isBlank(message) || isBlank(signature)) {
            res.status(400).json({ message: "Message and signature are required." });
            return;
        }

        const trimmedMessage = message.trim();
        const trimmedSignature = signature.trim();

        if (trimmedMessage.length < 2) {
            res.status(400).json({ message: "Message must be at least 2 characters long." });
            return;
        }

        if (trimmedMessage.length > 300) {
            res.status(400).json({ message: "Message must not exceed 300 characters." });
            return;
        }

        if (trimmedSignature.length < 2) {
            res.status(400).json({ message: "Signature must be at least 2 characters long." });
            return;
        }

        if (trimmedSignature.length > 50) {
            res.status(400).json({ message: "Signature must not exceed 50 characters." });
            return;
        }

        const note = await Note.create({
            message: trimmedMessage,
            signature: trimmedSignature
        });

        res.status(200).json(note);

    } catch (error) {
        console.error("Error creating note: ", error);
        res.status(500).json({ message: "Failed to create note." });
    }
}

// Get All Notes
export const getAllNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const notes = await Note.find();

        if (!notes) {
            res.status(404).json({message: "Notes not found."});
            return;
        }

        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes: ", error);
        res.status(500).json({message: "Failed to fetch notes."});
    }
}

// Get A Note
export const getNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            res.status(404).json({message: "Note not found."});
            return;
        }

        res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching note: ", error);
        res.status(500).json({message: "Failed to fetch note."});
    }
}

// Update A Note
export const updateNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, signature } = req.body;
        const { id } = req.params;

        if (isBlank(message) && isBlank(signature)) {
            res.status(400).json({ message: "No update fields provided." });
            return;
        }

        const note = await Note.findById(id);
        if (!note) {
            res.status(404).json({message: "Note not found."});
            return;
        }

        const updateDetails: any = {};

        if (!isBlank(message)) {
            const trimmedMessage = message.trim();

            if (trimmedMessage.length < 2) {
                res.status(400).json({ message: "Message must be at least 2 characters." });
                return;
            }

            if (trimmedMessage.length > 300) {
                res.status(400).json({ message: "Message cannot exceed 300 characters." });
                return;
            }

            updateDetails.message = trimmedMessage;
        }

        if (!isBlank(signature)) {
            const trimmedSignature = signature.trim();

            if (trimmedSignature.length < 2) {
                res.status(400).json({ message: "Signature must be at least 2 characters." });
                return;
            }

            if (trimmedSignature.length > 50) {
                res.status(400).json({ message: "Signature cannot exceed 50 characters." });
                return;
            }

            updateDetails.signature = trimmedSignature;
        }

        const finalMessage = updateDetails.message || note.message;
        const finalSignature = updateDetails.signature || note.signature;

        const noteExists = await Note.findOne({
            message: finalMessage,
            signature: finalSignature,
            _id: { $ne: id }
        });

        if (noteExists) {
            res.status(400).json({message: "Note cannot be updated as a note with these details already exists."});
            return;
        }

        const updatedNote = await Note.findByIdAndUpdate(id, updateDetails, {new: true});

        if (!updatedNote) {
            res.status(400).json({message: "Note not found after update."});
            return;
        }

        res.status(200).json(updatedNote);

    } catch (error) {
        console.error("Error updating note: ", error);
        res.status(500).json({message: "Failed to update note."});
    }
}

// Delete a Note
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            res.status(404).json({message: "Note not found."});
            return;
        }

        res.status(200).json({message: "Note deleted successfully."});

    } catch (error) {
        console.error("Error deleting note: ", error);
        res.status(500).json({message: "Failed to delete note."});
    }
}