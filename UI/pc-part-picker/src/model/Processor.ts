import { ManufacturerType } from "./ManufacturerType";
import { SeriesType } from "./SeriesType";
import { SocketType } from "./SocketType";

export interface Processor {
    processorid: number;
    name: string | null;
    price: number | null;
    socketTypeId: number | null;
    coreCount: number | null;
    coreClock: number | null;
    boostClock: number | null;
    tdp: number | null;
    graphics: string | null;
    smt: boolean | null;
    manufacturerTypeId: number | null;
    seriesTypeId: number | null;
    manufacturerType: ManufacturerType | null;
    seriesType: SeriesType | null;
    socketType: SocketType | null;
}