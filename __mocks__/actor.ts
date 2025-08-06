const actor = {
    items: {
      update: jest.fn().mockResolvedValue([]),
      find: jest.fn().mockReturnValue({
        id: "itemId",
        system: { uses: { max: 1, value: 0 }, recharge: { charged: false } }
      })
    },
    // Add any other properties/methods your tests need
  };
  
  module.exports = actor;
  // or, if using ES modules:
  // export default actor;