import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/index.js';
import fs from 'fs/promises';
import axios from 'axios';
import { getSortedFeed, getTriageAnalysis } from './services/llm-service.js';
import { validateUserLogin, validateUserRegistration } from './types/user.js';
import { protect } from './middleware/index.js';
import User from './models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import textModel from './models/text.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/auth/register", validateUserRegistration,async(req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = { 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword 
    };
    
    const result = await User.create(newUser);

    const token = jwt.sign({ userId: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({
        token : token,
        fullName: `${result.firstName} ${result.lastName}`,
        email: result.email
    });

  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }

});


app.post("/auth/login", validateUserLogin,(req, res) => {
  try {
  const {email , password} = req.body;

  const isExistingUser = User.findOne({email : email});
  if (!isExistingUser) {
    return res.status(400).json({message: "User does not exist"});
  }

  const isPasswordValid = bcrypt.compare(password, isExistingUser.hash);
  if (!isPasswordValid) {
    return res.status(400).json({message: "Invalid password"});
  }

  const token = jwt.sign({userId: isExistingUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

  res.status(200).json({
    token: token,
    fullName: `${isExistingUser.firstName} ${isExistingUser.lastname}`,
    email: isExistingUser.email
    });
  } catch (error) {
    res.status(500).json({message: "Error logging in user"});  
  }

});



app.post('/triage',protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const analysis = await getTriageAnalysis(text);
    res.json(analysis);

    const textEntry = new textModel({
      text: text,
      urgencyLevel: analysis.urgency_level
    });
    await textEntry.save();

  } catch (error) {
    console.error('Error in /triage:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
});

app.get('/auto-triage',protect, async (req, res) => {
  try {
    let reports = [];

    const newsQuery = 'disaster OR flood OR earthquake OR fire OR hurricane';
    const newsUrl = `https://gnews.io/api/v4/search?q=${newsQuery}&lang=en&apikey=${process.env.NEWS_API_KEY}`;
    
    const newsResponse = await axios.get(newsUrl);
    const newsArticles = newsResponse.data.articles.map(article => `News: ${article.title} - ${article.description}`);
    reports = reports.concat(newsArticles);

    // 2. Fetch Mocked Tweets
    const mockData = await fs.readFile('mock-tweets.json', 'utf-8');
    const mockTweets = JSON.parse(mockData).map(tweet => `Tweet: ${tweet.text}`);
    reports = reports.concat(mockTweets);
    
    const sortedFeed = await getSortedFeed(reports);
    res.json(sortedFeed);

  } catch (error) {
    console.error('Error in /auto-triage:', error);
    res.status(500).json({ message: 'Error fetching feed' });
  }
});

app.listen(process.env.PORT || 3000, () => {
    connectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});