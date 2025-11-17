import {
    createRouter,
    createRoute,
    createRootRoute,
} from '@tanstack/react-router'

import Home from './pages/Home'
import Models from './pages/Models'
import About from './pages/About'
import Data from './pages/data/Data.tsx'
import Root from './pages/Root'
import HydroDemo from './pages/demo/HydroDemo.tsx'
import MhdDemo from './pages/demo/MhdDemo.tsx'
import { Login } from '@/pages/auth/Login.tsx'
import { Signup } from '@/pages/auth/Signup.tsx'
import Demo from "@/pages/demo/Demo.tsx";
import UserDashboard from "@/pages/dashboard/UserDashboard.tsx";
import HydroModel from "@/pages/models/HydroModel.tsx";
import EulerModel from "@/pages/models/EulerModel.tsx";
import MhdModel from "@/pages/models/MhdModel.tsx";
import RbcModel from "@/pages/models/RbcModel.tsx";
import {RegistrationSuccess} from "@/pages/auth/RegistrationSuccess.tsx";
import PasswordReset from "@/pages/auth/PasswordReset.tsx";
import ActiveRuns from "@/pages/dashboard/ActiveRuns.tsx";
import Settings from "@/pages/Settings.tsx";
import AddData from "@/pages/dashboard/AddData.tsx";

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

const demo = createRoute({
    getParentRoute: () => rootRoute,
    path: "/demo/$kind",
    component: Demo,
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


const passwordResetRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/user/reset-password",
    component: PasswordReset,
})

const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: UserDashboard,
})

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: Settings,
})


const activeRunsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/active-runs',
    component: ActiveRuns,
})

const eulerModelRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/models/euler',
        component: EulerModel,
    }
)

const hydroModelRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/models/hydro',
    component: HydroModel,
    }
)

const mhdModelRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/models/mhd',
        component: MhdModel,
    }
)

const rbcModelRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/models/rbc',
        component: RbcModel,
    }
)

const signupSuccessRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup/success',
    component: RegistrationSuccess
})


const addDataRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/add-data',
    component: AddData,
})


const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, dataRoute,modelsRoute,
    hydroDemo,mhdDemo,demo,loginRoute, signupRoute, signupSuccessRoute,passwordResetRoute,
    dashboardRoute,settingsRoute,activeRunsRoute,eulerModelRoute,hydroModelRoute,mhdModelRoute,rbcModelRoute,addDataRoute])

export const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}