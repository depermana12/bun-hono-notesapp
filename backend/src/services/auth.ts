import UserRepository from "../repositories/user";
import { decode, sign, verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import sendEmailResetPassword from "../email/transport";

type UserData = {
  name: string;
  email: string;
  password: string;
};

type Payload = {
  userId: number;
  exp: number;
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

  public async getUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
    return user;
  }

  public async signOut(userId: number) {
    // Invalidate refresh token, i don't have it yet
    return { message: "User signed out successfully" };
  }

  public async forgotPassword(email: string) {
    const userEmailExist = await this.userRepository.findByEmail(email);
    if (!userEmailExist) {
      throw new HTTPException(401, {
        message: "If your email exists, you will receive reset instructions",
      });
    }
    // todo refactor generateToken to take exp parameter
    const token = await sign(
      {
        userId: userEmailExist.id,
        exp: Math.floor(Date.now() + 1000 * 60 * 60 * 1),
      },
      "mieayam",
    ); // 1 hour
    sendEmailResetPassword(userEmailExist.email, token);
  }

  public async resetPassword(token: string, password: string) {
    const { exp } = await this.verifyToken(token);
    if (!exp || exp < Date.now() / 1000) {
      throw new HTTPException(401, {
        message: "failed update password, token expired",
      });
    }

    const { payload } = this.decodeToken(token);
    const userId = payload.userId;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HTTPException(401, {
        message: "failed update password, user not found",
      });
    }

    const hashed = await Bun.password.hash(password);
    await this.userRepository.updateUser(userId, { password: hashed });
  }

  private generateToken(userId: number) {
    const expiresIn = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000); // 7 days
    return sign({ userId, exp: expiresIn }, Bun.env.JWT_SECRET!);
  }

  public verifyToken(token: string) {
    return verify(token, Bun.env.JWT_SECRET!);
  }

  private decodeToken(token: string): { payload: Payload } {
    const decoded = decode(token);
    return { payload: decoded.payload as Payload };
  }
}

export default AuthService;
