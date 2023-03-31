const { Thought, User, Reaction } = require("../models");

module.exports = {
  // grabs all Thoughts
  getAllThoughts: async (req, res) => {
    try {
      const thoughtData = await Thought.find({});
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // grabs a Single thought by it's ID
  getOneThought: async ({ params }, res) => {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId }).select("-__v");
      if (!thoughtData) {
        return res.status(404).json({ message: "I can't find that Thought" });
      }
      res.json(thoughtData);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Create a Thought, and then adds it to the Thoughts the User has already created.
  createThought: async (req, res) => {
    try {
      const thoughtData = await Thought.create(req.body);
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No user found!" });
      }
      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // update a thought
  updateThought: async (req, res) => {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(updatedThought);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  // delete a single thought
  deleteThought: async ({ params }, res) => {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: params.thoughtId, });
      if (!deletedThought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      const userData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "No user with this id!" });
      }
      res.json({ message: "Thought deleted!" });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  createReaction: async (req, res) => {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: `I'm unable to find a Thought with that ID` });
      } else {
        res.json(updatedThought);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  deleteReaction: async (req, res) => {
    try {
      const deletedReaction = await Reaction.findOneAndDelete({ _id: req.params.reactionId });
      if (!deletedReaction) {
        return res.status(404).json({ message: `I'm unable to find a Reaction with that ID` });
      }
      res.json({ message: 'Reaction deleted successfully', data: deletedReaction });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
