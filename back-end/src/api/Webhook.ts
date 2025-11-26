import express from 'express';
import { verifyWebhook } from '@clerk/express/webhooks'
import { User } from '../infrastructure/entities/User';

const webhookRouter = express.Router();

webhookRouter.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    if (eventType === 'user.created') {
        const {id} = evt.data;
        const user = await User.findOne({ clerkUserId: id });
        if (user) {
            console.log(`User with Clerk ID ${id} already exists.`);
            return res.send('Webhook received');
        }
        await User.create({ 
            firstname: evt.data.first_name ,
            lastname: evt.data.last_name ,
            email: evt.data.email_addresses?.[0]?.email_address,
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

    return res.send('Webhook received')
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).send('Error verifying webhook')
  }
});

export default webhookRouter;