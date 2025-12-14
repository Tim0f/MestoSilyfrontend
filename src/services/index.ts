// services/index.ts

import { HttpClient, type HttpClientOptions } from './httpClient';

export { HttpClient };
export type { HttpClientOptions };

/**
 * Тип DI-контейнера
 */
export type FrontendServices = Awaited<
  ReturnType<typeof createFrontendServices>
>;

/**
 * Асинхронная фабрика сервисов
 * ❗ Использует dynamic import — безопасно для Vite и tree-shaking
 */
export async function createFrontendServices(
  config: HttpClientOptions | HttpClient
) {
  const http =
    config instanceof HttpClient ? config : new HttpClient(config);

  const [
    { AchievementsFrontendService },
    { AuthFrontendService },
    { ChatFrontendService },
    { EventsFrontendService },
    { GrainsFrontendService },
    { LessonsFrontendService },
    { NewsFrontendService },
    { OrdersFrontendService },
    { PartnersFrontendService },
    { ProductsFrontendService },
    { SectionsFrontendService },
    { SessionsFrontendService },
    { TeachersFrontendService },
    { UploadFrontendService },
    { UsersFrontendService },
  ] = await Promise.all([
    import('./achievements.service'),
    import('./auth.service'),
    import('./chat.service'),
    import('./events.service'),
    import('./grains.service'),
    import('./lessons.service'),
    import('./news.service'),
    import('./orders.service'),
    import('./partners.service'),
    import('./products.service'),
    import('./sections.service'),
    import('./sessions.service'),
    import('./teachers.service'),
    import('./upload.service'),
    import('./users.service'),
  ]);

  return {
    http,

    achievements: new AchievementsFrontendService(http),
    auth: new AuthFrontendService(http),
    chat: new ChatFrontendService(http),
    events: new EventsFrontendService(http),
    grains: new GrainsFrontendService(http),
    lessons: new LessonsFrontendService(http),
    news: new NewsFrontendService(http),
    orders: new OrdersFrontendService(http),
    partners: new PartnersFrontendService(http),
    products: new ProductsFrontendService(http),
    sections: new SectionsFrontendService(http),
    sessions: new SessionsFrontendService(http),
    teachers: new TeachersFrontendService(http),
    upload: new UploadFrontendService(http),
    users: new UsersFrontendService(http),
  };
}
