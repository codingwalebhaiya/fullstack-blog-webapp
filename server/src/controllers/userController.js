const getUser = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  console.log(user)
  return res.json(201).json({ message: "User fetched successfully", user });
};
export { getUser };
