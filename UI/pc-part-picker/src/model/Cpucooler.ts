import { ManufacturerType } from "./ManufacturerType";

export interface Cpucooler {
    cpucoolerid: number;
    name: string | null;
    price: number | null;
    rpm: number | null;
    noiseLevel: number | null;
    color: string | null;
    size: number | null;
    manufacturerTypeId: number | null;
    manufacturerType: ManufacturerType | null;
}