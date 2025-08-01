import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js"

//register

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error.message); // 👈 log it
    res.status(500).json({ message: "Server Error" });
  }
};

//login

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not found" });
    }
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "No Profile Found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
