export interface VehicleRecord { id: string; make: string; model: string; category: string; priceCents: number; quantity: number; createdAt: Date; updatedAt: Date; }
export interface CreateVehicleRecord { make: string; model: string; category: string; priceCents: number; quantity: number; }
export type UpdateVehicleRecord = Partial<CreateVehicleRecord>;
export interface VehiclePage { data: VehicleRecord[]; total: number; }
export interface VehicleSearchCriteria { make?: string; model?: string; category?: string; minPrice?: number; maxPrice?: number; page: number; limit: number; }
export interface IVehicleRepository { create(data: CreateVehicleRecord): Promise<VehicleRecord>; list(page: number, limit: number): Promise<VehiclePage>; search(criteria: VehicleSearchCriteria): Promise<VehiclePage>; findById(id: string): Promise<VehicleRecord | null>; update(id: string, data: UpdateVehicleRecord): Promise<VehicleRecord>; }
