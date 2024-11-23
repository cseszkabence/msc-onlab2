import { Cpucooler } from "./Cpucooler";
import { Harddrive } from "./Harddrive";
import { Memory } from "./Memory";
import { Motherboard } from "./Motherboard";
import { Pccase } from "./Pccase";
import { Powersupply } from "./Powersupply";
import { Processor } from "./Processor";
import { Videocard } from "./Videocard";

export type pcpart = Processor | Cpucooler | Motherboard | Memory | Harddrive | Pccase | Videocard | Powersupply;
