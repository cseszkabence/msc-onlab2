import { ManufacturerType } from "./ManufacturerType";
import { MemoryType } from "./MemoryType";
import { PcPart } from "./Pcpart";

export interface Memory extends PcPart{
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