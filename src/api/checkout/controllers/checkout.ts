/**
 * A set of functions called "actions" for `checkout`
 */

export default {
  checkout: async (ctx, next) => {
    try {
      const input = ctx.request.body.data;
      input.user = ctx.state.user.id;
      const orderItems = await Promise.all(
        input.order_items.map((item) =>
          strapi
            .service("api::checkout.checkout")
            .createOrderItem(item.product, item.count)
        )
      );
      const data = await strapi
        .service("api::checkout.checkout")
        .createOrder(input, orderItems);
      ctx.body = data;
    } catch (err) {
      ctx.status = 422;
      ctx.body = err;
    }
  },
};
