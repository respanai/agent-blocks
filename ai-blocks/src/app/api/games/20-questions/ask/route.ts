// src/app/api/games/20-questions/ask/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GameRequest, GameResponse, GameQuestion } from '@/types/games';

// Configure Keywords AI
const KEYWORDS_AI_BASE_URL = 'https://api.keywordsai.co/api/';
const KEYWORDS_AI_PROMPT_ID = process.env.KEYWORDS_AI_PROMPT_ID || 'fa51377c8e8d42e1ad54c5864f2cd201';



// Function to call Keywords AI with prompt management using OpenAI client
async function callKeywordsAIPrompt(
  conversationHistory: GameQuestion[], 
  questionsAsked: number,
  selectedModel: any,
  selectedCategory?: string
): Promise<string> {
  const { OpenAI } = await import('openai');
  
  const client = new OpenAI({
    baseURL: KEYWORDS_AI_BASE_URL,
    apiKey: process.env.KEYWORDS_AI_API_KEY
  });

  const maxQuestions = 20;
  const historyText = conversationHistory.length > 0 
    ? conversationHistory.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')
    : 'No previous questions asked.';

  const isFinalQuestion = questionsAsked >= 20;

  // Use OpenAI client with Keywords AI prompt management - override mode
  const response = await client.chat.completions.create({
    model: selectedModel.modelName || 'gpt-4o-mini',
    messages: [{"role":"user", "content":"Say this is a test"}],
    temperature: 0.8,
    max_tokens: 150,
    // @ts-expect-error
    prompt: {
      prompt_id: KEYWORDS_AI_PROMPT_ID,
      variables: {
        max_questions: maxQuestions.toString(),
        questions_asked: questionsAsked.toString(),
        conversation_history: historyText,
        selected_category: selectedCategory || 'Mixed (anything goes - hardest mode!)',
        is_final_question: isFinalQuestion.toString()
      },
      override: true,
      override_params: {
        model: selectedModel.modelName || 'gpt-4o-mini'
      }
    }
  });

  const aiResponse = response.choices[0]?.message?.content || '';
  console.log('AI Response:', aiResponse);
  return aiResponse;
}



function parseAIResponse(response: string): GameResponse {
  const trimmed = response.trim();
  console.log('Parsing AI response:', trimmed);
  
  if (trimmed.startsWith('QUESTION:')) {
    const question = trimmed.replace('QUESTION:', '').trim();
    console.log('Parsed as question:', question);
    return {
      type: 'question',
      content: question,
      isGameOver: false
    };
  } else if (trimmed.startsWith('GUESS:')) {
    const guessText = trimmed.replace('GUESS:', '').trim();
    
    // Extract confidence if present
    const confidenceMatch = guessText.match(/\(Confidence:\s*(\d+)%\)/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 85;
    
    // Remove confidence from guess text
    const cleanGuess = guessText.replace(/\s*\(Confidence:\s*\d+%\)/, '').trim();
    
    console.log('Parsed as guess:', cleanGuess, 'with confidence:', confidence);
    return {
      type: 'guess',
      content: cleanGuess,
      confidence,
      isGameOver: true
    };
  } else {
    // Check if this looks like a guess without proper formatting
    if (trimmed.toLowerCase().includes('guess') || trimmed.toLowerCase().includes('think') || trimmed.toLowerCase().includes('confident')) {
      console.log('Treating unformatted response as guess:', trimmed);
      return {
        type: 'guess',
        content: trimmed,
        confidence: 70,
        isGameOver: true
      };
    }
    
    // Fallback - treat as question if format is unclear
    console.log('Treating as question (fallback):', trimmed);
    return {
      type: 'question',
      content: trimmed,
      isGameOver: false
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GameRequest = await request.json();
    const { conversationHistory, selectedModel, selectedCategory, action } = body;

    if (action === 'start') {
      // Start new game with first question
      const text = await callKeywordsAIPrompt([], 0, selectedModel, selectedCategory);
      const response = parseAIResponse(text);
      return NextResponse.json(response);
    }

    if (action === 'answer') {
      // Continue game with user's answer
      const questionsAsked = conversationHistory.length;
      
      // Check if we've reached the question limit (after 20 questions)
      if (questionsAsked >= 21) {
        return NextResponse.json({
          type: 'guess',
          content: 'Based on our conversation, I need to make my final guess. Let me think about what you might be thinking of...',
          confidence: 70,
          isGameOver: true
        });
      }

      const text = await callKeywordsAIPrompt(conversationHistory, questionsAsked, selectedModel, selectedCategory);
      const response = parseAIResponse(text);
      
      // Force final guess if this is the 20th question (questionsAsked will be 20 after this response)
      if (questionsAsked >= 20 && response.type === 'question') {
        console.log('Forcing final guess on 20th question');
        return NextResponse.json({
          type: 'guess',
          content: response.content + ' Actually, this is my 20th question, so I must make my final guess now.',
          confidence: 75,
          isGameOver: true
        });
      }
      
      return NextResponse.json(response);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in 20 questions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}