// configuration-slots.ts
export const SLOT_KEYS = [
  'processor',
  'motherboard',
  'videocard',
  'memory',
  'harddrive',
  'pccase',
  'powersupply',
  'cpucooler'
] as const;

export type SlotKey = typeof SLOT_KEYS[number];
