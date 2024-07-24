import UserService from '../services/UserService';

class UserController {
  public register = UserService.register;
  public login = UserService.login;
}

export default new UserController();
