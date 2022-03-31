import { listenToRequests } from '../src';
import type { RequestPayload, ResponsePayload } from './protocol';

async function processRequest(
  event: MessageEvent<RequestPayload>
): Promise<ResponsePayload> {
  return event.data.toString();
}

listenToRequests(processRequest, self);
