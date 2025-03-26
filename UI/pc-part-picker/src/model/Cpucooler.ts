import { ManufacturerType } from "./ManufacturerType";
import { PcPart } from "./Pcpart";

export interface Cpucooler extends PcPart{
    rpm: number | null;
    noiseLevel: number | null;
    color: string | null;
    size: number | null;
    manufacturerTypeId: number | null;
    manufacturerType: string | null;
}