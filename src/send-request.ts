import { stamp, resolveByID } from './promise-registry';
import { isTrackedPayload } from './is-tracked-payload';
import type { Client } from './lib.webworker';

function catchResponse<ResponsePayloadType>(event: MessageEvent<unknown>) {
  if (isTrackedPayload<ResponsePayloadType>(event.data)) {
    resolveByID(event.data.id, event.data.payload);
  }
}

/**
 * Send a request to a worker and await its response.
 *
 * The worker can be any client that supports `postMessage` and the Channel Messaging API.
 * That includes service workers and web workers.
 */
export async function sendRequest<RequestPayloadType, ResponsePayloadType>(
  client: Client,
  payload: RequestPayloadType,
) {
  const messageChannel = new MessageChannel();

  return new Promise<ResponsePayloadType>((resolve) => {
    // For some reason, `addEventListener` doesn't work with the `MessageChannel`
    messageChannel.port1.onmessage = catchResponse;
    client.postMessage(stamp(payload, resolve), [messageChannel.port2]);
  });
}
