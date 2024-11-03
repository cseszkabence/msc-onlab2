import { ManufacturerType } from "./ManufacturerType";
import { MemoryType } from "./MemoryType";

export interface Memory {
    memoryid: number;
    name: string | null;
    price: number | null;
    speed: number | null;
    modules: string | null;
    pricePerGb: number | null;
    color: string | null;
    firstWordLatency: number | null;
    casLatency: number | null;
    manufacturerTypeId: number | null;
    type: number | null;
    manufacturerType: string | null;
    typeNavigation: string | null;
}