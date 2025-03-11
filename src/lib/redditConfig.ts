// Reddit API credentials
export const redditConfig = {
  userAgent: 'reddit-analytics-platform:v1.0.0 (by /u/Dull-Cherry-9005)',
  clientId: 'dLKi0kw2sM01PYpA9iedXw',
  clientSecret: 'qY7L17LL37Hinj6rqbFG3wKkyyhOTQ',
  username: 'Dull-Cherry-9005',
  password: '3ymiphg@2a/SgT-'
};

// Note: For script-type apps, we use username/password authentication
// Make sure your Reddit app is of type "script" in https://www.reddit.com/prefs/apps

// For web applications, we use the authorization code flow:
// 1. User clicks login button
// 2. Redirect to Reddit OAuth page
// 3. Reddit redirects back with auth code
// 4. Exchange auth code for access token
// 5. Use access token for API calls

// Note: To get your refresh token:
// 1. Go to https://www.reddit.com/prefs/apps
// 2. Create a new app of type "script"
// 3. Use https://not-an-aardvark.github.io/reddit-oauth-helper/ to generate a refresh token
// 4. Replace YOUR_REFRESH_TOKEN_HERE with the generated token 