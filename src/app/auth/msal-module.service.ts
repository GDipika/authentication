import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService, ProtectedResourceScopes } from '@azure/msal-angular';
import { BrowserAuthOptions, BrowserCacheLocation, BrowserSystemOptions, CacheOptions, Configuration, InteractionType, PublicClientApplication } from '@azure/msal-browser';

interface AuthConfig {
  clientId: string,
  authority?: string,
  redirectPath: string
}

@Injectable({
  providedIn: 'root'
})
export class MsalModuleService {

  public addMsal(mainModule: NgModule) {
    const msalConfig: AuthConfig = {
      clientId: '7ca107ee-b11e-4fba-91c1-3d31f322cec7',
      redirectPath: '/',
      authority: 'https://login.microsoftonline.com/{8f6bd982-92c3-4de0-985d-0e287c55e379}/'
    }
    const protectedResources: { url: string, scopes: Array<string> }[] = [];
    const msalModule = this.createMsalModule(msalConfig, protectedResources);
    if (!mainModule.imports) {
      mainModule.imports = [];
    }
    mainModule.imports.push(msalModule);

    if (!mainModule.providers) {
      mainModule.providers = [];
    }
    mainModule.providers.push(
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
      },
      MsalBroadcastService,
      MsalGuard,
      MsalService
    );
    if (!mainModule.bootstrap) {
      mainModule.bootstrap = [];
    }
    mainModule.bootstrap.push(MsalRedirectComponent);
  }

  private createMsalModule(config: AuthConfig, protectedResources: { url: string, scopes: Array<string>; }[]) {
    const auth: BrowserAuthOptions = {
      clientId: config.clientId,
      redirectUri: config.redirectPath,
      authority: config.authority
    }

    const cache: CacheOptions = {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false,
    };

    const system: BrowserSystemOptions = {
      loggerOptions: {
        loggerCallback: () => { },
        piiLoggingEnabled: false
      }
    };

    const configuration: Configuration = { auth, cache, system };
    const publicClientApplication = new PublicClientApplication(configuration);
    const interactionType = InteractionType.Redirect;
    const guardConfig: MsalGuardConfiguration = { interactionType };
    const protectedResourceMap: Map<string, Array<string | ProtectedResourceScopes> | null> = new Map();

    protectedResources.forEach(element => {
      protectedResourceMap.set(element.url, element.scopes);
    });

    const interceptorConfig: MsalInterceptorConfiguration = {
      interactionType,
      protectedResourceMap
    };
    return MsalModule.forRoot(publicClientApplication, guardConfig, interceptorConfig);
  }

  constructor() { }
}
