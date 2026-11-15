export interface OrderItemDTO {
  productId: string;
  name: string;
  quantity: number;
  unitMad: number;
}

export interface CreateOrderDTO {
  cafeId: string;
  userId: string;
  items: OrderItemDTO[];
}

/**
 * Microservice: Commerce & Catalog Service
 * Manages Cafe Menus, Catalog items, and Order Creation.
 */
export class CommerceService {
  static calculateTotal(items: OrderItemDTO[]) {
    return items.reduce((sum, it) => sum + it.unitMad * it.quantity, 0);
  }

  static createOrderPayload(dto: CreateOrderDTO) {
    const totalMad = this.calculateTotal(dto.items);
    return {
      id: `CMD-${Date.now().toString().slice(-6)}`,
      cafeId: dto.cafeId,
      userId: dto.userId,
      items: dto.items,
      totalMad,
      status: "NEW" as const,
      createdAt: new Date().toISOString(),
    };
  }
}
