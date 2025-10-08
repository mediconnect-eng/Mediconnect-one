import type { AuditPort } from "@shared/ports";

export class AuditStub implements AuditPort {
  private logs: any[] = [];

  async log(event: string, actor: string, resource: string, meta?: any): Promise<void> {
    const logEntry = {
      event,
      actor,
      resource,
      meta,
      timestamp: new Date().toISOString()
    };
    this.logs.push(logEntry);
    console.log(`[AuditStub] Log:`, logEntry);
  }

  getLogs(): any[] {
    return this.logs;
  }
}
