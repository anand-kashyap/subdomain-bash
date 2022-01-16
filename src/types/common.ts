import { SequenceCustomEvent } from '../constants';

type BashCommand = {
  bashCommand?: string;
  customEvent?: SequenceCustomEvent;
  message: string;
};

export { BashCommand };
