import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/db.js';
import ApiError from '../utils/ApiError.js';

const usersCollection = () => getDB().collection('users');

export const register = async (req, res) => {
  const { name, email, photo, photoURL, password } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const existingUser = await usersCollection().findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, 'Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userPhoto = photo || photoURL || '';

  const userDoc = {
    name,
    email: email.toLowerCase(),
    photo: userPhoto,
    password: hashedPassword,
    createdAt: new Date()
  };

  const result = await usersCollection().insertOne(userDoc);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    userId: result.insertedId
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await usersCollection().findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.photo
    },
    process.env.NEXTAUTH_SECRET || '9a4f4e7c7e923bb6f189679f22030f40',
    { expiresIn: '7d' }
  );

  res.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.photo,
    token
  });
};
