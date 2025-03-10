"use client"
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import React from 'react'
import { MainSection } from './main-section'
import { Separator } from '@/components/ui/separator'
import { PersonalSection } from './personal-section'
import { SheetTitle } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

export const HomeSidebar = () => {
  const isMobile = useIsMobile();
  return (
    <Sidebar className='pt-16 z-40 border-none' collapsible='icon'>
      <SidebarHeader>
        {isMobile && <SheetTitle className="sr-only">Sidebar</SheetTitle>} 
      </SidebarHeader>
      <SidebarContent className='bg-background'>
        <MainSection/>
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  )
}
