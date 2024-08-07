var express = require('express');
var router = express.Router();
const task = require('../models/Tasks')

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(tasks);
  res.render('index');
});

router.get('/fetch', async function(req, res, next) {
  const tasks = await task.find({});
  //console.log("fetch received!");
  // console.log(tasks);
  res.status(200).send(tasks);
});

router.post('/tasks', async function(req, res, next) {
  const { name, completed } = req.body;
  const tasks = await task.create({name, completed});
  res.status(201).json(tasks);
});

router.put('/tasks/:name', async (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const { completed } = req.body;
  await task.updateOne({name}, {
    $set: {
      "completed": completed
    }
  });
  console.log("Flag Updated..");
  res.status(201);
});

router.delete('/tasks/:name', async (req, res) => {
  const name = decodeURIComponent(req.params.name);
  await task.deleteOne({name});
  console.log("Task Deleted!")
  res.status(200);
});

module.exports = router;
