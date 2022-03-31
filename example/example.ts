import { sendRequest } from '../src';
import type { RequestPayload, ResponsePayload } from './protocol';

export async function sendRequestToServiceWorker() {
  const response = await sendRequest<RequestPayload, ResponsePayload>(navigator.serviceWorker.controller, 42);
  console.log(response, 'is "42"');
}
