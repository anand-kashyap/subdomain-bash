import { exec } from 'child_process';
import { Socket } from 'socket.io';
import { promisify } from 'util';
import { NetlifyAPI } from '.';
import { logger } from '../config/logger';
import { CustomEvents, SequenceCustomEvent } from '../constants';
import { BashCommand, ProgressSocketEventPayload } from '../types';
import { cmdArr as commandArr } from './bashScripts';

export const execPromise = promisify(exec);

class SubdomainCreationProgress {
  private devCount = 1;
  constructor(private socket: Socket) {}

  private emitProgress({ percent, msg }: ProgressSocketEventPayload) {
    console.log('emitProgress call', { percent, msg });
    this.socket.emit(CustomEvents.PROGRESS, {
      percent,
      msg,
    });
  }

  async execBashCommand(command: BashCommand, percent: number) {
    const { bashCommand, message, isSudo = false } = command;
    if (!bashCommand) {
      throw new Error('bash cmd not passed');
    }
    console.log(message + ' started');
    if (process.env.dev) {
      return setTimeout(() => {
        this.emitProgress({
          percent,
          msg: message,
        });
      }, 1000 * this.devCount);
    }
    this.emitProgress({
      percent,
      msg: message,
    });
    try {
      const dat = await execPromise(isSudo ? `sudo sh -c "${bashCommand}"` : bashCommand, {
        shell: 'bash',
        cwd: process.env.WEB_DIR,
      });
      logger.info('data', dat);
      return dat.toString();
      // todo - send error to socket
    } catch (error) {
      logger.error(error);
      this.emitProgress({
        percent,
        msg: JSON.stringify(error),
      });
    }
  }

  async seqExecBashCommands(netlifyClient?: NetlifyAPI) {
    const totalCommands = commandArr.length;
    if (process.env.dev) {
      this.devCount = 1;
    }
    for (let index = 0; index < commandArr.length; index++) {
      const command = commandArr[index],
        position = index + 1;

      console.log({ totalCommands, position });
      const percent = (position / totalCommands) * 100; // progress percentage
      if (command?.customEvent === SequenceCustomEvent.ADD_DNS_RECORD) {
        await netlifyClient?.addDNSRecord();
        continue;
      }
      await this.execBashCommand(command, +percent.toFixed(2));
      if (process.env.dev) {
        ++this.devCount;
      }
    }
  }
}

const subdomainCreator = (socket: Socket) => new SubdomainCreationProgress(socket);

export { subdomainCreator };
