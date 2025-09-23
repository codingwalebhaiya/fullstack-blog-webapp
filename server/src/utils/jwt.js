import jwt from "jsonwebtoken";

const generateToken = async(payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

export default generateToken;
