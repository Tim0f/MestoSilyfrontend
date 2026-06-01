import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Layout() {
  

  return (
    <div className="min-h-screen flex flex-col bg-customwhite dark:bg-customblack transition-colors duration-300">

      <Header />


      <main className="flex-grow ">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}