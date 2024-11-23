import { FormfactorType } from "./FormfactorType";
import { ManufacturerType } from "./ManufacturerType";

export interface Pccase {
    type_name: 'Pccase';
    pccaseid: number;
    name: string | null;
    price: number | null;
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