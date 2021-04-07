process.env.NODE_ENV = 'test';
import Joi from "joi";

import Middleware from 'node-rest/middleware';
import HttpResolver from 'node-rest/httpResolver';
import { SERVICE_ERRORS } from "../../../utils/nodeExpress/service-errors.config.js";


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
      spyOn(methodProp, 'next').and.callThrough();

      Middleware.parseMulterBody(req, res, methodProp.next);

      expect(req).toEqual(reqParsed);
      expect(methodProp.next).toHaveBeenCalled();
    });

    it(`next the middleware if body is empty`, () => {
      const req = {
        body: {}
      };

      spyOn(methodProp, 'next').and.callThrough();

      Middleware.parseMulterBody(req, res, methodProp.next);

      expect(methodProp.next).toHaveBeenCalled();
    });

  });

  describe(`joi should`, () => {

    const res = {
      req: {
        method: 'GET'
      },
      status: (status) => {
        return {
          send: (error) => {}
        }
      }
    };
    const methodProp = {
      next: () => {}
    }

    beforeEach(() => {
      spyOn(methodProp, 'next').and.callThrough();
    })

    it(`if schema is null only call next`, () => {
      const req = {};
      const schema = null;
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(HttpResolver.serviceUnavailable).not.toHaveBeenCalled();
      expect(methodProp.next).toHaveBeenCalled();
    });

    it(`if schema body data are ok with schemas rules only call joiValidation and next`, () => {
      const req = {
        body: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        body: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalledWith(req.body, schema.body, res);
      expect(HttpResolver.serviceUnavailable);
      expect(methodProp.next).toHaveBeenCalled();
    });

    it(`if schema body data are not ok with schemas rules call serviceUnavailable and don't call next`, () => {
      const req = {
        body: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        }
      };
      const schema = {
        body: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };
      const { error } = schema.body.validate(req.body);

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalledWith(req.body, schema.body, res);
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(`Joi`, `${SERVICE_ERRORS.JOI_VALIDATION}${error}`, res);
      expect(methodProp.next).not.toHaveBeenCalled();
    });

    it(`if schema params data are ok with schemas rules only call joiValidation and next`, () => {
      const req = {
        params: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        params: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalledWith(req.params, schema.params, res);
      expect(HttpResolver.serviceUnavailable);
      expect(methodProp.next).toHaveBeenCalled();
    });

    it(`if schema params data are not ok with schemas rules call serviceUnavailable and don't call next`, () => {
      const req = {
        params: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        }
      };
      const schema = {
        params: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };
      const { error } = schema.params.validate(req.params);

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalledWith(req.params, schema.params, res);
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(`Joi`, `${SERVICE_ERRORS.JOI_VALIDATION}${error}`, res);
      expect(methodProp.next).not.toHaveBeenCalled();
    });

    it(`if schema query data are ok with schemas rules only call joiValidation and next`, () => {
      const req = {
        query: {
          email: 'test@email.com',
          password: 'testfffeeee'
        }
      };
      const schema = {
        query: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalledWith(req.query, schema.query, res);
      expect(HttpResolver.serviceUnavailable);
      expect(methodProp.next).toHaveBeenCalled();
    });

    it(`if schema query data are not ok with schemas rules call serviceUnavailable and don't call next`, () => {
      const req = {
        query: {
          email: 'test@emailcom',
          password: 'testfffeeee'
        }
      };
      const schema = {
        query: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };
      const { error } = schema.query.validate(req.query);

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalledWith(req.query, schema.query, res);
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalledWith(`Joi`, `${SERVICE_ERRORS.JOI_VALIDATION}${error}`, res);
      expect(methodProp.next).not.toHaveBeenCalled();
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
        body: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        }),
        params: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        }),
        query: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalled();
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalled();
      expect(methodProp.next).not.toHaveBeenCalled();
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
        body: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        }),
        params: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        }),
        query: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalled();
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalled();
      expect(methodProp.next).not.toHaveBeenCalled();
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
        body: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        }),
        params: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        }),
        query: Joi.object().keys({
          email: Joi.string().email().required().max(100),
          password: Joi.string().required().max(255)
        })
      };

      spyOn(Middleware, 'joiValidation').and.callThrough();
      spyOn(HttpResolver, 'serviceUnavailable');

      Middleware.joi(req, res, methodProp.next, schema);

      expect(Middleware.joiValidation).toHaveBeenCalled();
      expect(HttpResolver.serviceUnavailable).toHaveBeenCalled();
      expect(methodProp.next).not.toHaveBeenCalled();
    });

  });

  describe(`multer should`, () => {
    const multer = (options) => {
      return {
        single: (documentFieldName) => {
          return (req, res, next) => {
            options.fileFilter(
              {},
              {
                mimetype: 'image/png'
              },
              (error, valid = false) => {
                if (error) {
                  throw error;
                }
                if (valid) {
                  next();
                }
              }
            );
          };
        }
      };
    };
    const multerMock = {
      multer: multer
    };
    const req = {
      body: {}
    };
    const res = {
    };

    it(`call multer with multerconfig properties uploadDirectory => dest and limits => limits`, () => {
      const multerConfig = {
        uploadDirectory: 'temp',
        documentFieldName: 'fileDocument',
        multerMethodName: 'single',
        limits: {
          fieldSize: 2000000,
          fileSize: 100000000
        },
        allowedMimeTypes: [
          `image/png`,
          `image/gif`,
          `image/jpeg`
        ],
      };
      const expectedConfig = {
        dest: multerConfig.uploadDirectory,
        limits: multerConfig.limits
      };
      spyOn(multerMock, 'multer').and.callThrough();

      middlewareMockContext.multer(req, res, methodProp.next, multerConfig);

      expect(multerMock.multer).toHaveBeenCalledWith(jasmine.objectContaining(expectedConfig));
    });

  });

});
