export type ResolutionFunction<ResolvedValueType> = (value: ResolvedValueType) => void;

const registry = new Map<number, ResolutionFunction<unknown>>();
let idCounter = 0;

/** Exchange a promise resolution for a numeric ID that can be passed through the worker. */
export function trackPromise<ResolvedValueType>(
  resolution: ResolutionFunction<ResolvedValueType>
): number {
  registry.set(idCounter, resolution as ResolutionFunction<unknown>);
  return idCounter++;
}

/** Resolve a previously tracked promise by ID with the given object. */
export function resolveByID<ResolvedValueType>(id: number, resolvedValue: ResolvedValueType): void {
  const resolve = registry.get(id);
  if (resolve !== undefined) {
    resolve(resolvedValue);
    registry.delete(id);
  }
}
