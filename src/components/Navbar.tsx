import { toggleUnit } from '../features/settingsSlice'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { WiDaySunny } from 'react-icons/wi'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const unit = useSelector((state: RootState) => state.settings.unit)

  const navigate = useNavigate();

  const handleToggle = useCallback(() => {
    dispatch(toggleUnit())
  }, [dispatch])

  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-xl
        bg-white/70
        border-b border-blue-100
        shadow-sm
      "
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">


        <div className="flex items-center gap-2 group cursor-pointer">
          <WiDaySunny className="text-blue-500 text-3xl group-hover:rotate-12 transition" />
          <div className="flex  leading-tight items-end">
            <span className="text-xl font-bold text-gray-700">
              Weather
            </span>
            <span className="text-xl text-blue-600 font-bold ">
              Man
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <span
            onClick={()=>navigate('/')}
           className="hover:text-blue-600  text-slate-600 transition cursor-pointer">
            Dashboard
          </span>

          <button
            onClick={handleToggle}
            className="
              flex items-center gap-2
              px-3 py-1.5 rounded-full 
              bg-blue-50 text-blue-600 
              text-sm font-semibold
              border border-blue-100
              hover:bg-blue-100 
              active:scale-95
              transition
            "
          >
            <span>{unit === 'celsius' ? '°C' : '°F'}</span>
          </button>

          
        </div>
      </div>

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
    </header>
  )
}