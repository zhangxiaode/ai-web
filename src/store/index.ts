import type { StoreDefinition } from 'pinia';
export const baseStore = (import.meta.glob('./base.ts', { eager: true })['./base.ts'] as { default: StoreDefinition }).default;