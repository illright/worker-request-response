export interface TrackedPayload<OriginalPayloadType> {
  id: number;
  payload: OriginalPayloadType;
}
