import express from 'express';
import { Webhook } from 'svix';
import { User } from '../infrastructure/entities/User';

const webhookRouter = express.Router();

webhookRouter.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error('Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get Svix headers for verification
  const svix_id = headers['svix-id'] as string;
  const svix_timestamp = headers['svix-timestamp'] as string;
  const svix_signature = headers['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Error: Missing Svix headers');
    return res.status(400).json({ error: 'Error occurred -- no svix headers' });
  }

  let evt: any;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return res.status(400).json({ error: 'Verification failed' });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);

  try {
    if (eventType === 'user.created') {
        const {id} = evt.data;
        const user = await User.findOne({ clerkUserId: id });
        if (user) {
            console.log(`User with Clerk ID ${id} already exists.`);
            return res.status(200).send('Webhook received');
        }
        await User.create({ 
            firstname: evt.data.first_name ,
            lastname: evt.data.last_name ,
            email: evt.data.email_addresses?.[0]?.email_address,
            phoneNo: evt.data.phone_numbers?.[0]?.phone_number,
            clerkUserId: id
        });
    }

     if (eventType === 'user.deleted') {
      const user = await User.findOneAndDelete({ clerkUserId: id });
      if (user) {
        console.log(`🗑️ User with Clerk ID ${id} deleted.`);
      } else {
        console.log(`User with Clerk ID ${id} not found.`);
      }
    }

    if (eventType === 'user.updated') {
      const user = await User.findOneAndUpdate({ clerkUserId: id },{
        role: evt.data.public_metadata?.role
      });
    }

    return res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Error processing webhook event:', err);
    return res.status(500).json({ error: 'Error processing event' });
  }
});

export default webhookRouter;