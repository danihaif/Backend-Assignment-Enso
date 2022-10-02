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
        jest.setTimeout(30000);
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
                const { statusCode, body } = await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                expect(statusCode).toBe(200);
                const image = body as ImageDocumnet;
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

    describe("update image route", () => {
        describe("given the image already exists", () => {
            it("should return 200, update the image and merge the metadata", async () => {
                await supertest(app).post('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                const { statusCode, body } = await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.updateImagePayload);
                expect(body.version).toBe("1.0.1");
                expect(body.metadata).toEqual({
                    m1: "m1",
                    m2: "m2",
                    m3: "m3",
                    m4: "m4"
                })
                expect(statusCode).toBe(200);
            })
        })

        describe("given the image does not exist", () => {
            it("should return 200 and create the image", async () => {
                const { statusCode, body } = await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                expect(statusCode).toBe(200);
                const image = body as ImageDocumnet;
                expect(image.name).toBe(imageInputs.imagePayload.name);
                expect(image.repository).toBe(imageInputs.imagePayload.repository);
                expect(image.version).toBe(imageInputs.imagePayload.version);
                expect(image.metadata).toEqual(imageInputs.imagePayload.metadata);
                expect(image.createdAt).toStrictEqual(expect.any(String));
                expect(image.updatedAt).toStrictEqual(expect.any(String));
                expect(image._id).toStrictEqual(expect.any(String));
            })
        })

        describe("given one or more fields are missing from image object", () => {
            it("should return a 400", async () => {
                let response = await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadNoName);
                expect(response.statusCode).toBe(400)
                response = await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadNoRepository);
                expect(response.statusCode).toBe(400)
                response = await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadNoVersion);
                expect(response.statusCode).toBe(400)
                response = await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayloadInvalidField);
                expect(response.statusCode).toBe(400)
            })
        })
    })

    describe("get image combinations route", () => {
        describe("given we combination length is bigger than the amount of images", () => {
            it("should return an empty collection", async () => {
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload2);
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload3);
                let resspone = await supertest(app).get('/api/images/combination').query({ length: 4 }).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(resspone.body.length).toBe(0);
            })
        })

        describe("given we have n=6 images in the collection and we get combinations in lengths k=1-6", () => {
            it("should return n choose k (nCr) combinations", async () => {

                // Duplicate code --> sorry :(
                // TODO: add all inputs to array and iterate
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload);
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload2);
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload3);
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload4);
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload5);
                await supertest(app).put('/api/image').set(
                    "Authorization", `Bearer ${jwt}`).send(imageInputs.imagePayload6);
                let resspone = await supertest(app).get('/api/images/combination').query({ length: 1 }).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(resspone.body.length).toBe(6);
                resspone = await supertest(app).get('/api/images/combination').query({ length: 2 }).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(resspone.body.length).toBe(15);
                resspone = await supertest(app).get('/api/images/combination').query({ length: 3 }).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(resspone.body.length).toBe(20);
                resspone = await supertest(app).get('/api/images/combination').query({ length: 4 }).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(resspone.body.length).toBe(15);
                resspone = await supertest(app).get('/api/images/combination').query({ length: 5 }).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(resspone.body.length).toBe(6);
                resspone = await supertest(app).get('/api/images/combination').query({ length: 6 }).set(
                    "Authorization", `Bearer ${jwt}`);
                expect(resspone.body.length).toBe(1);
            })
        })

    })
})