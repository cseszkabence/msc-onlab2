import { HarddriveType } from "./HarddriveType";
import { ManufacturerType } from "./ManufacturerType";

export interface Harddrive {
    harddriveid: number;
    name: string | null;
    price: number | null;
    capacity: number | null;
    pricePerGb: number | null;
    type: string | null;
    cache: number | null;
    interface: string | null;
    manufacturerTypeId: number | null;
    driveTypeId: number | null;
    driveType: HarddriveType | null;
    manufacturerType: ManufacturerType | null;
}