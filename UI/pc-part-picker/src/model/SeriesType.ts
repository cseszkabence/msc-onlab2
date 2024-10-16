import { Processor } from "./Processor";
import { Videocard } from "./Videocard";

export interface SeriesType {
    seriesTypeId: number;
    type: string | null;
    processors: Processor[];
    videocards: Videocard[];
}