import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// Initialize the model (Flash-2)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface AnalysisRequest {
  data: string;
  question: string;
}

export interface AnalysisResponse {
  answer: string;
  visualization?: {
    type: 'line' | 'bar' | 'scatter' | 'pie';
    data: any;
  };
}

export async function analyzeData({ data, question }: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const prompt = `Analyze this data:\n${data}\n\nQuestion: ${question}\n\nProvide insights and suggest appropriate visualizations if applicable.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // TODO: Parse the response and extract visualization suggestions
    // For now, return just the text response
    return {
      answer: text,
    };
  } catch (error) {
    console.error('Error analyzing data:', error);
    throw new Error('Failed to analyze data. Please try again.');
  }
}