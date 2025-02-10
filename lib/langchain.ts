import { OpenAI } from 'langchain/llms/openai';
import { ChatAnthropic } from 'langchain/chat_models/anthropic';
import { PromptTemplate } from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { logger } from '@/utils/logger';
import {
  ASSISTANT_PROMPT_TEMPLATE,
  DOCUMENT_ANALYSIS_TEMPLATE,
  CODE_ANALYSIS_TEMPLATE,
} from './prompts/templates';

export class LLMService {
  private static instance: LLMService;
  private openAIModel: OpenAI | null = null;
  private anthropicModel: ChatAnthropic | null = null;
  private memory: BufferMemory;

  private constructor() {
    this.memory = new BufferMemory();
  }

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  async initializeModels(openAIKey?: string, anthropicKey?: string) {
    try {
      if (openAIKey) {
        this.openAIModel = new OpenAI({
          openAIApiKey: openAIKey,
          temperature: 0.7,
          modelName: 'gpt-4o',
          configuration: {
            apiKey: openAIKey,
            basePath: process.env.NEXT_PUBLIC_OPENAI_API_BASE || 'https://openkey.cloud/v1',
            defaultHeaders: {
              'Content-Type': 'application/json'
            }
          }
        });
        logger.info('OpenAI model initialized');
      }

      if (anthropicKey) {
        this.anthropicModel = new ChatAnthropic({
          anthropicApiKey: anthropicKey,
          temperature: 0.7,
        });
        logger.info('Anthropic model initialized');
      }
    } catch (error) {
      logger.error('Failed to initialize LLM models', error);
      throw error;
    }
  }

  private getPromptTemplate(type: 'general' | 'document' | 'code'): string {
    switch (type) {
      case 'document':
        return DOCUMENT_ANALYSIS_TEMPLATE;
      case 'code':
        return CODE_ANALYSIS_TEMPLATE;
      default:
        return ASSISTANT_PROMPT_TEMPLATE;
    }
  }

  async processPrompt(
    template: string,
    input: Record<string, any>,
    modelType: 'openai' | 'anthropic' = 'openai',
    promptType: 'general' | 'document' | 'code' = 'general'
  ): Promise<{ response: string }> {
    try {
      const model = modelType === 'openai' ? this.openAIModel : this.anthropicModel;
      if (!model) {
        throw new Error(`${modelType} model not initialized`);
      }

      // 根据类型选择提示词模板
      const promptTemplate = this.getPromptTemplate(promptType);
      const systemPrompt = promptTemplate.replace('{input}', input.input || template);

      logger.info('Sending prompt to API', { 
        promptType,
        template: promptTemplate,
        input: input.input || template
      });

      try {
        const response = await model.predict(systemPrompt);
        logger.info('Received API response', { response });
        return { response: response.toString() };
      } catch (apiError) {
        logger.error('API call failed', apiError);
        throw apiError;
      }
    } catch (error) {
      logger.error('Error processing prompt', error);
      throw error;
    }
  }

  clearMemory() {
    this.memory = new BufferMemory();
    logger.info('Memory cleared');
  }
}

export const llmService = LLMService.getInstance(); 