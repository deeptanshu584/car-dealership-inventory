export interface VehicleRecord { id: string; make: string; model: string; category: string; priceCents: number; quantity: number; createdAt: Date; updatedAt: Date; }
export interface CreateVehicleRecord { make: string; model: string; category: string; priceCents: number; quantity: number; }
export interface IVehicleRepository { create(data: CreateVehicleRecord): Promise<VehicleRecord>; }
