import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { api } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) throw new Error('CLERK_WEBHOOK_SECRET is not set');

    // Log all headers
    console.log(
      'Headers received:',
      Object.fromEntries(request.headers.entries())
    );

    const svix_id = request.headers.get('svix-id');
    const svix_signature = request.headers.get('svix-signature');
    const svix_timestamp = request.headers.get('svix-timestamp');
    if (!svix_id || !svix_signature || !svix_timestamp) {
      throw new Error('Missing required headers');
    }

    const body = await request.text();

    const wh = new Webhook(webhookSecret);
    let evt;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
      console.log('Webhook verified! Event:', evt);
    } catch (error) {
      console.error('Webhook verification failed:', error);
      throw new Error('Invalid webhook signature');
    }

    // --- CREATE USER IN DB IF EVENT IS 'user.created' ---
    if ((evt as any).type === 'user.created') {
      const data = (evt as any).data;

      const id = data.id;
      const email =
        Array.isArray(data.email_addresses) && data.email_addresses.length > 0
          ? data.email_addresses[0].email_address
          : null;

      const firstName = data.first_name || '';
      const lastName = data.last_name || '';
      const name = `${firstName} ${lastName}`.trim() || email || id;

      // Find a usable image
      const image =
        data.image_url ||
        data.profile_image_url ||
        (Array.isArray(data.external_accounts) &&
        data.external_accounts.length > 0
          ? data.external_accounts[0].avatar_url
          : null);

      // Use username if present, else derive from email or use id as fallback
      const username = data.username || (email ? email.split('@')[0] : id);

      if (!email) {
        console.error('No email address found in event data:', data);
      } else {
        try {
          await ctx.runMutation(api.users.createUser, {
            email,
            fullname: name,
            image,
            clerkId: id,
            username,
          });
          console.log('User created in DB:', {
            email,
            fullname: name,
            image,
            clerkId: id,
            username,
          });
        } catch (error) {
          console.error('Error creating user:', error, {
            email,
            fullname: name,
            image,
            clerkId: id,
            username,
          });
          throw new Error('Failed to create user');
        }
      }
    }

    return new Response('OK', { status: 200 });
  }),
});

export default http;
