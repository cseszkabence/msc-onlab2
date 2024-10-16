import { Memory } from "./Memory";
import { Motherboard } from "./Motherboard";

export interface MemoryType {
    memoryTypeId: number;
    type: string | null;
    memories: Memory[];
    motherboards: Motherboard[];
}