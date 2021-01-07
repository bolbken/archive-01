module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "Users must log in." });
  }

  next();
};
