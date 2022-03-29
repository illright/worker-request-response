import { resolveByID } from './promise-registry';
import type { TrackedPayload } from './public-types';

export function catchResponse(event: MessageEvent<TrackedPayload<ResponseType>>) {
  resolveByID(event.data.id, event.data.payload);
}
