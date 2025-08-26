import { Cpucooler } from "./Cpucooler";
import { Harddrive } from "./Harddrive";
import { Memory } from "./Memory";
import { Motherboard } from "./Motherboard";
import { Pccase } from "./Pccase";
import { Powersupply } from "./Powersupply";
import { Processor } from "./Processor";
import { Videocard } from "./Videocard";

export interface Configuration {
    processor?: Processor ;
    motherboard?: Motherboard;
    videocard?: Videocard ;
    memory?: Memory;
    harddrive?: Harddrive;
    pccase?: Pccase ;
    powersupply?: Powersupply;
    cpucooler?: Cpucooler;

    [key: string]: Processor
                  | Motherboard
                  | Videocard
                  | Memory
                  | Powersupply
                  | Pccase
                  | Harddrive
                  | Cpucooler
                  | undefined;
}