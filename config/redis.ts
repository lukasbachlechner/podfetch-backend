/**
 * Config source: https://git.io/JemcF
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from "@ioc:Adonis/Core/Env";
import { RedisConfig, RedisConnectionConfig } from "@ioc:Adonis/Addons/Redis";

import Url from "url-parse";
import Application from "@ioc:Adonis/Core/Application";

const REDIS_TLS_URL = new Url(Env.get("REDIS_TLS_URL"));

const devRedisConfig: RedisConnectionConfig = {
  host: Env.get("REDIS_HOST"),
  port: Env.get("REDIS_PORT"),
  password: Env.get("REDIS_PASSWORD", ""),
  db: 0,
  keyPrefix: "",
  healthCheck: true,
};

const prodRedisConfig: RedisConnectionConfig = {
  host: REDIS_TLS_URL.hostname as string,
  port: REDIS_TLS_URL.port as number,
  password: REDIS_TLS_URL.password as string,
  db: 0,
  keyPrefix: "",
  healthCheck: true,
};

/*
|--------------------------------------------------------------------------
| Redis configuration
|--------------------------------------------------------------------------
|
| Following is the configuration used by the Redis provider to connect to
| the redis server and execute redis commands.
|
| Do make sure to pre-define the connections type inside `contracts/redis.ts`
| file for AdonisJs to recognize connections.
|
| Make sure to check `contracts/redis.ts` file for defining extra connections
*/
const redisConfig: RedisConfig = {
  connection: Env.get("REDIS_CONNECTION"),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | The default connection
    |--------------------------------------------------------------------------
    |
    | The main connection you want to use to execute redis commands. The same
    | connection will be used by the session provider, if you rely on the
    | redis driver.
    |
    */
    local: Application.inDev ? devRedisConfig : prodRedisConfig,
  },
};

export default redisConfig;
