# 20 Questions Game Setup Instructions

## Prerequisites

- Node.js 18+ installed
- Keywords AI account and API key
- Provider credentials (OpenAI, Anthropic, or Google) added to Keywords AI

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Configuration**
   
   Update the `.env.local` file with your Keywords AI API key:
   ```env
   KEYWORDS_AI_API_KEY=your_actual_keywords_ai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Keywords AI Setup**
   
   Follow these steps in the Keywords AI platform:
   
   a. **Get API Key**
   - Sign up at [Keywords AI](https://keywordsai.co)
   - Go to API Keys page and create a new key
   - Copy the key to your `.env.local` file
   
   b. **Add Provider Credentials**
   - Go to Providers page in Keywords AI dashboard
   - Add credentials for at least one provider:
     - OpenAI: Add your OpenAI API key
     - Anthropic: Add your Anthropic API key
     - Google: Add your Google AI API key
   
   c. **Set Up Prompt Management (Recommended)**
   - **IMPORTANT**: For optimal performance, set up the game prompt in Keywords AI
   - Follow the detailed guide in `KEYWORDS_AI_PROMPT_SETUP.md`
   - Create prompt named `20-questions-game-master` with required variables
   - The game will use fallback prompts if this step is skipped, but you'll miss out on prompt versioning and monitoring features

## Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Click "Games" in the navigation bar
   - Select "20 Questions" to start playing

## Game Features

### Supported AI Models
- **OpenAI GPT-4o Mini**: Fast and efficient reasoning
- **Anthropic Claude 3.5 Haiku**: Quick and intelligent responses
- **Google Gemini 2.0 Flash**: Google's latest fast model

### Game Flow
1. User selects an AI model
2. User thinks of something (object, person, place, concept)
3. AI asks up to 20 strategic yes/no questions
4. User responds with "Yes", "No", or "Maybe/Sometimes"
5. AI makes a final guess with confidence level
6. Game results show conversation history and statistics

### UI Features
- Real-time progress tracking
- Conversation history sidebar
- Model selection interface
- Responsive design for mobile and desktop
- Game statistics and analytics

## File Structure

```
src/
├── app/
│   ├── api/games/20-questions/ask/route.ts    # API endpoint
│   └── games/20-questions/page.tsx            # Game page
├── components/
│   ├── navigation/TopNavBar.tsx               # Navigation component
│   └── games/twenty-questions/
│       ├── GameInterface.tsx                  # Main game logic
│       ├── QuestionDisplay.tsx               # Question display
│       ├── ResponseButtons.tsx               # User response buttons
│       ├── ProgressTracker.tsx               # Progress visualization
│       └── GameResults.tsx                   # Results page
├── types/games.ts                            # TypeScript definitions
└── pages/HomePage.tsx                        # Updated homepage
```

## Troubleshooting

### Common Issues

1. **"KEYWORDS_AI_API_KEY is not configured"**
   - Ensure `.env.local` file exists and contains the correct API key
   - Restart the development server after adding environment variables

2. **"Failed to start game" or API errors**
   - Verify your Keywords AI account has provider credentials configured
   - Check that your API key has the necessary permissions
   - Ensure you have credits/quota available in your provider accounts

3. **Model not responding**
   - Try switching to a different AI model
   - Check Keywords AI dashboard for any service status issues
   - Verify the model names match the supported models

4. **UI not loading correctly**
   - Clear browser cache and reload
   - Check browser console for JavaScript errors
   - Ensure all dependencies are installed correctly

### Development Tips

1. **Testing Different Models**
   - Each model has different questioning strategies
   - OpenAI tends to be more systematic
   - Anthropic often asks more creative questions
   - Google models balance speed and accuracy

2. **Monitoring API Usage**
   - Check Keywords AI dashboard for request logs
   - Monitor token usage and costs
   - Use the analytics to improve game experience

3. **Customizing the Game**
   - Modify the prompt in `/api/games/20-questions/ask/route.ts`
   - Adjust question limits or confidence thresholds
   - Add new AI models by updating the types file

## Production Deployment

1. **Environment Variables**
   ```env
   KEYWORDS_AI_API_KEY=your_production_api_key
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   npm start
   ```

3. **Vercel Deployment**
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on git push

## Keywords AI Prompt Template

Create this prompt in your Keywords AI dashboard:

**Name**: `20-Questions-Game-Master`

**Template**:
```
You are playing a 20 Questions game. Your goal is to guess what the human is thinking of by asking strategic yes/no questions.

Rules:
- Ask only YES/NO questions
- You have maximum {{max_questions}} questions
- Start with broad categories, then get specific
- User can answer: "Yes", "No", or "Maybe/Sometimes"
- Make your final guess when confident or when questions run out

Current game state:
- Questions asked: {{questions_asked}}/{{max_questions}}
- Previous Q&A: {{conversation_history}}

Based on the conversation so far, ask your next strategic question. If you're confident about the answer or have used all questions, make your final guess instead.

Format your response as either:
- QUESTION: [your question]
- GUESS: [your final guess] (Confidence: X%)
```

**Variables**:
- `max_questions`: 20
- `questions_asked`: Current question count  
- `conversation_history`: JSON array of previous Q&A

## Support

For issues related to:
- **Keywords AI**: Check [Keywords AI Documentation](https://docs.keywordsai.co)
- **Game Logic**: Review the API route implementation
- **UI Issues**: Check component files in `/components/games/twenty-questions/`

Enjoy playing the 20 Questions game with AI! 🎮🤖