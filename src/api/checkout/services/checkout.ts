/**
 * checkout service
 */

export default () => ({
  createOrderItem: async (productId: number, count: number) => {
    const targetProduct = (await strapi.entityService.findOne(
      "api::product.product",
      productId,
      {
        fields: ["id", "price", "count"],
      }
    )) as { id: number; price: number; count: number };

    if (!targetProduct) {
      throw {
        message: `Product #${productId} not found`,
      };
    }
    if (count > targetProduct.count) {
      throw {
        message: `No enough stock for product #${productId}`,
      };
    }

    const orderItem = await strapi.entityService.create(
      "api::order-item.order-item",
      {
        data: {
          unit_price: targetProduct.price,
          count: count,
          product: productId,
        },
      }
    );

    await strapi.entityService.update("api::product.product", productId, {
      data: {
        count: targetProduct.count - count,
      },
    });

    return orderItem;
  },
  createOrder: async (
    data: any,
    orderItems: { id: number; unit_price: number; count: number }[]
  ) => {
    const total = orderItems.reduce((acc, item) => {
      return acc + item.unit_price * item.count;
    }, 0);

    return await strapi.entityService.create("api::order.order", {
      data: {
        ...data,
        total_price: total,
        order_items: orderItems.map((item) => item.id),
      } as any,
      populate: ["order_items.product"],
    });
  },
});
