// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";

export default class AuthController {
  /**
   * Register a new user.
   * @param request
   * @param response
   */
  async register({ request }) {
    await request.validate(CreateUserValidator);
    const { email, password } = request.all();
    const user = await User.create({ email, password });
    return user;
  }

  /**
   * Log a user in.
   * @param request
   * @param auth
   */
  async login({ request, auth }) {
    const { email, password, rememberMe } = request.all();
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: rememberMe ? null : "7days",
    });
    return token;
  }
}
