const User = require("../models/UserModel");

const getAvailableDeveloper = async () => {
  try {
    const developers = await User.find({
      role: "developer",
      status: "active",
      currentTasks: { $lt: 5 }
    }).sort({ currentTasks: 1 });

    if (!developers.length) return null;

    return developers[0]; // least busy
  } catch (error) {
    console.error("Error in assignmentHelper:", error);
    return null;
  }
};

module.exports = { getAvailableDeveloper };