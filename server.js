import express from "express";
import { Pool } from "pg";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import errorHandler from './middleware/error.js'
import notFound from './middleware/notFound.js'
import taskRouter from "./routes/taskRoutes.js";
let server = express();
let pass = process.env.pass
const PORT = process.env.PORT || 3000;

export let db = new Pool({
  user: "postgres",
  database: "postgres3",
  host: "localhost",
  password: pass,
  port: 5123,
});
server.use(express.json())
server.get("/",(req,res)=>{
  res.send("welcome to home page")
})
server.use("/users", userRouter);
server.use("/projects", projectRouter);
server.use("/tasks", taskRouter);


server.use(notFound);
server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
