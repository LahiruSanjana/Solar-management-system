import express from 'express';
import { Webhook } from 'svix';
import { User } from '../infrastructure/entities/User';
import { WebhookEvent } from '@clerk/express'; // Types import (Optional)

const webhookRouter = express.Router();

webhookRouter.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log("🔔 Incoming Clerk webhook received");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Raw Body:", req.body.toString());
  try {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
      console.error('🔴 Error: CLERK_WEBHOOK_SECRET is missing in Env variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const wh = new Webhook(SIGNING_SECRET);

    const headers = req.headers;
    const payload = req.body;

    const svix_id = headers['svix-id'] as string;
    const svix_timestamp = headers['svix-timestamp'] as string;
    const svix_signature = headers['svix-signature'] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('🔴 Error: Missing Svix headers');
      return res.status(400).json({ error: 'Error occurred -- no svix headers' });
    }

    let evt: WebhookEvent;
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('🔴 Error: Verification failed:', err);
      return res.status(400).json({ error: 'Verification failed' });
    }
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`✅ Received webhook: ${eventType} for ${id}`);

    if (eventType === 'user.created') {
        const existingUser = await User.findOne({ clerkUserId: id });
        if (existingUser) {
            console.log(`User already exists: ${id}`);
        } else {
            await User.create({ 
                firstname: evt.data.first_name,
                lastname: evt.data.last_name,
                email: evt.data.email_addresses?.[0]?.email_address,
                phoneNo: evt.data.phone_numbers?.[0]?.phone_number,
                clerkUserId: id
            });
            console.log(`🆕 User created: ${id}`);
        }
    }

    if (eventType === 'user.deleted') {
      await User.findOneAndDelete({ clerkUserId: id });
      console.log(`🗑️ User deleted: ${id}`);
    }

    if (eventType === 'user.updated') {
      await User.findOneAndUpdate({ clerkUserId: id },{
        role: evt.data.public_metadata?.role
      });
      console.log(`🔄 User updated: ${id}`);
    }

    return res.status(200).send('Webhook received');

  } catch (err) {
    console.error('🔥 CRITICAL ERROR inside Webhook:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default webhookRouter;