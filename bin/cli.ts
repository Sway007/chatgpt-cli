#! /usr/bin/env ts-node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Chat, Proxy } from '../src/command';

yargs(hideBin(process.argv))
  .command(Chat)
  .command(Proxy)
  .demandCommand()
  .showHelpOnFail(true)
  .strict().argv;
