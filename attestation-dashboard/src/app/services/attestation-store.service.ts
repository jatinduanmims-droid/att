import { Injectable, signal } from '@angular/core';
import { AttestationRecord } from '../models/attestation-record';

@Injectable({ providedIn: 'root' })
export class AttestationStoreService {
  private readonly key = 'attestation-records';
  private readonly recordsState = signal<AttestationRecord[]>(this.readRecords());

  readonly records = this.recordsState.asReadonly();

  add(record: AttestationRecord): void {
    const records = [record, ...this.recordsState()];
    this.recordsState.set(records);
    localStorage.setItem(this.key, JSON.stringify(records));
  }

  delete(id: string): void {
    const records = this.recordsState().filter((record) => record.id !== id);
    this.recordsState.set(records);
    localStorage.setItem(this.key, JSON.stringify(records));
  }

  private readRecords(): AttestationRecord[] {
    const value = localStorage.getItem(this.key);
    if (!value) {
      return [];
    }

    try {
      return JSON.parse(value) as AttestationRecord[];
    } catch {
      localStorage.removeItem(this.key);
      return [];
    }
  }
}
