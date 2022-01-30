import {handleAuth, handleLogin, handleProfile} from '@auth0/nextjs-auth0';

export default handleAuth({
    async login(req, res) {
        try {
            await handleLogin(req, res, {
                authorizationParams: {
                    scope: 'openid profile email',
                }
            })
        } catch (error) {
            res.status(error.status || 500).end(error.message);
        }
    },

    async profile(req, res) {
        try {
            await handleProfile(req, res, { refetch: true })
        } catch (error) {
            res.status(error.status || 500).end(error.message)
        }
    }
});
