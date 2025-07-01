import prisma from "../config/db.config.js";

class UserController {

  // * Get a single user by ID and send that user data
  static async getUser(req, res) {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return res.json({ user: user });
  }

  // * Get multiple users by IDs and send those user data
  static async getUsers(req, res) {
    const { userIds } = req.body;
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.json({ users: users });
  }
}

export default UserController;
