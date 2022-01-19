import { exec } from 'child_process';
import { Socket } from 'socket.io';
import { promisify } from 'util';
import { NetlifyAPI } from '.';
import { CustomEvents, SequenceCustomEvent } from '../constants';
import { BashCommand, ProgressSocketEventPayload } from '../types';
import { cmdArr as commandArr } from './bashScripts';

const execPromise = promisify(exec);

class SubdomainCreationProgress {
  constructor(private socket: Socket) {}

  private emitProgress({ percent, msg }: ProgressSocketEventPayload) {
    console.log('emitProgress call', { percent, msg });
    this.socket.emit(CustomEvents.PROGRESS, {
      percent,
      msg,
    });
  }

  async execBashCommand(command: BashCommand, percent: number) {
    const { bashCommand, message } = command;
    if (!bashCommand) {
      throw new Error('bash cmd not passed');
    }
    // todo - send started to socket
    console.log(message + ' started');
    this.emitProgress({
      percent,
      msg: message,
    });
    if (process.env.dev) {
      return message;
    }
    const dat = await execPromise(bashCommand, { shell: 'true' });
    // todo - send error to socket
    return dat.toString();
  }

  async seqExecBashCommands(netlifyClient?: NetlifyAPI) {
    const totalCommands = commandArr.length + 2;

    for (let index = 0; index < commandArr.length; index++) {
      const command = commandArr[index],
        position = index + 1;

      console.log({ totalCommands, position });
      const percent = (position / totalCommands) * 100; // progress percentage
      if (command?.customEvent === SequenceCustomEvent.ADD_DNS_RECORD) {
        await netlifyClient?.addDNSRecord();
        continue;
      }
      await this.execBashCommand(command, percent);
    }
  }
}

const subdomainCreator = (socket: Socket) =>
  new SubdomainCreationProgress(socket);

export { subdomainCreator };
