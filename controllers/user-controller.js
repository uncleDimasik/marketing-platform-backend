const userService = require('../service/user-service');

class UserController {
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async whoAmI(req, res, next) {
    try {
      const user = await userService.whoAmI(req.user);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
