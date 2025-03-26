import { PcPart } from './Pcpart';
import { ManufacturerType } from "./ManufacturerType";
import { SeriesType } from "./SeriesType";
import { SocketType } from "./SocketType";

export interface Processor extends PcPart {
    socketTypeId: number | null;
    coreCount: number | null;
    coreClock: number | null;
    boostClock: number | null;
    tdp: number | null;
    graphics: string | null;
    smt: boolean | null;
    manufacturerTypeId: number | null;
    seriesTypeId: number | null;
    manufacturerType: string | null;
    seriesType: string | null;
    socketType: string | null;
}