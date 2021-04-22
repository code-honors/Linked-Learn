const express = require("express");
const server = require('../server')
const router = express.Router();
const db = require("../db");

router.get("/", async function(req, res, next) {
    try {
      const results = await db.query("SELECT * FROM courses ");
      return res.json(results.rows);
    } catch (err) {
      return next(err);
    }
  });
  
  router.delete("/:id", async function(req, res, next) {
    try {
      const result = await db.query("DELETE FROM  WHERE id=$1", [
        req.params.id
      ]);
      return res.json({ message: "Deleted" });
    } catch (err) {
      return next(err);
    }
  });
  
  module.exports = router;