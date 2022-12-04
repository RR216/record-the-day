import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

let DATABASE_NAME = "cs193x_final";

/* Do not modify or remove this line. It allows us to change the database for grading */
if (process.env.DATABASE_NAME) DATABASE_NAME = process.env.DATABASE_NAME;

const api = express.Router();

/* global varaibles */
let conn = null;
let db = null;
let Memo = null;

/* Takes in express, sets up API, and adds routes to the app */
const initApi = async app => {
  app.set("json spaces", 2);
  app.use("/api", api);

  // Initialize mongodb connection
  conn = await MongoClient.connect("mongodb://localhost");
  db = conn.db(DATABASE_NAME);
  Memo = db.collection("memo");
};

api.use(bodyParser.json());
api.use(cors());

/* Adding all endpoints */

api.get("/", (req, res) => {
  res.json({ db: DATABASE_NAME });
});

/* Retrieve all memos from the database */
api.get("/memo", async (req, res) => {
  let memos = await Memo.find().toArray();  // store memo records as an array
  res.json({ memos });  // respond with user array
});

/* Upload a memo record to database */
api.post("/memo", async (req, res) => {
  let title = req.body.title;
  let date = req.body.date;
  let text = req.body.text;

  // throw an error if text is not entered
  if (!title || !date || !text) {
    res.status(400).json({ error: "Make sure to fill in all fields~" });
    return;
  }

  // create memo  
  const memo = {
    title: title,
    date: date,
    text: text
  };

  await Memo.insertOne({ ...memo });

  res.json({ "success": true });
});

/* Retrieve a memo record from database */
api.get("/memo/:id", async (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.status(404).json({ error: "Please enter an id." });
    return;
  }

  let memo = await Memo.findOne({ id });  // find one memo object

  // Catch error if there is no record of current memo
  if (!memo) {
    res.status(404).json({ error: `There isn't a memo record with ID ${id}.` });
    return;
  }

  res.json({ ...memo });  // spread properties of memo record in the outermost object
});

/* Delete current memo record from database */
api.delete("/memo/:id", async (req, res) => {
  // get memo content
  let id = req.params.id;

  // throw an error if the id doesn't match a memo record
  if (!id) {
    res.status(404).json({ error: "Please enter an id." });
    return;
  }

  let memo = await Memo.deleteOne({ "_id": ObjectId(id) });  // delete one memo object

  res.json({ "success": true });
});

/* Catch-all route to return a JSON error if endpoint not defined */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

export default initApi;
