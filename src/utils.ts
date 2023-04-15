import axios, { AxiosRequestConfig } from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { homedir } from 'os';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import { startSpinner } from './spin';

const baseURL = 'https://api.openai.com';

const CONFIG_FILE = path.join(homedir(), '.chatgpt-cli');
if (!fs.existsSync(CONFIG_FILE))
  fs.writeFileSync(CONFIG_FILE, '', { flag: 'a+' });

/** get api key from config file */
function getConfig(): { apiKey?: string; proxy?: string } {
  return dotenv.parse(fs.readFileSync(CONFIG_FILE));
}

export function updateConfig(obj: { [k in 'apiKey' | 'proxy']?: any }) {
  const config = getConfig() as any;
  for (const k in obj) {
    // @ts-ignore
    config[k] = obj[k];
  }
  const content = Object.entries(config)
    .map((item) => {
      if (item[1]) return `${item[0]}=${item[1]}`;
      else return null;
    })
    .join('\n');
  fs.writeFileSync(CONFIG_FILE, content);
}

async function inputKey(): Promise<{ apiKey: string }> {
  const ans = await inquirer.prompt({
    type: 'input',
    name: 'apiKey',
    message: 'Input your api-key (start with "sk-"):',
  });

  updateConfig({ apiKey: ans.apiKey });
  return ans;
}

let _proxy = '';

async function getApiKey(): Promise<string> {
  const _config = getConfig();
  if (!_config.apiKey) {
    await inputKey();
    return getApiKey();
  }
  _proxy = _config.proxy ?? 'socks://127.0.0.1:13659';

  return _config.apiKey;
}

async function makeRequest(config?: AxiosRequestConfig) {
  const apiKey = await getApiKey();

  const torProxyAgent =
    _proxy === 'off' ? undefined : new SocksProxyAgent(_proxy);

  const request = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    httpAgent: torProxyAgent,
    httpsAgent: torProxyAgent,
    ...config,
  });
  request.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      return Promise.reject(error);
    }
  );

  return request;
}

export async function chat(message: string) {
  const request = await makeRequest();
  const stopSpinner = startSpinner('requesting');
  return request
    .post<IChatResponse>('/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })
    .catch((e) => {
      console.log('failed to request, retry after setting proxy');
      return null;
    })
    .finally(stopSpinner);
}
