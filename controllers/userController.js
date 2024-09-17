import User from "../models/userModel.js";
import logToFile from "../utils/logger.js";

// Read all users with optional filtering, sorting, and pagination
const getAllUsers = async (req, res) => {
  const { filter, sort, page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(400).json({ message: "Invalid page number" });
  }
  if (isNaN(limitNumber) || limitNumber <= 0) {
    return res.status(400).json({ message: "Invalid limit number" });
  }

  const filterObj = filter ? JSON.parse(filter) : {};
  const sortObj = sort ? JSON.parse(sort) : {};
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const users = await User.find(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber);
    const totalUsers = await User.countDocuments(filterObj);

    logToFile(
      `GET /users - Filter: ${filter || "None"}, Sort: ${
        sort || "None"
      }, Page: ${pageNumber}, Limit: ${limitNumber}, Users Count: ${
        users.length
      }`,
      req.method,
      req.url
    );

    res.status(200).json({
      message: "Users fetched!",
      users,
      totalUsers,
      page: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
    });
  } catch (err) {
    logToFile(`GET /users - Error: ${err.message}`, req.method, req.url);
    res
      .status(500)
      .json({ message: "Error while fetching users", error: err.message });
  }
};

// Read a single user by ID
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    if (!user) {
      logToFile(`GET /users/${id} - User not found`, req.method, req.url);
      return res.status(404).json({ message: "User not found!" });
    }

    logToFile(`GET /users/${id} - User fetched`, req.method, req.url);
    res.status(200).json({ message: "User fetched!", user });
  } catch (err) {
    logToFile(`GET /users/${id} - Error: ${err.message}`, req.method, req.url);
    res
      .status(500)
      .json({ message: "Error while fetching user", error: err.message });
  }
};

// Update an existing user by ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const allowedUpdates = ["firstName", "lastName", "email", "password"];
  const invalidFields = Object.keys(updatedData).filter(
    (field) => !allowedUpdates.includes(field)
  );

  if (invalidFields.length > 0) {
    logToFile(
      `PUT /users/${id} - Invalid update fields: ${invalidFields.join(", ")}`,
      req.method,
      req.url
    );
    return res.status(400).json({
      message: "Invalid update fields",
      invalidFields,
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      logToFile(`PUT /users/${id} - User not found`, req.method, req.url);
      return res.status(404).json({ message: "User not found" });
    }

    logToFile(`PUT /users/${id} - User updated`, req.method, req.url);
    res.status(200).json({ message: "User updated!", user: updatedUser });
  } catch (err) {
    logToFile(`PUT /users/${id} - Error: ${err.message}`, req.method, req.url);
    res
      .status(500)
      .json({ message: "Error while updating user", error: err.message });
  }
};

// Replace an existing user by ID
const replaceUser = async (req, res) => {
  const { id } = req.params;
  const replacementData = req.body;

  try {
    const replacedUser = await User.findOneAndReplace(
      { _id: id },
      replacementData,
      { new: true }
    );

    if (!replacedUser) {
      logToFile(`PUT /users/${id} - User not found`, req.method, req.url);
      return res.status(404).json({ message: "User not found" });
    }

    logToFile(`PUT /users/${id} - User replaced`, req.method, req.url);
    res.status(200).json({ message: "User replaced!", user: replacedUser });
  } catch (err) {
    logToFile(`PUT /users/${id} - Error: ${err.message}`, req.method, req.url);
    res
      .status(500)
      .json({ message: "Error while replacing user", error: err.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      logToFile(`DELETE /users/${id} - User not found`, req.method, req.url);
      return res.status(404).json({ message: "User not found" });
    }

    logToFile(`DELETE /users/${id} - User deleted`, req.method, req.url);
    res.status(200).json({ message: "User deleted!", user: deletedUser });
  } catch (err) {
    logToFile(
      `DELETE /users/${id} - Error: ${err.message}`,
      req.method,
      req.url
    );
    res
      .status(500)
      .json({ message: "Error while deleting user", error: err.message });
  }
};

export { getAllUsers, getUser, updateUser, replaceUser, deleteUser };
