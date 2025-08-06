const surgeRollTable = {
    draw: jest.fn().mockResolvedValue({
      roll: { total: 1 }, // mock Roll object, add properties as needed
      results: [{ text: "Result Text" }] // mock TableResult array
    }),
    name: "Wild Magic Surge"
  };
  
  module.exports = surgeRollTable;
  // or, if using ES modules:
  // export default surgeRollTable;