import { request } from './messages';
import type { TrackedPayload } from './public-types';

export function isTrackedPayload<PayloadType>(incoming: any): incoming is TrackedPayload<PayloadType> {
  if (typeof incoming === 'object' && incoming !== null && 'type' in incoming && 'id' in incoming) {
    return incoming.type === request;
  };
  return false;
}
