import type { ResolutionFunction, TrackedPayload } from './public-types';
import { request } from './messages';

const registry = new Map<number, ResolutionFunction<unknown>>();
let idCounter = 0;

/** Exchange a promise resolution for a numeric ID that can be passed through the worker. */
function trackPromise<ResolvedValueType>(
  resolution: ResolutionFunction<ResolvedValueType>
): number {
  registry.set(idCounter, resolution as ResolutionFunction<unknown>);
  return idCounter++;
}

/** Attach a numeric ID to a payload that will later allow to retrieve the resolution function. */
export function stamp<PayloadType, ResolvedValueType>(
  payload: PayloadType,
  resolution: ResolutionFunction<ResolvedValueType>
): TrackedPayload<PayloadType> {
  return {
    id: trackPromise(resolution),
    type: request,
    payload,
  } as const;
}

/** Resolve a previously tracked promise by ID with the given object. */
export function resolveByID<ResolvedValueType>(id: number, resolvedValue: ResolvedValueType): void {
  const resolve = registry.get(id);
  if (resolve !== undefined) {
    resolve(resolvedValue);
    registry.delete(id);
  }
}
