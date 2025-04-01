const smsDispatcher = require("../utils/smsDispatcher");

describe("smsDispatcher - Test Mode", () => {
  it("should return success object in test mode", async () => {
    process.env.NODE_ENV = "test";

    const result = await smsDispatcher({
      type: "chat_reply",
      to: "+1234567890",
      data: { reply: "Hi there!" },
    });

    expect(result).toEqual({ success: true, test: true });
  });

  it("should return success even if data simulates failure", async () => {
    process.env.NODE_ENV = "test";

    const result = await smsDispatcher({
      type: "chat_reply",
      to: "+1234567890",
      data: { reply: "Testing fail" },
    });

    expect(result).toEqual({ success: true, test: true });
  });

  it("should throw error if type is invalid", async () => {
    process.env.NODE_ENV = "test";

    await expect(
      smsDispatcher({
        type: "invalid_type",
        to: "+1234567890",
        data: {},
      })
    ).rejects.toThrow("Invalid SMS type");
  });
});
