import supertest from 'supertest'
import { createImage } from '../image/image.service';
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { Error } from 'mongoose'
import * as imageInputs from './image.inputs'
import { signJwt } from '../utils/jwt.utils';
import { ImageDocumnet } from '../image/image.model';

const app = createServer();

const jwt = signJwt({ user: "fake" }, { expiresIn: "1y" });


describe('image', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });
    beforeEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key]
            // @ts-ignore
            await collection.deleteMany();
        }
    });


    describe("get image route", () => {
        describe("given the image does not exist", () => {
            it("should return a 404", async () => {
                const dummyImageId = "123"
                await supertest(app).get(`/api/image/${dummyImageId}`).set(
                    "Authorization", `Bearer ${jwt}`).expect(404);
            })
        })
        describe("given the image does exist", () => {
            it("should return a 200 and the image", async () => {
                const image = await createImage(imageInputs.imagePayload);
                const { body, statusCode } = await supertest(app).get(`/api/image/${image._id}`).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(statusCode).toBe(200);
            })
        })
    })



    describe("create image route", () => {
        describe("given we are creating the same image twice", () => {
            it("should return a 401", async () => {
                await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                const { statusCode, body } = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                expect(statusCode).toBe(403)
            })
        })

        describe("given one or more fields are missing from image object", () => {
            it("should return a return a 400", async () => {
                let response = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadNoName);
                expect(response.statusCode).toBe(400)
                response = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadNoRepository);
                expect(response.statusCode).toBe(400)
                response = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadNoVersion);
                expect(response.statusCode).toBe(400)
                response = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadInvalidField);
                expect(response.statusCode).toBe(400)
            })
        })

        describe("given we are creating a valid image", () => {
            it("should return a return a 200 and db should contain that image", async () => {
                let response = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                expect(response.statusCode).toBe(200);
                const image = response.body as ImageDocumnet;
                expect(image.name).toBe(imageInputs.imagePayload.name);
                expect(image.repository).toBe(imageInputs.imagePayload.repository);
                expect(image.version).toBe(imageInputs.imagePayload.version);
                expect(image.metadata).toEqual(imageInputs.imagePayload.metadata);
                expect(image.createdAt).toStrictEqual(expect.any(String));
                expect(image.updatedAt).toStrictEqual(expect.any(String));
                expect(image._id).toStrictEqual(expect.any(String));
            })
        })
    })
})