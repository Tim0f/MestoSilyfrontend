import { HttpClient, type HttpClientOptions } from './httpClient';
import { AchievementsFrontendService } from './achievements.service';
import { AuthFrontendService } from './auth.service';
import { ChatFrontendService } from './chat.service';
import { EventsFrontendService } from './events.service';
import { GrainsFrontendService } from './grains.service';
import { LessonsFrontendService } from './lessons.service';
import { NewsFrontendService } from './news.service';
import { OrdersFrontendService } from './orders.service';
import { PartnersFrontendService } from './partners.service';
import { ProductsFrontendService } from './products.service';
import { SectionsFrontendService } from './sections.service';
import { SessionsFrontendService } from './sessions.service';
import { TeachersFrontendService } from './teachers.service';
import { UploadFrontendService } from './upload.service';
import { UsersFrontendService } from './users.service';

export {
  HttpClient,
  HttpError,
  type HttpClientOptions,
  type RequestOptions,
  type ResponseType,
} from './httpClient';

export type FrontendServices = ReturnType<typeof createFrontendServices>;

export function createFrontendServices(config: HttpClientOptions | HttpClient) {
  const http = config instanceof HttpClient ? config : new HttpClient(config);

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

export {
  AchievementsFrontendService,
  AuthFrontendService,
  ChatFrontendService,
  EventsFrontendService,
  GrainsFrontendService,
  LessonsFrontendService,
  NewsFrontendService,
  OrdersFrontendService,
  PartnersFrontendService,
  ProductsFrontendService,
  SectionsFrontendService,
  SessionsFrontendService,
  TeachersFrontendService,
  UploadFrontendService,
  UsersFrontendService,
};

