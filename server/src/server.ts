import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import noteRoutes from "./routes/note.routes";


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});