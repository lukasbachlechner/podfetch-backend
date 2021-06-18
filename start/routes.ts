/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";
import PodcastIndexClient from "podcastdx-client";
import Env from "@ioc:Adonis/Core/Env";
import User from "App/Models/User";

Route.get("/health", async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});

Route.post("/register", "AuthController.register");
Route.post("/login", "AuthController.login");

console.log(Env.get("PI_API_SECRET"));

const podcastClient = new PodcastIndexClient({
  key: Env.get("PI_API_KEY") as string,
  secret: Env.get("PI_API_SECRET") as string,
  disableAnalytics: true,
});

Route.get("/podcasts", async ({ response }) => {
  const users = await User.all();
  const { feeds } = await podcastClient.raw("/podcasts/trending", {
    lang: "de-AT",
    cat: "comedy",
  });
  return { feeds, users };
});
