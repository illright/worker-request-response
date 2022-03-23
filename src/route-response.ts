import type { TrackedPayload } from './tracked-payload';
import type { MessageOutlet } from './message-outlet';

export type RequestHandler<RequestType, ResponseType> = (event: MessageEvent<RequestType>) => ResponseType;

export function routeResponse<RequestType, ResponseType>(handler: RequestHandler<RequestType, ResponseType>, outlet: MessageOutlet<ResponseType> = postMessage) {
  return async function (event: MessageEvent<TrackedPayload<RequestType>>) {
    const { id, payload } = event.data;
    const unwrappedEvent = new MessageEvent(
      event.type,
      {
        data: payload,
        origin: event.origin,
        lastEventId: event.lastEventId,
        source: event.source,
        ports: event.ports,
      } as MessageEventInit<RequestType>
    );
    const response = await handler(unwrappedEvent);
    const trackedPayload = { id, payload: response };

    if ('postMessage' in outlet) {
      outlet.postMessage(trackedPayload);
    } else {
      outlet(trackedPayload);
    }
  }
}
