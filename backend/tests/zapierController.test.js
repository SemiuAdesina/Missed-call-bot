const { handleTelnyxWebhook } = require("../controllers/zapierController");

describe("Zapier Controller - Telnyx AI Test", () => {
  it("should handle text input and return fake AI reply", async () => {
    process.env.NODE_ENV = "test";

    const req = {
      body: {
        from_number: "+1234567890",
        text: "How much is a birthday cake?",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handleTelnyxWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const data = res.json.mock.calls[0][0];
    console.log("Zapier Test Response:", data);

    expect(data.message).toBe("All AI replies sent via Telnyx");
    expect(data.replies[0]).toHaveProperty("question", "How much is a birthday cake?");
    expect(data.replies[0].answer).toBe("Test reply");
  });
});
