import { handleRequestsWith } from '../src';
import type { RequestPayload, ResponsePayload } from './protocol';

async function processRequest(
  event: MessageEvent<RequestPayload>
): Promise<ResponsePayload> {
  return event.data.toString();
}

self.addEventListener('message', handleRequestsWith(processRequest));
