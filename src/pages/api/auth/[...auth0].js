import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth({
    login: handleLogin({
        authorizationParams: {
            audience: 'localhost:8080/api/v1', // or AUTH0_AUDIENCE
            // Add the `offline_access` scope to also get a Refresh Token
            scope: 'openid profile email read:products' // or AUTH0_SCOPE
        }
    })
});

// export default handleAuth();