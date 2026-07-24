import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass, heroHeart, heroHome, heroCog6Tooth,
  heroChevronRight, heroArrowRight, heroExclamationTriangle,
  heroCake, heroFire, heroSparkles, heroStar, heroBeaker,
  heroUser, heroArrowRightOnRectangle, heroPencilSquare,
  heroHandThumbUp, heroChatBubbleLeftRight, heroXMark,
  heroSun, heroMoon, heroBars3
} from '@ng-icons/heroicons/outline';
import { routes } from './app.routes';
import { authInterceptor } from './guards/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIcons({
      heroMagnifyingGlass, heroHeart,
      heroHome, heroCog6Tooth, heroChevronRight,
      heroArrowRight, heroExclamationTriangle,
      heroCake, heroFire, heroSparkles, heroStar, heroBeaker,
      heroUser, heroArrowRightOnRectangle, heroPencilSquare,
      heroHandThumbUp, heroChatBubbleLeftRight, heroXMark,
      heroSun, heroMoon, heroBars3
    }),
  ],
};