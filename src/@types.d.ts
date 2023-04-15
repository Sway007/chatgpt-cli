interface IChatMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface IUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface IChoice {
  message: IChatMessage;
  finish_reason: string;
  index: number;
}

interface IChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: IUsage;
  choices: IChoice[];
}

interface IImageResponse {
  created: number;
  data: Array<{ url: string }>;
}
