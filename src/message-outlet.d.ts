import type { TrackedPayload } from './tracked-payload';

export type MessageOutlet<MessageType> = {
  postMessage: (payload: TrackedPayload<MessageType>) => void;
} | ((payload: TrackedPayload<MessageType>) => void);
