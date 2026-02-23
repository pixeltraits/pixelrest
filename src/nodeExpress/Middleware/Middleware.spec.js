import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

import Middleware from 'pixelrest/middleware';
import HttpResolver from 'pixelrest/httpResolver';
import { SERVICE_ERRORS } from "../service-errors.config.js";


describe('Middleware', () => {

  const methodProp = {
    next: () => {}
  };

  describe(`parseMulterBody should`, () => {

    const res = {};

    it(`parse json string in multer body and call next`, () => {
      const req = {
        body: {
          test: '{"truc":"machin","bidule":3,"chose":{"table":["test",3]}}',
          chose: 5,
          machin: []
        }
      };
      const reqParsed = {
        body: {
          test: {
            "truc": "machin",
            "bidule": 3,
            "chose": {
              "table": [
                "test",
                3
              ]
            }
          },
          chose: 5,
          machin: []
        }
      };
      vi.spyOn(methodProp, 'next');

      Middleware.parseMulterBody(req, res, methodProp.next);

      expect(req).toEqual(reqParsed);
      expect(methodProp.next).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`not crash on non-string body values (numbers, arrays, objects)`, () => {
      const req = {
        body: {
          count: 42,
          tags: ['a', 'b'],
          nested: { key: 'value' },
          flag: true
        }
      };
      const expectedBody = { ...req.body };
      vi.spyOn(methodProp, 'next');

      Middleware.parseMulterBody(req, res, methodProp.next);

      expect(req.body).toEqual(expectedBody);
      expect(methodProp.next).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`next the middleware if body is empty`, () => {
      const req = {
        body: {}
      };

      vi.spyOn(methodProp, 'next');

      Middleware.parseMulterBody(req, res, methodProp.next);

      expect(methodProp.next).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

  });

  describe(`validate should`, () => {

    const res = {
      req: {
        method: 'GET'
      },
      status: () => {
        return {
          send: () => {}
        }
      }
    };
    const methodProp = {
      next: () => {}
    }

    beforeEach(() => {
      vi.spyOn(methodProp, 'next');
    })

    it(`if schema is null only call next`, () => {
      const req = {};
      const schema = null;
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(HttpResolver.serviceUnavailable).not.toHaveBeenCalled();
      expect(methodProp.next).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema body data are ok with schemas rules only call zodValidation and next`, () => {
      const req = {
        body: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        body: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalledWith(req.body, schema.body, res);
      expect(HttpResolver.serviceUnavailable).not.toHaveBeenCalled();
      expect(methodProp.next).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema body data are not ok with schemas rules call serviceUnavailable and don't call next`, () => {
      const req = {
        body: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        }
      };
      const schema = {
        body: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };
      const result = schema.body.safeParse(req.body);
      const error = result.error;

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalledWith(req.body, schema.body, res);
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(`Zod`, `${SERVICE_ERRORS.VALIDATION_ERROR}${error}`, res);
      expect(methodProp.next).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema params data are ok with schemas rules only call zodValidation and next`, () => {
      const req = {
        params: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        params: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalledWith(req.params, schema.params, res);
      expect(HttpResolver.serviceUnavailable).not.toHaveBeenCalled();
      expect(methodProp.next).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema params data are not ok with schemas rules call serviceUnavailable and don't call next`, () => {
      const req = {
        params: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        }
      };
      const schema = {
        params: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };
      const result = schema.params.safeParse(req.params);
      const error = result.error;

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalledWith(req.params, schema.params, res);
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(`Zod`, `${SERVICE_ERRORS.VALIDATION_ERROR}${error}`, res);
      expect(methodProp.next).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema query data are ok with schemas rules only call zodValidation and next`, () => {
      const req = {
        query: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        query: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalledWith(req.query, schema.query, res);
      expect(HttpResolver.serviceUnavailable).not.toHaveBeenCalled();
      expect(methodProp.next).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema query data are not ok with schemas rules call serviceUnavailable and don't call next`, () => {
      const req = {
        query: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        }
      };
      const schema = {
        query: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };
      const result = schema.query.safeParse(req.query);
      const error = result.error;

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalledWith(req.query, schema.query, res);
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(`Zod`, `${SERVICE_ERRORS.VALIDATION_ERROR}${error}`, res);
      expect(methodProp.next).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema type data are not ok with schemas types rules call serviceUnavailable and don't call next, body error`, () => {
      const req = {
        body: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        },
        params: {
          email: 'test@email.com',
          password: 'testfffeeee'
        },
        query: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        body: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        }),
        params: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        }),
        query: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalled();
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalled();
      expect(methodProp.next).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema type data are not ok with schemas types rules call serviceUnavailable and don't call next, params error`, () => {
      const req = {
        body: {
          email: 'test@email.com',
          password: 'testfffeeee'
        },
        params: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        },
        query: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        body: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        }),
        params: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        }),
        query: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalled();
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalled();
      expect(methodProp.next).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`if schema type data are not ok with schemas types rules call serviceUnavailable and don't call next, query error`, () => {
      const req = {
        body: {
          email: 'test@email.com',
          password: 'testfffeeee'
        },
        params: {
          email: 'test@email.com',
          password: 'testfffeeee'
        },
        query: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        }
      };
      const schema = {
        body: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        }),
        params: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        }),
        query: z.object({
          email: z.string().email().max(100),
          password: z.string().max(255)
        })
      };

      vi.spyOn(Middleware, 'zodValidation');
      vi.spyOn(HttpResolver, 'serviceUnavailable').mockImplementation(() => {});

      Middleware.validate(req, res, methodProp.next, schema);

      expect(Middleware.zodValidation).toHaveBeenCalled();
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalled();
      expect(methodProp.next).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

  });

  describe(`controlMimeType should`, () => {

    const multerConfig = {
      allowedMimeTypes: ['image/png', 'image/jpeg']
    };

    it(`call callback with null and true if mime type is allowed`, () => {
      const fileFilter = Middleware.controlMimeType(multerConfig);
      const cb = vi.fn();

      fileFilter({}, { mimetype: 'image/png' }, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it(`call callback with Error if mime type is not allowed`, () => {
      const fileFilter = Middleware.controlMimeType(multerConfig);
      const cb = vi.fn();

      fileFilter({}, { mimetype: 'application/pdf' }, cb);

      expect(cb).toHaveBeenCalledWith(expect.any(Error));
    });

  });

});
