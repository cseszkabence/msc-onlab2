import { Videocard } from "./Videocard";

export interface ChipsetType {
    chipsetTypeId: number;
    type: string | null;
    videocards: Videocard[];
}