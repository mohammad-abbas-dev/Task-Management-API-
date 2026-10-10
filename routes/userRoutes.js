import express from "express";
let userRouter = express.Router();
import { db } from "../server.js";

userRouter.get("/", async (req, res, next) => {
  try {
    let results = await db.query("SELECT * FROM users");
    res.json(results.rows);
  } catch (err) {
    next(err);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 404;
      return next(error);
    }
    let results = await db.query(`SELECT * FROM users WHERE id=$1`, [id]);
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

userRouter.get("/:id/tasks", async (req, res, next) => {
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input")
      error.status = 400
      return next(error)
    }
    let results = await db.query("SELECT assigned_to,title FROM tasks JOIN users ON users.id=tasks.assigned_to WHERE users.id=$1",[id])
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

userRouter.post("/", async (req, res, next) => {
  try {
    let { user_name, description } = req.body;
    if (user_name || description) {
      let results = await db.query(
        "INSERT INTO users (user_name,description) VALUES ($1,$2) RETURNING *",
        [user_name, description],
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

userRouter.patch("/:id", async (req, res, next) => {
  try {
    let { user_name, description } = req.body;
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 400;
      return next(error);
    }
    if (user_name || description) {
      let results = await db.query(
        "UPDATE users SET user_name=COALESCE($1,user_name),description=COALESCE($2,description) WHERE id = $3 RETURNING * ",
        [user_name, description, id],
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

userRouter.delete("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    if (isNaN(id)) {
      let error = new Error("invalid input");
      error.status = 400;
      return next(error);
    }
    let results = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING * ",
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



export default userRouter;
