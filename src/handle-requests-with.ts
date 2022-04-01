import { isTrackedPayload } from './is-tracked-payload.js';
import { request } from './messages.js';
import type { RequestHandler, TrackedPayload } from './public-types.js';

/** Create an event listener that watches requests made by this library for this library. */
export function handleRequestsWith<RequestPayload, ResponsePayload>(
  handler: RequestHandler<RequestPayload, ResponsePayload>
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

  return filterOutRequests;
}
