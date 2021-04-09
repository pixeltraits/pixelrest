process.env.NODE_ENV = 'test';
import SnakeToCamelParser from 'pixelrest/snakeToCamelParser';


describe('SnakeToCamelParser', () => {

  describe('parse should', () => {

    it('call parseArray if argument is an array', () => {
      const argumentData = [];
      spyOn(SnakeToCamelParser, 'parseArray');

      SnakeToCamelParser.parse(argumentData);

      expect(SnakeToCamelParser.parseArray).toHaveBeenCalled();
    });

    it('call parseObject if argument is an object', () => {
      const argumentData = {};
      spyOn(SnakeToCamelParser, 'parseObject');

      SnakeToCamelParser.parse(argumentData);

      expect(SnakeToCamelParser.parseObject).toHaveBeenCalled();
    });

    it('return date if argument is a date', () => {
      const argumentData = new Date();

      const result = SnakeToCamelParser.parse(argumentData);

      expect(result).toEqual(argumentData);
    });

    it('return null if argument is a null', () => {
      const argumentData = null;

      const result = SnakeToCamelParser.parse(argumentData);

      expect(result).toEqual(argumentData);
    });

  });

  describe('parseArray should', () => {

    it('camelcasify an array', () => {
      const noCamelArray = [
        {
          oot_mom: {
            test_lonlon: null
          },
          marchand_de_masque: 0
        },
        {
          levels: ['surface', 'facility', 'control'],
          cheat_code: {
            golden_gun: false
          },
          silver_pp7: true
        }
      ];
      const expected = [
        {
          ootMom: {
            testLonlon: null
          },
          marchandDeMasque: 0
        },
        {
          levels: ['surface', 'facility', 'control'],
          cheatCode: {
            goldenGun: false
          },
          silverPp7: true
        }
      ];

      expect(SnakeToCamelParser.parseArray(noCamelArray)).toEqual(expected);
    });

  });

  describe('parseObject should', () => {

    it('camelcasify an object', () => {
      const noCamelObject = {
        hyrule_historia: {
          oot_mom: {
            test_lonlon: false
          },
          marchand_de_masque: 0
        },
        goldeneye_007: {
          levels: ['surface', 'facility', 'control'],
          cheat_code: {
            golden_gun: false
          },
          silver_pp7: true
        }
      };
      const expected = {
        hyruleHistoria: {
          ootMom: {
            testLonlon: false
          },
          marchandDeMasque: 0
        },
        goldeneye007: {
          levels: ['surface', 'facility', 'control'],
          cheatCode: {
            goldenGun: false
          },
          silverPp7: true
        }
      };

      expect(SnakeToCamelParser.parseObject(noCamelObject)).toEqual(expected);
    });

  });

});
