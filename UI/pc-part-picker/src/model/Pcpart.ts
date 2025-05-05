import { Cpucooler } from "./Cpucooler";
import { Harddrive } from "./Harddrive";
import { Memory } from "./Memory";
import { Motherboard } from "./Motherboard";
import { Pccase } from "./Pccase";
import { Powersupply } from "./Powersupply";
import { Processor } from "./Processor";
import { Videocard } from "./Videocard";

export interface PcPart{
    id: number,
    type_name: string,
    name: string | null;
    price: number | null;
    [key: string]: any;  // 👈 This enables dynamic property access
};