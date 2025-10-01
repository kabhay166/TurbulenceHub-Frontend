import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router.ts';
import './index.css'
import {ToastProvider} from "@/contexts/ToastContext.tsx";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ToastProvider>
          <RouterProvider router={router}/>
      </ToastProvider>
  </StrictMode>,
)
