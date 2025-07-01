import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(req, res) {
    try {
      const payload = req.body;
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.user.create({
        data: payload,
      });

      return res.json({ message: "Account created successfully!", user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.pls try again." });
    }
  }

static async login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Comparing passwords:");
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    console.log("Password match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "365d",
    });

    console.log("Token generated:", token);

    return res.json({
      message: "Logged in successfully!",
      access_token: `Bearer ${token}`,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}


  static async user(req, res) {
    const user = req.user;
    return res.status(200).json({ user: user });
  }
}

export default AuthController;
