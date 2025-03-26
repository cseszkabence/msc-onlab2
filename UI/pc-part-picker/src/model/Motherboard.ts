import { FormfactorType } from "./FormfactorType";
import { ManufacturerType } from "./ManufacturerType";
import { MemoryType } from "./MemoryType";
import { PcPart } from "./Pcpart";
import { SocketType } from "./SocketType";

export interface Motherboard extends PcPart{
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