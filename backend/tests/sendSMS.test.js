const sendSMS = require("../utils/sendSMS");

describe("sendSMS Utility - REAL TEST", () => {
  it("should return mock response in test mode", async () => {
    process.env.NODE_ENV = "test";

    const to = "+1234567890";
    const message = "Test message";

    const response = await sendSMS(to, message);

    // Log to verify behavior
    console.log("SMS Response:", response);

    expect(response).toEqual({
      message: "Test SMS skipped",
    });
  });
});
