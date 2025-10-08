import type { StoragePort } from "@shared/ports";

export class StorageLocalStub implements StoragePort {
  private storage = new Map<string, any>();

  async put(file: any): Promise<string> {
    const url = `local://file-${Date.now()}`;
    this.storage.set(url, file);
    console.log(`[StorageStub] File stored at: ${url}`);
    return url;
  }

  async get(url: string): Promise<any> {
    console.log(`[StorageStub] Retrieving file: ${url}`);
    return this.storage.get(url);
  }
}
