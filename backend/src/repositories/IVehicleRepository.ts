export interface VehicleRecord { id: string; make: string; model: string; category: string; priceCents: number; quantity: number; createdAt: Date; updatedAt: Date; }
export interface CreateVehicleRecord { make: string; model: string; category: string; priceCents: number; quantity: number; }
export interface VehiclePage { data: VehicleRecord[]; total: number; }
export interface IVehicleRepository { create(data: CreateVehicleRecord): Promise<VehicleRecord>; list(page: number, limit: number): Promise<VehiclePage>; }
