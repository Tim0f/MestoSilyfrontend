import { NavLink } from 'react-router-dom'

import chatIcon from '../assets/svg/chat.svg'
import scheduleIcon from '../assets/svg/shedule.svg'
import zernoIcon from '../assets/svg/Zerno.svg'
import vectorIcon from '../assets/svg/Vector_7.svg'
import sticker1 from '../assets/img/sticker1.webp'

import { useAuth } from '../context/AuthContext'

export default function BottomNav() {
  const { user } = useAuth()

  const profileImage =
    sticker1

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="h-[18px] bg-customyellow" />

      <div className="flex h-[82px] items-center justify-around bg-customgrey px-4">
        <NavLink to="/chats">
          <img
            src={chatIcon}
            alt="Chats"
            className="h-8 w-8"
          />
        </NavLink>

        <NavLink to="/schedule">
          <img
            src={scheduleIcon}
            alt="Schedule"
            className="h-8 w-8"
          />
        </NavLink>

        <NavLink to="/">
          <img
            src={zernoIcon}
            alt="Home"
            className="h-11 w-11"
          />
        </NavLink>

        <NavLink to="/sections">
          <img
            src={vectorIcon}
            alt="Sections"
            className="h-8 w-8"
          />
        </NavLink>

        <NavLink to={user ? '/profile' : '/login'}>
          <img
            src={profileImage}
            alt="Profile"
            className="h-14 w-14 rounded-full border-2 border-customyellow object-cover"
          />
        </NavLink>
      </div>
    </div>
  )
}