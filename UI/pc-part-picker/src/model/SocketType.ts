import { Motherboard } from "./Motherboard";
import { Processor } from "./Processor";

export interface SocketType {
    socketId: number;
    type: string | null;
    motherboards: Motherboard[];
    processors: Processor[];
}