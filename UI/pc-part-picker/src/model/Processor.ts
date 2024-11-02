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
    manufacturerType: string | null;
    seriesType: SeriesType | null;
    socketType: SocketType | null;
}
export function getManufacturers(processors: Processor[]): { name: string; checked: boolean }[] {
  const manufacturers = new Set<string>();

  processors.forEach((processor) => {
    manufacturers.add(processor.manufacturerType!);
  });

  // Convert each manufacturer into an object with 'name' and 'checked' properties
  return Array.from(manufacturers).map((manufacturer) => ({
    name: manufacturer,
    checked: false,
  }));
}