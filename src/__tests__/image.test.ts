import supertest from 'supertest'
import createServer from '../utils/server'

const app = createServer();

describe ('image', () => {
    describe("get product route", () => {
        describe ("given the product does not exist", ()=> {
            it("should return a 404", async () => {
                const dummyID = "123"
                await supertest(app).get(`/api/image/${dummyID}`).expect(404);
            })
        })
    })
})