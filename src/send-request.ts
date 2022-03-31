import { stamp, resolveByID } from './promise-registry';
import { isTrackedPayload } from './is-tracked-payload';
import type { Client } from './lib.webworker';

function catchResponse<ResponsePayloadType>(event: MessageEvent<unknown>) {
  if (isTrackedPayload<ResponsePayloadType>(event.data)) {
    resolveByID(event.data.id, event.data.payload);
  }
}

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
