// Example protected routes
exports.getDashboard = (req, res) => {
  res.json({ message: `Welcome to dashboard, user ${req.user.id}` });
};

exports.getProfile = (req, res) => {
  res.json({ message: `This is your profile, ${req.user.id}` });
};
