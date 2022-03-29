export interface TrackedPayload<OriginalPayloadType> {
  id: number;
  payload: OriginalPayloadType;
}

export type ResolutionFunction<ResolvedValueType> = (value: ResolvedValueType) => void;

export type RequestHandler<RequestType, ResponseType> = (event: MessageEvent<RequestType>) => ResponseType;
