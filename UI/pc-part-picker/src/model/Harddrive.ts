import { HarddriveType } from "./HarddriveType";
import { ManufacturerType } from "./ManufacturerType";
import { PcPart } from "./Pcpart";

export interface Harddrive extends PcPart {
    capacity: number | null;
    pricePerGb: number | null;
    type: string | null;
    cache: number | null;
    interface: string | null;
    manufacturerTypeId: number | null;
    driveTypeId: number | null;
    driveType: string | null;
    manufacturerType: string | null;
}