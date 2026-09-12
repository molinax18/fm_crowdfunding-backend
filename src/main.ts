import express, { json } from "express";

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Backend on line!" });
});

app.listen(PORT);
