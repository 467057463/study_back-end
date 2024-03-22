import type { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.post('/crash', controller.crash.index);
};
