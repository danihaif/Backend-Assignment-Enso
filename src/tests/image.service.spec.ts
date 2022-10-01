import { describe, it } from "node:test";
import { ImageDocumnet } from "../image/image.model";
import { createImage } from "../image/image.service";

 describe("bla bla", () => {
    it("bla", () => {
        const payload = {
            "name": "image12",
            "repository": "repository1",
            "version": "1.0.0",
            "metadata": {
                "m1": "m1",
                "m2": "m2"
            }
        };
        createImage(payload as ImageDocumnet);
    })
 })