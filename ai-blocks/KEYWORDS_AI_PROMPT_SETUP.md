# Keywords AI Prompt Management Setup Guide

## Overview

The 20 Questions game has been updated to use Keywords AI's prompt management system instead of hardcoded prompts. This provides better prompt versioning, collaboration, and monitoring capabilities.

## What You Need to Add to Keywords AI Dashboard

### 1. Create the Prompt Template

Go to your Keywords AI dashboard and create a new prompt with these specifications:

**Prompt Name**: `20-questions-game-master`

**Description**: "AI game master for 20 Questions game that asks strategic yes/no questions to guess what the user is thinking of."

### 2. Prompt Template Content

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

Based on the conversation so far, ask your next strategic question. If you're confident about the answer (80%+ confidence) or have used all questions, make your final guess instead.

Format your response as either:
- QUESTION: [your question]
- GUESS: [your final guess] (Confidence: X%)

Respond with only the formatted output above.
```

### 3. Required Variables

Add these variables to your prompt:

| Variable Name | Type | Description | Example Value |
|---------------|------|-------------|---------------|
| `max_questions` | String | Maximum number of questions allowed | "20" |
| `questions_asked` | String | Current number of questions asked | "5" |
| `conversation_history` | String | JSON array of previous Q&A pairs | `[{"question":"Is it alive?","answer":"no"}]` |

### 4. Model Configuration

Configure the prompt with these settings:

- **Temperature**: 0.7
- **Max Tokens**: 150
- **Top P**: 1.0
- **Frequency Penalty**: 0
- **Presence Penalty**: 0

### 5. Deploy the Prompt

1. After creating the prompt, click "Commit" to save the first version
2. Go to the "Deployments" tab
3. Click "Deploy" and select your environment (production/staging)
4. The prompt will be available at version "latest" or you can specify a version like "v1"

## How the Integration Works

### API Call Flow

1. **Game starts**: API calls Keywords AI prompt management with empty conversation history
2. **User responds**: API calls prompt management with updated conversation history
3. **Fallback**: If prompt management fails, falls back to hardcoded prompt

### API Endpoint Used

```
POST https://api.keywordsai.co/api/v1/prompts/20-questions-game-master/versions/latest/generate
```

### Request Format

```json
{
  "variables": {
    "max_questions": "20",
    "questions_asked": "3",
    "conversation_history": "[{\"question\":\"Is it alive?\",\"answer\":\"no\"},{\"question\":\"Is it electronic?\",\"answer\":\"yes\"}]"
  },
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "max_tokens": 150
}
```

## Benefits of Using Prompt Management

### 1. Version Control
- Track changes to your prompt over time
- A/B test different prompt versions
- Roll back to previous versions if needed

### 2. Collaboration
- Team members can edit and improve prompts
- Review changes before deployment
- Share prompts across projects

### 3. Monitoring
- Track prompt performance and usage
- Monitor token consumption per prompt
- Analyze response quality metrics

### 4. Easy Updates
- Update prompts without code changes
- Deploy new versions instantly
- Test prompts in staging before production

## Troubleshooting

### Common Issues

1. **"Keywords AI prompt API failed: 404"**
   - Ensure the prompt name `20-questions-game-master` exists in your dashboard
   - Check that the prompt is deployed
   - Verify the version ("latest" or specific version like "v1")

2. **"Variables not found"**
   - Ensure all three variables are defined in your prompt:
     - `max_questions`
     - `questions_asked` 
     - `conversation_history`

3. **"Authorization failed"**
   - Check that your `KEYWORDS_AI_API_KEY` is correct
   - Ensure the API key has prompt management permissions

4. **Fallback to hardcoded prompt**
   - Check browser console for error messages
   - Verify Keywords AI service status
   - The game will still work with fallback prompts

### Testing Your Prompt

1. **In Keywords AI Dashboard**:
   - Use the "Test" feature with sample variables
   - Try different conversation histories
   - Verify the output format (QUESTION: or GUESS:)

2. **In the Game**:
   - Start a new game and check browser console
   - Look for "Keywords AI prompt management failed" warnings
   - Successful calls should not show fallback warnings

## Advanced Configuration

### Using Specific Versions

To use a specific prompt version instead of "latest":

1. Update the constant in the API route:
   ```typescript
   const PROMPT_VERSION = 'v1'; // instead of 'latest'
   ```

2. Deploy that specific version in Keywords AI dashboard

### Custom Model Selection

The prompt management API will use the model selected by the user in the game interface:
- OpenAI GPT-4o Mini
- Anthropic Claude 3.5 Haiku  
- Google Gemini 2.0 Flash

### Monitoring and Analytics

In your Keywords AI dashboard, you can:
- View prompt usage statistics
- Monitor response times
- Track token consumption
- Analyze conversation patterns

## Next Steps

1. **Create the prompt** in Keywords AI dashboard using the template above
2. **Add the variables** as specified
3. **Deploy the prompt** to your environment
4. **Test the game** to ensure prompt management is working
5. **Monitor usage** in the Keywords AI dashboard

Once set up, your 20 Questions game will use professional prompt management with all the benefits of versioning, collaboration, and monitoring!