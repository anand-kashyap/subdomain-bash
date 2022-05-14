import { SequenceCustomEvent } from '../constants';

type BashCommand = {
  bashCommand?: string;
  customEvent?: SequenceCustomEvent;
  message: string;
  isSudo?: boolean;
};

export { BashCommand };
