// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User';
import CreateUserValidator from 'App/Validators/CreateUserValidator';

export default class AuthController {
  /**
   * Register a new user.
   * @param request
   */
  public async register({ request }) {
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
  public async login({ request, auth }) {
    const { email, password, rememberMe } = request.all();

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: rememberMe ? null : '7days',
    });

    const user = User.findBy('email', email);
    return { user, ...token };
  }

  /**
   * Check if a given email address is already taken.
   * @param request
   */
  public async checkEmail({ request }) {
    const { email } = request.qs();
    const user = await User.findBy('email', email);
    return { isTaken: !!user };
  }

  /**
   * Get the current logged in user.
   * @param auth
   */
  public async getUser({ auth }) {
    return auth.use('api').user!;
  }

  /**
   * Revoke the auth token of the current logged in user.
   * @param auth
   */
  public async logout({ auth }) {
    await auth.use('api').revoke();
    return {
      revoked: true,
    };
  }
}
