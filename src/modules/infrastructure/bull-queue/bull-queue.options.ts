import Bull from 'bull';
import { envVariables } from '../config/env-config';

export const queueOption: Bull.JobOptions = {
  backoff: {
    type: 'exponential',
    delay: envVariables.BULL_QUEUE_BACKOFF_DELAY_TIME,
  },
  attempts: envVariables.BULL_QUEUE_FAILURE_RETRY_ATTEMPTS,
  removeOnComplete: true,
  removeOnFail: true,
  delay: 1000,
};

export const OCR_QUEUE = 'OCR_QUEUE';
export const TRANSLATION_QUEUE = 'TRANSLATION_QUEUE';
export const INTERPRETATION_QUEUE = 'INTERPRETATION_QUEUE';
export const TAGGING_QUEUE = 'TAGGING_QUEUE';
