module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    res
      .status(403)
      .send({ error: "User must have 1 or more credits available." });
  }
  next();
};
