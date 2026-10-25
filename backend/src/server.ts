import { createApp } from './app';
import { loadEnv } from './config/env';

const env = loadEnv();
createApp().listen(env.port, () => {
  process.stdout.write(`API listening on port ${env.port}\n`);
});
