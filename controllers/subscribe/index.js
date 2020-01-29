const webPush = require('web-push');

module.exports = (req, res, next) => {
  const subscription = req.body; // Credentials of push notification receiver.
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });
  webPush.sendNotification(subscription, payload).catch(next);
};
