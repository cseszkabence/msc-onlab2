import { FormfactorType } from "./FormfactorType";
import { ManufacturerType } from "./ManufacturerType";

export interface Powersupply {
    powersupplyid: number;
    name: string | null;
    price: number | null;
    type: string | null;
    efficiency: string | null;
    wattage: number | null;
    modular: string | null;
    color: string | null;
    manufacturerTypeId: number | null;
    formFactorId: number | null;
    formFactor: FormfactorType | null;
    manufacturerType: ManufacturerType | null;
}