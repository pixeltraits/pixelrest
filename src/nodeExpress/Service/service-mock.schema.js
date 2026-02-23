import { z } from 'zod';


export const getListByIdSchema = {
  params: z.object({
    id: z.coerce.number().int()
  })
};
