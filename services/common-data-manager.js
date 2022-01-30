import {PrismaClient} from "@prisma/client";

export default class CommonDataManager {
    static myInstance = null;

    _prismaClient = new PrismaClient()


    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }

    getPrismaClient() {
        return this._prismaClient;
    }

    setPrismaClient(prismaClient) {
        this._prismaClient = prismaClient;
    }
}
