'use client'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { SquarePen } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

type ChatData = {
    title: string,
    chatId: string
}[]

const sampleTest: ChatData = [
    {
        title: 'temp chat 1',
        chatId: '123',
    },
    {
        title: 'temp chat 2',
        chatId: '124',
    },
    {
        title: 'temp chat 3',
        chatId: '125',
    },
]

const AppSidebar = () => {
    const { open } = useSidebar();
    const pathname = usePathname()
    const router = useRouter();
    let uuid;


    const handleChatCreation = () => {
        // console.log(crypto.randomUUID())
        uuid = crypto.randomUUID();
        router.push(`/chat/${uuid}`)
    }

    return (
        <Sidebar className='min-h-screen'>
            <SidebarHeader>
                {open && (
                    <div className='flex items-center justify-between p-2'>
                        <SidebarTrigger size={'lg'} />
                        <span className='hover:cursor-pointer'
                            onClick={handleChatCreation}
                        >
                            <SquarePen size={20} />
                        </span>
                    </div>
                )}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        History
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sampleTest.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            className={cn({
                                                '!bg-primary !text-white': pathname === `/chat/${item.chatId}`
                                            }, 'list-none')}
                                            href={`/chat/${item.chatId}`}
                                        >
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar