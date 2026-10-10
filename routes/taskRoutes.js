import express from "express";
let taskRouter = express.Router();
import { db } from "../server.js";

taskRouter.get("/", async (req, res, next) => {
  try {

    let completed = req.query.completed
    let project_id = req.query.project_id
    let assigned_to = req.query.assigned_to
    let pickingConditions = []
    let dollarValues = []

    if (completed !== undefined) {
      dollarValues.push(completed)
      pickingConditions.push(`completed=$${dollarValues.length}`)
    }
    if (project_id) {
      dollarValues.push(project_id)
      pickingConditions.push(`project_id=$${dollarValues.length}`)
    }
    if (assigned_to) {
      dollarValues.push(assigned_to)
      pickingConditions.push(`assigned_to=$${dollarValues.length}`)
    }
    let results
    if (completed !== undefined || project_id || assigned_to) {
      results = await db.query("SELECT * FROM tasks WHERE " + pickingConditions.join(" AND "), dollarValues)
    } else {
      results = await db.query("SELECT * FROM tasks")
    }
    if(results.rows.length!==0){
    res.json(results.rows);
    }else{
       let error = new Error("item not found");
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    next(err);
  }
});

taskRouter.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 404;
      return next(error);
    }
    let results = await db.query("SELECT * FROM tasks WHERE id=$1", [id]);
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

taskRouter.post("/", async (req, res, next) => {
  try {
    let { title, description, completed, project_id, assigned_to } = req.body;
    if (title && description && project_id && assigned_to) {
      let results = await db.query(
        "INSERT INTO tasks (title,description,completed,project_id,assigned_to) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [title, description, completed, project_id, assigned_to],
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

taskRouter.delete("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 400;
      return next(error);
    }
    let results = await db.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING * ",
      [id],
    );
    if (results.rows.length === 0) {
      let error = new Error("item not found");
      error.status = 404;
      next(error);
    } else {
      res.json(results.rows);
    }
  } catch (err) {
    next(err);
  }
});

taskRouter.patch("/:id", async (req, res, next) => {
  try {
    let { title, description, completed, project_id, assigned_to } = req.body;
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 400;
      return next(error);
    }
    if (title || description || completed || project_id || assigned_to) {
      let results = await db.query(
        "UPDATE tasks SET title=COALESCE($1,title),description=COALESCE($2,description),completed=COALESCE($3,completed),project_id=COALESCE($4,project_id),assigned_to=COALESCE($5,assigned_to) WHERE id = $6 RETURNING * ",
        [title, description, completed, project_id, assigned_to, id],
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

export default taskRouter;
