# ChatGPT-CLI

visit ChatGPT via cli and proxy

```bash
chat-cli <command>

Commands:
  chat-cli prompt <message>  - ask chatGPT something.(ensure AliLang VPN is on)
  chat-cli proxy <url>       - set proxy url or turn off]
                             [useage] proxy (socks://xxxx:yyy | on | off)

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

## Install

```sh
npm i -g chatgpt-proxy-cli
```

## Usage

```sh
chat-cli prompt "tell me a secret"
```
