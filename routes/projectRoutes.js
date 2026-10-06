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
      error.status = 400;
      return next(error);
    }
  } catch (err) {
    next(err);
  }
});

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
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 400;
      return next(error);
    }
    let results = await db.query(
      "DELETE FROM projects WHERE id = $1 RETURNING * ",
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
