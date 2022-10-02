import { object, string } from 'zod'
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateImageInput:
 *      type: object
 *      required:
 *        - name
 *        - repository
 *        - version
 *      properties:
 *        name:
 *          type: string
 *          default: image1
 *        repository:
 *          type: string
 *          default: repository1
 *        version:
 *          type: string
 *          default: 1.0.0
 *    CreateImageResponse:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        repository:
 *          type: string
 *        version:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

export const createImageSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
    repository: string({
      required_error: "repository is required",
    }),
    version: string({
      required_error: "version is required",
    }),
    metadata: object({

    })
  }).strict(),
});