import { Cpucooler } from "./Cpucooler";
import { Harddrive } from "./Harddrive";
import { Memory } from "./Memory";
import { Motherboard } from "./Motherboard";
import { Pccase } from "./Pccase";
import { Powersupply } from "./Powersupply";
import { Processor } from "./Processor";
import { Videocard } from "./Videocard";

export interface Configuration {
    processor: Processor | undefined;
    motherboard: Motherboard| undefined;
    videocard: | undefined;
    memory: Memory| undefined;
    harddrive: Harddrive| undefined;
    pccase: | undefined;
    powersupply: Powersupply| undefined;
    cpucooler: Cpucooler| undefined;
}