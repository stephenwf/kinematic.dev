import Router from '@koa/router';
import koaBody from 'koa-body';
import { requestBody } from '../middleware/request-body';
import { RouteMiddleware } from '../types/application';
import { githubApi } from '../middleware/github-api';

export type RouteWithParams<Props, Body = any> =
  | [string, string, RouteMiddleware<Props, Body>]
  | [string, string, RouteMiddleware<Props, Body>, string];

export type GetRoute<
  Routes extends { [key in RouteName]: Value },
  RouteName extends string,
  Value = any
> = Routes[RouteName] extends RouteWithParams<infer T> ? T : never;

export type GetBody<
  Routes extends { [key in RouteName]: Value },
  RouteName extends string,
  Value = any
> = Routes[RouteName] extends RouteWithParams<any, infer T> ? T : never;

export class TypedRouter<
  Routes extends string,
  MappedRoutes extends { [key in Routes]: RouteWithParams<GetRoute<MappedRoutes, Routes>> }
> {
  static GET = 'get';
  static POST = 'post';
  static PATCH = 'patch';
  static PUT = 'put';
  static DELETE = 'delete';

  private router = new Router();

  constructor(routes: MappedRoutes) {
    const routeNames = Object.keys(routes) as Routes[];
    for (const route of routeNames) {
      const [method, path, func, schemaName] = routes[route];

      switch (method) {
        case TypedRouter.PUT:
          // @ts-ignore
          this.router.put(route, path, koaBody(), githubApi, requestBody(schemaName), func);
          break;
        case TypedRouter.POST:
          // @ts-ignore
          this.router.post(route, path, koaBody(), githubApi, requestBody(schemaName), func);
          break;
        case TypedRouter.PATCH:
          // @ts-ignore
          this.router.patch(route, path, koaBody(), githubApi, requestBody(schemaName), func);
          break;
        case TypedRouter.GET:
          // @ts-ignore
          this.router.get(route, path, githubApi, func);
          break;
        case TypedRouter.DELETE:
          // @ts-ignore
          this.router.delete(route, path, githubApi, func);
          break;
      }
    }
  }

  url<Route extends Routes>(
    name: Route,
    params?: GetRoute<MappedRoutes, Route>,
    options?: Router.UrlOptionsQuery
  ): string {
    return this.router.url(name, params, options);
  }

  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
