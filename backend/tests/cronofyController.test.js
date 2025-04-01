const { bookAppointment } = require("../controllers/cronofyController");
require("dotenv").config();

describe("Cronofy Controller - REAL API TEST", () => {
  it("should book appointment when date is valid", async () => {
    const req = {
      body: {
        from: "+1234567890",
        message: "Schedule on 2025-04-01",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await bookAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0];
    console.log("Cronofy response:", data);

    expect(data.message).toMatch(/Appointment booked/i);
  });
});
