import express from "express";
let projectRouter = express.Router();
import { db } from "../server.js";

projectRouter.get("/", async (req, res, next) => {
  try {
    let results = await db.query("SELECT * FROM projects");
    res.json(results.rows);
  } catch (err) {
    next(err);
  }
});

projectRouter.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 404;
      return next(error);
    }
    let results = await db.query("SELECT * FROM projects WHERE id=$1", [id]);
    if (results.rows.length !== 0) {
      res.json(results.rows);
    } else {
      let error = new Error("item not found");
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    next(err);
  }
});

projectRouter.get("/:id/tasks",async (req,res,next)=>{
   try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input")
      error.status = 400
      return next(error)
    }
    let results = await db.query("SELECT projects.id,title FROM tasks JOIN projects ON projects.id=tasks.assigned_to WHERE projects.id=$1",[id])
    if (results.rows.length!==0){
      res.json(results.rows)
    }else{
      let error = new Error("item not found")
      error.status = 404
      return next(error)
    }
  } catch (err) {
    next(err)
  }
})

projectRouter.get("/:id/stat",async (req,res,next)=>{
  let id = req.params.id
  if(isNaN(id)){
    let error = new Error("invalid input")
    error.status=400
    next(error)
  }
  let results = await db.query("SELECT COUNT(tasks.title) AS amount_of_tasks, projects.project_name, COUNT(tasks.completed) FILTER ( WHERE tasks.completed = true ) AS completed, COUNT(tasks.completed) FILTER (WHERE tasks.completed = false ) AS in_completed FROM tasks JOIN projects ON projects.id = tasks.project_id GROUP BY projects.id HAVING projects.id=$1",[id])
  res.json(results.rows) 
})


projectRouter.post("/", async (req, res, next) => {
  try {
    let { project_name, description, owner_id } = req.body;
    if (project_name || description || owner_id) {
      let results = await db.query(
        "INSERT INTO projects (project_name,description,owner_id) VALUES ($1,$2,$3) RETURNING *",
        [project_name, description, owner_id],
      );
      res.status(201).json(results.rows);
    } else {
      let error = new Error("missing input");
      error.status = 400;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

projectRouter.delete("/:id", async (req, res, next) => {
  const client = await db.connect();
  try {

    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 400;
      return next(error);
    }

    // let results = await db.query(
    //   "DELETE FROM projects WHERE id = $1 RETURNING * ",
    //   [id],
    // );

      await client.query("BEGIN");
      await client.query("DELETE FROM tasks WHERE tasks.project_id=$1",[id]);
      await client.query("DELETE FROM projects WHERE projects.id=$1",[id]);
      await client.query("COMMIT");
       
      // let results = await db.query("SELECT * FROM projects")
      res.json("item deleted")
    if (results.rows.length === 0) {
      let error = new Error("item not found");
      error.status = 404;
      next(error);
    } else {

      res.json(results.rows);
    }

  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  }finally {
  client.release();
}
});

projectRouter.patch("/:id", async (req, res, next) => {
  try {
    let { project_name, description, owner_id } = req.body;
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 400;
       return next(error);
    }
    if (project_name || description || owner_id) {
      let results = await db.query(
        "UPDATE projects SET project_name=COALESCE($1,project_name),description=COALESCE($2,description),owner_id=COALESCE($3,owner_id) WHERE id = $4 RETURNING * ",
        [project_name, description, owner_id, id],
      );
      if (results.rows.length !== 0) {
        res.json(results.rows);
      } else {
        let error = new Error("item not found");
        error.status = 404;
        return next(error);
      }
    } else {
      let error = new Error("missing input");
      error.status = 400;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

export default projectRouter;
