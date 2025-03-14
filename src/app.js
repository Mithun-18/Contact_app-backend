import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => res.send("server is running...!"));

import contactRoutes from "./routes/contact.routes.js";

app.use("/api/v1/contact", contactRoutes);
export { app };
