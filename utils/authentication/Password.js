import bcrypt from 'bcrypt';


export default class Password {

  static async hash(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }

  static async validate(userSendPassword, userBddPassword) {
    if (await bcrypt.compare(userSendPassword, userBddPassword)) {
      return true;
    }
    return false;
  }

}
