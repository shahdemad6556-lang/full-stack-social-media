import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  bio: user.bio,
  avatar: user.avatar,
  token: generateToken(user._id),
});

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }

        const user = await User.create({ name, username, email, password });

    await sendEmail({
      to: user.email,
      subject: "Welcome to Social!",
      html: `<h2>Welcome, ${user.name}!</h2><p>Your account @${user.username} is ready. Start posting and connecting.</p>`,
    });

    res.status(201).json(userResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json(userResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};