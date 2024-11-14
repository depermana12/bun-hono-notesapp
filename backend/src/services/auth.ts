import UserRepository from "../repositories/user";
import { decode, sign, verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import sendEmailResetPassword from "../email/transport";
import { TRPCError } from "@trpc/server";
import SessionRepository from "../repositories/session";

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
  constructor(
    private userRepository = new UserRepository(),
    private session = new SessionRepository(),
  ) {}
  public async signUp(userData: UserData) {
    const hashed = await Bun.password.hash(userData.password);
    const newUser = await this.userRepository.addUser({
      ...userData,
      password: hashed,
    });

    const token = await this.createAccessToken(newUser.id);
    return { user: newUser, token };
  }

  public async signIn(userData: UserLogin) {
    const user = await this.userRepository.findByEmail(userData.email);
    if (
      !user ||
      !(await Bun.password.verify(userData.password, user.password))
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
        cause: { signIn: "Invalid email or password" },
      });
    }
    const { password, ...userNoPw } = user;

    const accessToken = await this.createAccessToken(user.id);
    const refreshToken = await this.createRefreshToken(user.id);

    const sessionData = {
      userId: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    };
    const storedSession = await this.session.storeSession(sessionData);

    return { user: userNoPw, token: accessToken, storedSession };
  }

  public async getUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
    return user;
  }

  public async validateEmail(userEmail: string) {
    const user = await this.userRepository.findByEmail(userEmail);
    if (user && user.email === userEmail) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email already in use",
        cause: { email: "Email already in use" },
      });
    }
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

  public async createAccessToken(userId: number) {
    const exp = Math.floor((Date.now() + 1000 * 60 * 15) / 1000); // 15 minutes
    return await sign({ userId, exp }, Bun.env.JWT_SECRET!);
  }

  public async createRefreshToken(userId: number) {
    const exp = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 1) / 1000); // 1 day
    return await sign({ userId, exp }, "baksosuper");
  }

  public verifyToken(token: string) {
    return verify(token, Bun.env.JWT_SECRET!);
  }

  public verifyRefreshToken(token: string) {
    return verify(token, Bun.env.REFRESH_JWT_SECRET!);
  }

  private decodeToken(token: string): { payload: Payload } {
    const decoded = decode(token);
    return { payload: decoded.payload as Payload };
  }
}

export default AuthService;
