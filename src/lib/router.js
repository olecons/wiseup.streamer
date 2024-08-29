const express = require('express');
const importLivekit = async () => await import('livekit-server-sdk');
require('dotenv/config');

const router = express.Router();

const createToken = async (roomName, participantName) => {
  const livekit = await importLivekit();
  const at = new livekit.AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    name: participantName,
    metadata: JSON.stringify({ admin: true }),
    // Token to expire after 60 minutes
    ttl: '60m',
  });
  at.addGrant({ roomJoin: true, room: roomName });
  return await at.toJwt();
}

router.post('/getToken', async (req, res) => {
  const {roomName, participantName} = req.body;
  res.json({ token: await createToken(roomName, participantName) });
});

router.get('/', async (req, res) => {
  res.json(true);
})

module.exports = router;
