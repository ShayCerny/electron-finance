import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import Dashboard from 'Components/Dashboard';
import Navbar from './Components/Navbar';
import Transactions from './Components/Transactions';

const routes = [
  {
    path: '/',
    element: <Navbar />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/transactions',
        element: <Transactions />
      },
      {
        path: '/debt-planner',
        element: <Dashboard />
      }
    ]
  }
]

const router = createMemoryRouter(routes, {})

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
