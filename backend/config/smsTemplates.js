module.exports = {
    chat_reply: ({ reply }) => reply,
  
    cake_estimate: ({ guests, totalPrice }) =>
      `🎂 Hello! Estimated price for ${guests} guests is $${totalPrice}.`,
  
    appointment_booked: ({ date }) =>
      `📅 Your cake appointment is confirmed for ${date} at 10:00 AM. Thank you!`,
  };
  