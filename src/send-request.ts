import { trackPromise } from './promise-registry';
import type { MessageOutlet } from './public-types';

export function sendRequest<RequestType, ResponseType>(
  request: RequestType,
  outlet: MessageOutlet<RequestType> = window,
) {
  return new Promise<MessageEvent<ResponseType>>((resolve) => {
    const trackedPayload = {
      id: trackPromise(resolve),
      payload: request,
    };

    if ('postMessage' in outlet) {
      outlet.postMessage(trackedPayload);
    } else {
      outlet(trackedPayload);
    }
  });
}
