const userService = require('../service/user-service');
const {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/cookieUtils');


class AuthController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(
        email,
        password
      );
      setRefreshTokenCookie(res, userData.refreshToken);
      const { refreshToken, ...cleanedData } = userData;
      return res.json(cleanedData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      setRefreshTokenCookie(res, userData.refreshToken);
      const { refreshToken, ...cleanedData } = userData;
      return res.json(cleanedData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.signedCookies;
      const token = await userService.logout(refreshToken);

      clearRefreshTokenCookie(res);

      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.signedCookies;
      const userData = await userService.refresh(refreshToken);
      setRefreshTokenCookie(res, userData.refreshToken);
      const { refreshToken: rt, ...cleanedData } = userData;
      return res.json(cleanedData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
