import { FormfactorType } from "./FormfactorType";
import { ManufacturerType } from "./ManufacturerType";
import { MemoryType } from "./MemoryType";
import { SocketType } from "./SocketType";

export interface Motherboard {
    type_name: 'Motherboard';
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
    formFactoryType: string | null;
    manufacturerType: string | null;
    memoryType: string | null;
    socketType: string | null;
}