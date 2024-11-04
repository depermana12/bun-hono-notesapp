import UserRepository from "../repositories/user";

type UserData = {
  name: string;
  email: string;
  password: string;
};

class AuthService {
  constructor(private userRepository = new UserRepository()) {}
  public async signUp(userData: UserData) {
    const hashed = await Bun.password.hash(userData.password);
    return this.userRepository.addUser({ ...userData, password: hashed });
  }
}

export default AuthService;
