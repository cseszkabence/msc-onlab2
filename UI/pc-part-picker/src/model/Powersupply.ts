import { FormfactorType } from "./FormfactorType";
import { ManufacturerType } from "./ManufacturerType";
import { PcPart } from "./Pcpart";

export interface Powersupply extends PcPart{
    type: string | null;
    efficiency: string | null;
    wattage: number | null;
    modular: string | null;
    color: string | null;
    manufacturerTypeId: number | null;
    formFactorId: number | null;
    formFactor: string | null;
    manufacturerType: string | null;
}