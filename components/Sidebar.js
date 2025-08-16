'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()
  const [activeNarrative, setActiveNarrative] = useState(true)
  
  const menuItems = [
    { name: 'Dashboard', icon: '/images/menu.png', href: '/' },
    { name: 'Narratives', icon: '/images/narr.png', href: '/narratives', active: true, hasSubmenu: true },
    { name: 'Collections', icon: '/images/coll.png', href: '/collections' },
    { name: 'Messaging', icon:'/images/message.png' , href: '/messaging' },
    { name: 'Payment', icon: '/images/pay.png', href: '/payment' },
    { name: 'Campaigns', icon: '/images/camp.png', href: '/campaigns', hasSubmenu: true },
    { name: 'Subscriptions', icon: '/images/subs.png', href: '/subscriptions' },
    { name: 'Settings', icon: '/images/set.png', href: '/settings' },
  ]

  const narrativeSubmenu = [
    { name: 'Create Narrative', href: '/narratives/create' },
    { name: 'Active Narratives', href: '/narratives/active' },
  ]

  const campaignSubmenu = [
    { name: 'Campaign Account', href: '/campaigns/account' },
    { name: 'User management', href: '/campaigns/users' },
  ]

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src='/images/logo.png' />
          <div>
            <div className="font-bold text-gray-900">NARRATIVES</div>
            <div className="text-xs text-gray-500">CONTENT CREATOR</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith(item.href) && item.href !== '/' || item.active
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <img className="" src={item.icon} />
              <span className="font-medium">{item.name}</span>
            </Link>
            
            {/* Submenu for Narratives */}
            {item.name === 'Narratives' && activeNarrative && (
              <div className="ml-6 mt-1 space-y-1">
                {narrativeSubmenu.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      pathname === subItem.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{subItem.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Submenu for Campaigns */}
            {item.name === 'Campaigns' && (
              <div className="ml-6 mt-1 space-y-1">
                {campaignSubmenu.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{subItem.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      {/* <div className="p-4 border-t border-gray-200">
        <Link
          href="/logout"
          className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Log Out</span>
        </Link>
        
        <div className="mt-4 p-3 bg-blue-600 rounded-lg text-white">
          <div className="text-sm font-medium mb-2">Upgrade to PRO to get access to all features!</div>
          <button className="w-full bg-white text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div> */}
    </div>
  )
}

export default Sidebar