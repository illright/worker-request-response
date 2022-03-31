import { isTrackedPayload } from './is-tracked-payload';
import { request } from './messages';
import type { RequestHandler, TrackedPayload, MessageEventProducer } from './public-types';

export function listenToRequests<RequestPayload, ResponsePayload>(
  handler: RequestHandler<RequestPayload, ResponsePayload>,
  client: MessageEventProducer,
) {
  async function filterOutRequests(event: MessageEvent<unknown>) {
    if (isTrackedPayload<RequestPayload>(event.data) && event.ports.length === 1) {
      const { id, payload } = event.data;

      const fakeEvent = Object.create(event);
      Object.defineProperty(fakeEvent, 'data', { get: () => payload });
      const response = await handler(fakeEvent);
      const trackedPayload: TrackedPayload<Awaited<ResponsePayload>> = { id, type: request, payload: response };

      event.ports[0].postMessage(trackedPayload);
    }
  }

  client.addEventListener('message', filterOutRequests);
}
