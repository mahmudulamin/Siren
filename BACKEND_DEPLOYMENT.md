# Permanent backend deployment

GitHub Pages hosts only the frontend. The included `render.yaml` deploys the
Express API on Render and connects it to MongoDB Atlas.

## Required one-time setup

1. Create a MongoDB Atlas cluster and database user.
2. Allow Render to reach the cluster in Atlas Network Access.
3. Open Render's **New Blueprint Instance** page for this GitHub repository.
4. Enter the Atlas connection string in the secret `MONGODB_URI` field.
5. After deployment, copy the Render HTTPS URL ending in `.onrender.com`.
6. Set `VITE_API_BASE_URL` to `<render-url>/api`, rebuild, and publish the
   frontend to `gh-pages`.

Never commit the MongoDB password, `MONGODB_URI`, or `JWT_SECRET` to Git.
