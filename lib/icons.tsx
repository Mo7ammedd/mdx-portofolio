import { Icons } from '@/components/icons'
import React from 'react'

export type IconName = 'github' | 'globe' | 'linkedin' | 'x' | 'twitter' | 'youtube' | 'notion' | 'openai' | 'googleDrive' | 'whatsapp'

export const getIcon = (iconName: string, className?: string): React.ReactNode => {
  const iconClass = className || 'size-3'
  
  switch (iconName.toLowerCase()) {
    case 'github':
      return <Icons.github className={iconClass} />
    case 'globe':
    case 'website':
    case 'link':
      return <Icons.globe className={iconClass} />
    case 'linkedin':
      return <Icons.linkedin className={iconClass} />
    case 'x':
    case 'twitter':
      return <Icons.x className={iconClass} />
    case 'youtube':
      return <Icons.youtube className={iconClass} />
    case 'notion':
      return <Icons.notion className={iconClass} />
    case 'openai':
      return <Icons.openai className={iconClass} />
    case 'googledrive':
    case 'drive':
      return <Icons.googleDrive className={iconClass} />
    case 'whatsapp':
      return <Icons.whatsapp className={iconClass} />
    case 'email':
      return <Icons.email className={iconClass} />
    default:
      return <Icons.github className={iconClass} />
  }
}
