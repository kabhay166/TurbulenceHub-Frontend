import {
    createRouter,
    createRoute,
    createRootRoute,
} from '@tanstack/react-router'

import Home from './pages/Home'
import Models from './pages/Models'
import About from './pages/About'
import Data from './pages/Data'
import Root from './pages/Root'
import HydroDemo from './pages/HydroDemo'
import MhdDemo from './pages/MhdDemo'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

const rootRoute = createRootRoute({component:Root})
const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
})

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: About,
})

const dataRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/data',
    component: Data,
})

const modelsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/models',
    component: Models,
})

const hydroDemo = createRoute({
    getParentRoute: () => rootRoute,
    path: '/hydro-demo',
    component: HydroDemo,
})

const mhdDemo = createRoute({
    getParentRoute: () => rootRoute,
    path: '/mhd-demo',
    component: MhdDemo,
})

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/user/login',
    component: Login,
})

const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/user/signup',
    component: Signup,
})

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, dataRoute,modelsRoute,hydroDemo,mhdDemo,loginRoute, signupRoute])

export const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}