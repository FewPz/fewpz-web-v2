import { createRouter } from '@tanstack/react-router'
import { routeTree } from './app/routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
  })
}
