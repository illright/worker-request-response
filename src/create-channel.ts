import { catchResponse } from './catch-response';
import { trackPromise } from './promise-registry';
import { syn, ack, fin } from './messages';
import type { ChannelController } from './public-types';
import type { Client } from './lib.webworker';

export function createChannel<RequestPayload, ResponsePayload>(client: Client) {
  const messageChannel = new MessageChannel();

  function sendRequest(payload: RequestPayload) {
    return new Promise<MessageEvent<ResponsePayload>>((resolve) => {
      const trackedPayload = {
        id: trackPromise(resolve),
        payload,
      };

      messageChannel.port1.postMessage(trackedPayload);
    });
  }

  function tearDown() {
    client.postMessage(fin);
    messageChannel.port2.onmessage = null;
  }

  return new Promise<ChannelController<RequestPayload, ResponsePayload>>((resolve) => {
    function awaitAck(event: MessageEvent<unknown>) {
      if (event.data === ack) {
        messageChannel.port1.onmessage = catchResponse;
        resolve({ sendRequest, tearDown });
      }
    }

    // For some reason, `addEventListener` doesn't work with the `MessageChannel`
    messageChannel.port1.onmessage = awaitAck;
    client.postMessage(syn, [messageChannel.port2]);
  });
}
