import {object, string} from 'zod'

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