import { routeResponse } from '../src';
import type { RequestPayload, ResponsePayload } from './protocol';

async function processRequest(
  event: MessageEvent<RequestPayload>
): Promise<ResponsePayload> {
  return event.data.toString();
}

addEventListener('message', routeResponse(processRequest));
