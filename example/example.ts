import { sendRequest } from '../src';
import type { RequestPayload, ResponsePayload } from './protocol';

export async function sendRequestToServiceWorker() {
  const response = await sendRequest<RequestPayload, ResponsePayload>(42);
  console.log(response.data, 'is "42"');
}
