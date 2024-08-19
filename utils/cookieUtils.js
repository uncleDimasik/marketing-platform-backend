const getCookieOptions = ({ clear = false } = {}) => {
  return {
    maxAge: clear ? 0 : 30 * 24 * 60 * 60 * 1000, //30d
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
  };
};

const setRefreshTokenCookie = (res, token) => {
  console.log(process.env.COOKIE_DOMAIN);
  res.cookie('refreshToken', token, getCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', getCookieOptions({ clear: true }));
};

module.exports = {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
