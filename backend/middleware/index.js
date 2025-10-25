import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const protect = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).send({ message: "No token provided" });
  }

  const token = header.split(' ')[1]; 
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(401).send({ message: "Invalid token" });
  }
};