import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Error } from 'mongoose'
import { signJwt } from '../utils/jwt.utils';
import * as deploymentInputs from './deployment.inputs'
import * as imageInputs from './image.inputs'
import { resetDeploymentsCount } from '../deployment/deployment.service';
import * as fs from "fs";
import config from 'config'



const app = createServer();

const jwt = signJwt({ user: "fake" }, { expiresIn: "1y" });

const countPath = config.get<string>("pathToCount");


describe('deployment', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        jest.setTimeout(30000);
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
        fs.unlinkSync(countPath);
    });
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key]
            // @ts-ignore
            await collection.deleteMany();
        }
        resetDeploymentsCount();
    });

    describe("create deployment route", () => {
        describe("given an image id does not exist", () => {
            it("should return a 400", async () => {
                const { statusCode, body } = await supertest(app).post('/api/deployment').set(
                    "Authorization", `Bearer ${jwt}`).send(deploymentInputs.invalidDeploymentPayload);
                expect(statusCode).toBe(403)
            })
        })

        describe("given an image id does exist", () => {
            it("should return a 200 and the response should contain the imageId", async () => {
                let response = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                const imageId = response.body._id;
                const validDeploymentPayload = {
                    imageId: imageId
                }

                const { statusCode, body } = await supertest(app).post('/api/deployment').set(
                    "Authorization", `Bearer ${jwt}`).send(validDeploymentPayload);
                expect(statusCode).toBe(200);
                expect(body.imageId).toBe(imageId);
            })
        })
    })

    describe("get deployments count route", () => {
        describe("given we create an image and create 2 deployments", () => {
            it("deplyoments count should be incremented by 2", async () => {

                let response = await supertest(app).get('/api/deployment-count/').set(
                    "Authorization", `Bearer ${jwt}`);
                const firstCount = +response.body['deploymentCount'];

                response = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                const imageId = response.body._id;
                const validDeploymentPayload = {
                    imageId: imageId
                }
                await supertest(app).post('/api/deployment').set(
                    "Authorization", `Bearer ${jwt}`).send(validDeploymentPayload);
                await supertest(app).post('/api/deployment').set(
                    "Authorization", `Bearer ${jwt}`).send(validDeploymentPayload);
                response = await supertest(app).get('/api/deployment-count/').set(
                    "Authorization", `Bearer ${jwt}`);
                const secondCount = +response.body['deploymentCount'];
                expect(secondCount).toEqual(+firstCount + 2);
            })
        })
    })
})