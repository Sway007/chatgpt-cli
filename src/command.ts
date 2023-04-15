import { CommandModule } from 'yargs';
import { chat, updateConfig } from './utils';

export const Chat: CommandModule = {
  command: 'prompt <message>',
  describe: '- ask chatGPT something.(ensure AliLang VPN is on)',
  async handler(argv) {
    const message = argv.message as string;
    const response = await chat(message);

    if (!response) return;
    for (const item of response!.data.choices) {
      console.log('role: ', item.message.role);
      console.log(item.message.content);
    }
  },
};

export const Proxy: CommandModule = {
  command: 'proxy <url>',
  describe:
    '- set proxy url or turn off]\n  [useage] proxy (socks://xxxx:yyy | on | off)',
  async handler(argv) {
    let url = argv.url as string;
    url = url === 'on' ? '' : url;
    updateConfig({ proxy: url });
    console.log('ok');
  },
};
