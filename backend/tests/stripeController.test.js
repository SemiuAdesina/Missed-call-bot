const { getCakePrice } = require("../controllers/stripeController");

describe("Stripe Controller - REAL API TEST", () => {
  it("should return price estimation", async () => {
    process.env.NODE_ENV = "test"; 

    const req = {
      body: {
        from: "+1234567890",
        message: "I want cake for 10 guests",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCakePrice(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const responseData = res.json.mock.calls[0][0];
    console.log("Stripe Response:", responseData);

    expect(responseData).toEqual({
      message: "Estimated price for 10 guests is $50",
      price: 50,
    });
  });
});
