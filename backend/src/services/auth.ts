import UserRepository from "../repositories/user";
import { decode, sign, verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

type UserData = {
  name: string;
  email: string;
  password: string;
};

type UserLogin = Omit<UserData, "name">;

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

  public async signIn(userData: UserLogin) {
    const user = await this.userRepository.findByEmail(userData.email);
    if (
      !user ||
      !(await Bun.password.verify(userData.password, user.password))
    ) {
      throw new HTTPException(401, { message: "Invalid email or password" });
    }

    const { password, ...userNoPw } = user;
    const token = await this.generateToken(user.id);
    return { user: userNoPw, token };
  }

  private generateToken(userId: number) {
    const expiresIn = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000); // 7 days
    return sign({ userId, exp: expiresIn }, Bun.env.JWT_SECRET!);
  }

  public verifyToken(token: string) {
    return verify(token, Bun.env.JWT_SECRET!);
  }

  public decodeToken(token: string) {
    return decode(token);
  }
}

export default AuthService;
