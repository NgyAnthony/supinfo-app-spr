import {getSession} from '@auth0/nextjs-auth0';
import axios from 'axios';

const getAccessToken = async () => {
    const options = {
        method: 'POST',
        url: process.env.MGMT_AUTH0_DOMAIN + '/oauth/token',
        headers: {'content-type': 'application/json'},
        data: {
            grant_type: 'client_credentials',
            client_id: process.env.MGMT_AUTH0_CLIENT_ID,
            client_secret: process.env.MGMT_AUTH0_CLIENT_SECRET,
            audience: process.env.MGMT_AUTH0_DOMAIN + '/api/v2/'
        }
    };
    const tokenRequest = await axios.request(options)
    return tokenRequest.data.access_token
}

export default async function sendVerificationEmail(req, res) {
    const session = getSession(req, res);
    const accessToken = await getAccessToken()

    const options = {
        method: 'POST',
        url: process.env.MGMT_AUTH0_DOMAIN + '/api/v2/jobs/verification-email',
        headers: {'content-type': 'application/json', 'authorization': 'Bearer ' + accessToken},
        data: {
            user_id: session?.user?.sub,
        }
    };
    try {
        const emailRequest = await axios.request(options)
        res.status(200).json(emailRequest.data);
    } catch (error) {
        res.status(error.status || 400).end(error.message);
    }
}
