// controllers/data_controller.js
const get_user_data = async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).send({ error: 'Not logged in' });
  }

  // Check the user's role within their company
  const role = await Role.findOne({ where: { id: user.role_id } });

  if (role.name !== 'admin') {
    return res.status(403).send({ error: 'Access denied' });
  }

  // Get data for the user
  const data = await get_data_for_user(user);

  res.send(data);
};