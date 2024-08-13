export default {
  routes: [
    {
      method: "POST",
      path: "/checkout",
      handler: "checkout.checkout",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
