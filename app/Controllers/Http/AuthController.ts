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
    const { email, password, categoryPreferences } = request.all();

    const user = await User.create({
      email,
      password,
      categoryPreferences,
    });

    return user;
  }

  /**
   * Log a user in.
   * @param request
   * @param auth
   */
  public async login({ request, auth }) {
    const { email, password } = request.all();

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '7days',
    });

    const user = auth.user!;
    await user.load('playedEpisodes');
    await user.load('subscribedPodcasts');
    await user.load('likedEpisodes');

    return {
      user,
      ...token,
    };
  }

  /**
   * Check if a given email address is already taken.
   * @param request
   */
  public async checkEmail({ request }) {
    const { email } = request.qs();
    const user = await User.findBy('email', email);
    return {
      isTaken: !!user,
    };
  }

  /**
   * Get the current logged in user.
   * @param auth
   */
  public async getUser({ auth }) {
    const user = auth.user!;
    await user.load('playedEpisodes');
    await user.load('subscribedPodcasts');
    await user.load('likedEpisodes');
    return auth.user!;
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
