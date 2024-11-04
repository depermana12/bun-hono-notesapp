import UserRepository from "../repositories/user";
import { decode, sign, verify } from "hono/jwt";

type UserData = {
  name: string;
  email: string;
  password: string;
};

class AuthService {
  constructor(private userRepository = new UserRepository()) {}
  public async signUp(userData: UserData) {
    const hashed = await Bun.password.hash(userData.password);
    const newUser = await this.userRepository.addUser({
      ...userData,
      password: hashed,
    });
    const token = await this.generateToken(newUser.id);
    return { user: newUser, token };
  }

  private generateToken(userId: number) {
    const expiresIn = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000); // 7 days
    return sign({ userId, exp: expiresIn }, "mieayam");
  }

  public verifyToken(token: string) {
    return verify(token, "mieayam");
  }

  public decodeToken(token: string) {
    return decode(token);
  }
}

export default AuthService;
