const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');

// get goals

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id })
  res.status(200).json(goals)
});

// set goal

const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('No text field')
  }
  const goal = Goal.create({
    text: req.body.text,
    user: req.user.id
  })
  res.status(200).json(goal)
});
// update goal 
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  // check for goal
  if (!goal) {
    res.status(400)
    throw new Error('Goal not exists')
  }
  // check for user
  if (!req.user) {
    res.status(400)
    throw new Error('User not found')
  }
  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
  const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
  res.status(200).json(updateGoal)
})
// delete goal

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  // check for goal
  if (!goal) {
    res.status(400)
    throw new Error('Goal not found');
  }
  // check for user
  if (!req.user) {
    res.status(400)
    throw new Error('User not found')
  }
  // check for the logged matched user
  if (goal.user.toString() !== req.user.id) {
    res.status(400)
    throw new Error('User not authorized')
  }
  await goal.remove()
  res.status(200).json({ id: req.params.id })
})
module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal
}