import { FormfactorType } from "./FormfactorType";
import { ManufacturerType } from "./ManufacturerType";
import { PcPart } from "./Pcpart";

export interface Pccase extends PcPart{
    formFactor: string | null;
    color: string | null;
    sidePanel: string | null;
    externalVolume: number | null;
    internal35Bays: number | null;
    formFactorTypeId: number | null;
    manufacturerTypeId: number | null;
    formFactorType: string | null;
    manufacturerType: string | null;
}