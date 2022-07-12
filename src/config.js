import { ServerApiVersion } from 'mongodb';

export default {
    mongoRemote: {
        client: { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
    }
}