import { ChipsetType } from "./ChipsetType";
import { ManufacturerType } from "./ManufacturerType";
import { SeriesType } from "./SeriesType";

export interface Videocard {
    videocardid: number;
    name: string | null;
    price: number | null;
    chipset: string | null;
    memory: number | null;
    coreClock: number | null;
    boostClock: number | null;
    color: string | null;
    length: number | null;
    manufacturerTypeId: number | null;
    chipsetTypeId: number | null;
    seriesTypeId: number | null;
    chipsetType: string | null;
    manufacturerType: string | null;
    seriesType: string | null;
}