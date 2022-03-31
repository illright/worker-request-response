import type { request } from './messages';

export interface TrackedPayload<OriginalPayloadType> {
  id: number;
  type: typeof request;
  payload: OriginalPayloadType;
}

export type ResolutionFunction<ResolvedValueType> = (value: ResolvedValueType) => void;

export type RequestHandler<RequestType, ResponseType> = (event: MessageEvent<RequestType>) => ResponseType;

export interface ChannelController<RequestPayload, ResponsePayload> {
  sendRequest(payload: RequestPayload): Promise<MessageEvent<ResponsePayload>>;
  tearDown(): void;
}
