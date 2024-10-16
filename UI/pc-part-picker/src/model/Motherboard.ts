import { FormfactorType } from "./FormfactorType";
import { ManufacturerType } from "./ManufacturerType";
import { MemoryType } from "./MemoryType";
import { SocketType } from "./SocketType";

export interface Motherboard {
    motherboardid: number;
    name: string | null;
    price: number | null;
    socket: string | null;
    formFactor: string | null;
    maxMemory: number | null;
    memorySlots: number | null;
    color: string | null;
    manufacturerTypeId: number | null;
    socketTypeId: number | null;
    memoryTypeId: number | null;
    formFactoryTypeId: number | null;
    formFactoryType: FormfactorType | null;
    manufacturerType: ManufacturerType | null;
    memoryType: MemoryType | null;
    socketType: SocketType | null;
}