import { Cpucooler } from "./Cpucooler";
import { Harddrive } from "./Harddrive";
import { Memory } from "./Memory";
import { Motherboard } from "./Motherboard";
import { Pccase } from "./Pccase";
import { Powersupply } from "./Powersupply";
import { Processor } from "./Processor";
import { Videocard } from "./Videocard";

export interface ManufacturerType {
    manufacturerTypeId: number;
    type: string | null;
    cpucoolers: Cpucooler[];
    harddrives: Harddrive[];
    memories: Memory[];
    motherboards: Motherboard[];
    pccases: Pccase[];
    powersupplies: Powersupply[];
    processors: Processor[];
    videocards: Videocard[];
}