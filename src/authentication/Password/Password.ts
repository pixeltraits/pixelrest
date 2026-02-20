import bcrypt from 'bcrypt';

export default class Password {
  static async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async validate(userSendPassword: string, userBddPassword: string): Promise<boolean> {
    return bcrypt.compare(userSendPassword, userBddPassword);
  }
}
