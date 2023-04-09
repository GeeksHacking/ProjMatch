import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

<<<<<<< HEAD
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
=======
const afterCallback = (req, res, session, state) => {
    console.log(session.idToken);
    console.log(session)
    return session;
}

export default handleAuth({
    async callback(req, res) {
        try {
            await handleCallback(req, res, { afterCallback });
        } catch (error) {
            res.status(error.status || 500).end(error.message);
        }
    }
});
>>>>>>> 1c5f3da44d44ee489d06cccb5bc2ecee84ec0bc2
