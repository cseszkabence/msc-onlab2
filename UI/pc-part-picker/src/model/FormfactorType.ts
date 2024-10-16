import { Motherboard } from "./Motherboard";
import { Pccase } from "./Pccase";
import { Powersupply } from "./Powersupply";

export interface FormfactorType {
    formfactorId: number;
    type: string | null;
    motherboards: Motherboard[];
    pccases: Pccase[];
    powersupplies: Powersupply[];
}