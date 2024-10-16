import { Harddrive } from "./Harddrive";

export interface HarddriveType {
    harddirveTypeId: number;
    type: string | null;
    harddrives: Harddrive[];
}