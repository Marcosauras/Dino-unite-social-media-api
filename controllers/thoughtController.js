const { Thought, User, Reaction } = require("../models");

module.exports = {
  // grabs all Thoughts
  getAllThoughts: async (req, res) => {
    try {
      const thoughtData = await Thought.find({});
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // grabs a Single thought by it's ID
  getOneThought: async ({ params }, res) => {
    try {
      const thoughtData = await Thought.findOne({ _id: params.thoughtId }).select("-__v");
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
        { id: req.body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No user found!" });
      }
      res.json(`${thoughtData} A new Thought has been created`);
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
        { id: params.userId },
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
        const thoughtId = req.params.thoughtId;
        const reactionId = req.params.reactionId;
        if (!thoughtId || !reactionId) {
            return res.status(400).json({ message: "Both thoughtId and reactionId are required" });
        }
        const deletedReaction = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $pull: { reactions: { reactionId: reactionId } } },
            { runValidators: true, new: true }
        );
        if (!deletedReaction) {
            return res.status(404).json({ message: "No reaction found with the given thoughtId and reactionId" });
        }
        res.json({ message: "Reaction deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},
};
