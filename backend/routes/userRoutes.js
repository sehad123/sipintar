const express = require("express");
const { registerUser, loginUser } = require("../services/userService");
const { getAllPegawaiUsers, getUserById, updateUser, deleteUser } = require("../services/userService");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role, no_hp } = req.body;
  try {
    const newUser = await registerUser({ name, email, password, role, no_hp });
    res.json(newUser);
  } catch (error) {
    if (error.message === "Email already registered") {
      res.status(400).json({ error: "Email sudah digunakan" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all Pegawai users
router.get("/users/pegawai", async (req, res) => {
  try {
    const pegawaiUsers = await getAllPegawaiUsers();
    res.json(pegawaiUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pegawai users" });
  }
});

// Get a user by ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update a user by ID
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, no_hp } = req.body;
  try {
    const updatedUser = await updateUser(id, { name, email, password, role, no_hp });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser({ email, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
