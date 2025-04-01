const smsDispatcher = require("../utils/smsDispatcher");

exports.getCakePrice = async (req, res) => {
  const { from, message } = req.body;
  const guests = parseInt(message.match(/\d+/)?.[0]) || 0;
  const pricePerGuest = 5;
  const totalPrice = guests * pricePerGuest;

  await smsDispatcher({
    type: "cake_estimate",
    to: from,
    data: { guests, totalPrice },
  });

  res.status(200).json({
    message: `Estimated price for ${guests} guests is $${totalPrice}`,
    price: totalPrice,
  });
};
