import { Router } from "express";
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "../controllers/note.controller";

const router = Router();

router.get('/', getAllNotes);
router.post('/', createNote);

router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;