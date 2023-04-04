const { Thought, User } = require("../models");

module.exports = {
// Grab all Users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
// get a single User by their ID
  getUserById: async ({ params }, res) => {
    try {
      const user = await User.findOne({ _id: params.userId })
        .populate("thoughts")
        .populate("friends")
        .select("-__v");
      if (!user) {
        return res
          .status(404)
          .json({ message: `I'm unable to find a User with that ID` });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
// create a User
  createUser: async ({ body }, res) => {
    try {
      const user = await User.create(body);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
// Update a User's info
  updateUser: async ({ params, body }, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $set: body },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: `I'm unable to find a User with that ID` });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
// Delete a User
  deleteUser: async ({ params }, res) => {
    try {
      const user = await User.findOneAndDelete({ _id: params.userId });
      if (!user) {
        return res
          .status(404)
          .json({ message: `I'm unable to find that User` });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: `User and their thought(s) has/have been DELETED` });
    } catch (err) {
      res.status(500).json(err);
    }
  },
// add a friend to User's friend list
  addFriend: async ({ params }, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: `No User has that ID` });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
// remove a friend from a  User's friend list
  removeFriend: async ({ params }, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: `No User has that ID` });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
