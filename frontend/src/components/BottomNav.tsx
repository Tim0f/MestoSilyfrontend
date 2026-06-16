import { NavLink } from 'react-router-dom'
import { getAvatarUrl } from "../utils/avatars";
import chatIcon from '../assets/svg/chat.svg'
import scheduleIcon from '../assets/svg/shedule.svg'
import zernoIcon from '../assets/svg/Zerno.svg'
import vectorIcon from '../assets/svg/Vector_7.svg'
import sticker1 from '../assets/img/sticker1.webp'
import profileIcon from '../assets/svg/ProfileIcon.svg'

import { useAuth } from '../context/AuthContext'

export default function BottomNav() {
  const { user } = useAuth()

  const profileImage = user?.avatarID
    ? getAvatarUrl(user.avatarID)
    : sticker1

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="h-[18px] bg-customyellow" />

      <div className="flex h-[82px] items-center justify-around bg-customgrey px-4">
        <NavLink to="/chats">
          <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(var(--color-customyellow))",
                          maskImage: `url(${chatIcon})`,
                          maskSize: "100% 100%",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                        }}
                      />
        </NavLink>

        <NavLink to="/schedule">
          <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(var(--color-customyellow))",
                          maskImage: `url(${scheduleIcon})`,
                          maskSize: "100% 100%",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                        }}
                      />
        </NavLink>

        <NavLink to="/">
        <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(var(--color-customyellow))",
                          maskImage: `url(${zernoIcon})`,
                          maskSize: "100% 100%",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                        }}
                      />
        </NavLink>

        <NavLink to="/sections">
          <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(var(--color-customyellow))",
                          maskImage: `url(${vectorIcon})`,
                          maskSize: "100% 100%",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                        }}
                      />
        </NavLink>

        <NavLink to={user ? '/profile' : '/login'}>
  {user?.avatarID ? (
    <img
      src={getAvatarUrl(user.avatarID)} // или getPublicUrl(user.avatarUrl), если нужно
      alt="Аватар"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: "rgb(var(--color-customyellow))",
        maskImage: `url(${profileIcon})`,
        maskSize: "100% 100%",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  )}
</NavLink>
      </div>
    </div>
  )
}