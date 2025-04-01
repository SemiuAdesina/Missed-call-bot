const { handleChatResponse } = require("../controllers/chatController");
require("dotenv").config();

describe("Chat Controller - REAL API TEST", () => {
  it("should return a response from ChatGPT using real API", async () => {
    const req = {
      body: {
        from: "+1234567890",
        message: "What cakes do you sell?",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handleChatResponse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const responseData = res.json.mock.calls[0][0];
    console.log("🔎 Response:", responseData.reply);

    expect(typeof responseData.reply).toBe("string");
    expect(responseData.reply.length).toBeGreaterThan(10);
  });
});
