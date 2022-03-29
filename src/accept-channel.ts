import type { RequestHandler, TrackedPayload } from './public-types';
import { syn, ack, fin } from './messages';

interface WritableMessageEvent<PayloadType> extends MessageEvent<PayloadType> {
  data: PayloadType;
}

export function acceptChannel<RequestPayload, ResponsePayload>(handler: RequestHandler<RequestPayload, ResponsePayload>) {
  let port: MessagePort | undefined = undefined;

  async function routeRequest(event: MessageEvent<TrackedPayload<RequestPayload>>) {
    const { id, payload } = event.data;

    const unwrappedEvent: WritableMessageEvent<RequestPayload> = event as unknown as MessageEvent<RequestPayload>;
    unwrappedEvent.data = payload;
    const response = await handler(unwrappedEvent);

    const trackedPayload = { id, payload: response };
    port?.postMessage(trackedPayload);
  }

  function interceptFinRequest(event: MessageEvent<unknown>) {
    if (event.data === fin) {
      if (port !== undefined) {
        port.onmessage = null;
        port = undefined;
      }
      self.removeEventListener('message', interceptFinRequest);
    }
  }

  function interceptSynRequest(event: MessageEvent<unknown>) {
    if (event.data === syn && event.ports.length === 1) {
      port = event.ports[0];

      port.onmessage = routeRequest;
      self.removeEventListener('message', interceptSynRequest);

      port.postMessage(ack);
    }
  }

  self.addEventListener('message', interceptSynRequest);
  self.addEventListener('message', interceptFinRequest);
}
