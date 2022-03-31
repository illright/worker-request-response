/** The Client interface represents an executable context such as a Worker, or a SharedWorker. Window clients are represented by the more-specific WindowClient. You can get Client/WindowClient objects from methods such as Clients.matchAll() and Clients.get(). */
export interface Client {
  postMessage(message: any, transfer: Transferable[]): void;
}
