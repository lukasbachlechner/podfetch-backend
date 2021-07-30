export default class BeaconAuth {
  public async handle({ request, auth }, next) {
    const { token } = request.body();

    if (token) {
      request.request.headers.authorization = `Bearer ${token.replace(
        'Bearer ',
        '',
      )}`;
    }

    await auth.use('api').authenticate();
    await next();
  }
}
