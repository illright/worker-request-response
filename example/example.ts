import { createChannel, type ChannelController } from '../src';
import type { RequestPayload, ResponsePayload } from './protocol';

let sendRequest: ChannelController<RequestPayload, ResponsePayload>['sendRequest'];
let tearDown: ChannelController<RequestPayload, ResponsePayload>['tearDown'];

export async function onMount() {
  if (navigator.serviceWorker.controller === null) {
    return;
  }

  ({ sendRequest, tearDown } = await createChannel<RequestPayload, ResponsePayload>(
    navigator.serviceWorker.controller
  ));

  return tearDown;
}

export async function sendRequestToServiceWorker() {
  if (sendRequest !== null) {
    const response = await sendRequest(42);
    console.log(response.data, 'is "42"');
  }
}
