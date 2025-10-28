import express from "express";
import { protect } from "../middleware/index.js";
import axios from "axios";
import fs from "fs/promises";
import { getTriageAnalysis, getSortedFeed } from "../services/llm-service.js";
import textModel from "../models/text.js";

const router = express.Router();


router.post('/triage',protect, async (req, res) => {
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
router.get('/auto-triage',protect, async (req, res) => {
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

export default router;