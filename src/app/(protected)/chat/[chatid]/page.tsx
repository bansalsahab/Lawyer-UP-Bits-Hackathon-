'use client'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { UserButton } from '@clerk/nextjs'
import { ArrowUp, ChevronDown, MessageCircleDashed, Plus, SquarePen } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const ChatPage = (props: Props) => {

    const { open } = useSidebar();

    const { chatid } = useParams()
    const [selectedOption, setSelectedOption] = useState<string | null>(null)

    const handleSelection = (option: string) => {
        setSelectedOption(prev => (prev === option ? null : option)) // Toggle selection
    }

    return (
        <div className='h-screen flex flex-col '>
            <div className='h-18 px-4 flex border border-b-gray-400 rounded-b-3xl items-center justify-between'>

                <div className='flex gap-x-2'>
                    {
                        !open && (
                            <div className='flex items-center gap-x-1'>
                                <SidebarTrigger />
                                <span className='hover:cursor-pointer'>
                                    <SquarePen size={20} />
                                </span>
                            </div>
                        )
                    }

                    <Button className='flex gap-x-1.5 border-0 border-none p-3' variant={'ghost'} >
                        <span className='text-xl cursor-pointer'>LawyerUP</span>
                        <ChevronDown size={20} />
                    </Button>
                </div>

                <div className='flex gap-x-2'>
                    <Button className='flex gap-x-0.5 rounded-full items-center justify-center' variant={'outline'}>
                        <MessageCircleDashed size={10} />
                        <p>Temporary</p>
                    </Button>
                    <UserButton />
                </div>
            </div>

            {/* chat section of the chatgpt */}
            <div className="flex-1 flex flex-col items-center justify-center w-7/12 mx-auto">
                <h1 className="text-2xl">What can I help with?</h1>
                <div className="text-center w-full rounded-2xl border p-2 border-black">
                    <Textarea
                        className="w-full rounded-2xl max-h-40 border-none focus:outline-none focus:ring-0 focus:border-transparent"
                        placeholder='Asy anything'
                    />

                    <div className='flex mt-2 items-center justify-between'>
                        <div className="flex gap-x-2">
                            {/* Plus Icon Button */}
                            <Button className="w-fit rounded-full" variant="outline">
                                <Plus />
                            </Button>

                            {/* First hello button */}
                            <Button
                                className={`rounded-full cursor-pointer ${selectedOption === 'hello1' ? 'text-white' : 'text-black'} `}
                                variant={selectedOption === "hello1" ? "secondary" : "outline"}
                                onClick={() => handleSelection("hello1")}
                            >
                                {chatid}
                            </Button>

                            {/* Second hello button */}
                            <Button
                                className={`rounded-full cursor-pointer ${selectedOption === 'hello2' ? 'text-white' : 'text-black'} `}
                                variant={selectedOption === "hello2" ? "secondary" : "outline"}
                                onClick={() => handleSelection("hello2")}
                            >
                                hello
                            </Button>
                        </div>
                        <div>
                            <Button className='w-10 h-10 rounded-full'>
                                <ArrowUp />
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ChatPage