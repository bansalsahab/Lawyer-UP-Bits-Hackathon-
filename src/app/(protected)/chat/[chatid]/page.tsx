'use client'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { UserButton } from '@clerk/nextjs'
import { ArrowUp, ChevronDown, MessageCircleDashed, Plus, SquarePen } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import MDEditor from "@uiw/react-md-editor"
import { ScrollArea } from '@/components/ui/scroll-area'

interface History {
    title: string | null;
    id: string;
    messages: {
        prompt: string;
        response: string;
        id: string;
    }[];
}[]

const ChatPage = () => {
    const [prompt, setPrompt] = useState<string | null>('')
    const { open } = useSidebar()
    const { data: History, isLoading } = api.chat.getHistory.useQuery()
    const { chatid } = useParams<{ chatid: string }>()
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const { data: chatPresent } = api.chat.isChat.useQuery({ chatId: chatid })
    const createGroup = api.chat.createChat.useMutation()
    const refetch = useRefetch()
    const [localMessages, setLocalMessages] = useState<{ prompt: string; response: string; id: string }[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [save, setSave] = useState(false);


    const currentChat = History?.find(chat => chat.id === chatid)

    // Sync local messages with server data
    useEffect(() => {
        if (currentChat?.messages) {
            setLocalMessages(currentChat.messages)
        }
    }, [currentChat])

    const handleSelection = (option: string) => {
        setSelectedOption(prev => (prev === option ? null : option))
    }

    const handleChatCreation = () => {
        // Your existing creation logic
    }

    const generateTitle = (prompt: string, maxWords = 5) => {
        const words = prompt.trim().split(/\s+/)
        return words.length > maxWords ?
            words.slice(0, maxWords).join(' ') + ' ...' :
            prompt
    }

    // Generate a comprehensive demo response with bullet points and code snippets
    const generateDemoResponse = (prompt: string) => {
        // Create base response that incorporates the user's prompt
        let baseResponse = `Thank you for your query about "${prompt}". Here's a comprehensive analysis:\n\n`;

        // Add bullet points similar to AI-generated content
        baseResponse += "Key considerations for implementation:\n\n";
        baseResponse += "• The proposed solution should integrate seamlessly with your existing architecture, minimizing disruption to current workflows.\n\n";
        baseResponse += "• Scalability must be prioritized to accommodate future growth and increasing data volumes.\n\n";
        baseResponse += "• Security considerations should include end-to-end encryption for all message transmissions.\n\n";
        baseResponse += "• Performance optimization is critical, particularly for the message chunking mechanism to ensure smooth user experience.\n\n";
        baseResponse += "• Cross-platform compatibility will ensure consistent functionality across different devices and browsers.\n\n";

        // Add recommendations section with more bullet points
        baseResponse += "Recommended implementation approach:\n\n";
        baseResponse += "• Adopt a microservices architecture to separate messaging functionality from other system components.\n\n";
        baseResponse += "• Implement WebSocket connections for real-time message delivery rather than traditional HTTP requests.\n\n";
        baseResponse += "• Utilize a caching layer to improve response times for frequently accessed message history.\n\n";
        baseResponse += "• Consider implementing progressive loading patterns for message history to improve initial load times.\n\n";

        // Add JavaScript code example
        baseResponse += "Here's a code implementation for the chunked message delivery system:\n\n";
        baseResponse += "```javascript\n";
        baseResponse += "// Message chunking implementation\nclass MessageChunker {\n  constructor(message, chunkSize = 50, delayMs = 100) {\n    this.message = message;\n    this.chunkSize = chunkSize;\n    this.delayMs = delayMs;\n    this.chunks = this.prepareChunks();\n  }\n\n  prepareChunks() {\n    const totalChunks = Math.ceil(this.message.length / this.chunkSize);\n    const chunks = [];\n    \n    for (let i = 0; i < totalChunks; i++) {\n      const start = i * this.chunkSize;\n      const end = Math.min(start + this.chunkSize, this.message.length);\n      chunks.push(this.message.substring(start, end));\n    }\n    \n    return chunks;\n  }\n\n  async streamToUI(updateCallback) {\n    let accumulatedText = '';\n    \n    for (const chunk of this.chunks) {\n      await new Promise(resolve => setTimeout(resolve, this.delayMs));\n      accumulatedText += chunk;\n      updateCallback(accumulatedText);\n    }\n    \n    return accumulatedText;\n  }\n}\n```\n\n";

        // Add React component example
        baseResponse += "For the frontend implementation, consider this React component:\n\n";
        baseResponse += "```jsx\nfunction StreamingMessage({ messageId, initialContent, streamingContent }) {\n  const [content, setContent] = useState(initialContent || '');\n  const [isComplete, setIsComplete] = useState(false);\n  const [streamProgress, setStreamProgress] = useState(0);\n  \n  useEffect(() => {\n    if (!streamingContent) return;\n    \n    let isMounted = true;\n    const chunker = new MessageChunker(streamingContent);\n    \n    const streamToComponent = async () => {\n      await chunker.streamToUI((text) => {\n        if (isMounted) {\n          setContent(text);\n          setStreamProgress(Math.floor((text.length / streamingContent.length) * 100));\n        }\n      });\n      \n      if (isMounted) {\n        setIsComplete(true);\n      }\n    };\n    \n    streamToComponent();\n    \n    return () => {\n      isMounted = false;\n    };\n  }, [streamingContent]);\n  \n  return (\n    <div className=\"message-container\">\n      <div className=\"message-content\">\n        {content || <span className=\"placeholder\">Loading...</span>}\n        {!isComplete && <span className=\"cursor\">|</span>}\n      </div>\n      {!isComplete && (\n        <div className=\"progress-container\">\n          <div \n            className=\"progress-bar\" \n            style={{ width: `${streamProgress}%` }} \n          />\n        </div>\n      )}\n    </div>\n  );\n}\n```\n\n";

        // Add database schema example
        baseResponse += "Proposed database schema for message storage:\n\n";
        baseResponse += "```sql\nCREATE TABLE chats (\n  id VARCHAR(255) PRIMARY KEY,\n  user_id VARCHAR(255) NOT NULL,\n  title VARCHAR(255) NOT NULL DEFAULT 'New Chat',\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  INDEX idx_user_id (user_id)\n);\n\nCREATE TABLE messages (\n  id VARCHAR(255) PRIMARY KEY,\n  chat_id VARCHAR(255) NOT NULL,\n  prompt TEXT NOT NULL,\n  response LONGTEXT NOT NULL,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,\n  INDEX idx_chat_id (chat_id)\n);\n```\n\n";

        // Add conclusion
        baseResponse += "In conclusion, the implementation of a chunked message delivery system will significantly enhance the user experience by providing immediate feedback and creating a more natural conversation flow. The architecture outlined above balances performance, scalability, and maintainability to ensure a robust solution for your messaging requirements.\n\n";

        return baseResponse;
    };

    // Updated function with chunked message handling
    const handleFormSubmit = async () => {
        if (!prompt) return;
        setPrompt('')
        setSave(true);
        const newPrompt = prompt;
        const fullResponse = generateDemoResponse(newPrompt);

        // Create a temporary message ID for this conversation
        const tempMessageId = Date.now().toString();

        // Initialize with empty response
        setLocalMessages(prev => [
            ...prev,
            { prompt: newPrompt, response: "", id: tempMessageId }
        ]);

        // Simulate chunked response by breaking the full response into pieces
        const chunkSize = 50; // Characters per chunk
        const totalChunks = Math.ceil(fullResponse.length / chunkSize);

        try {
            let accumulatedResponse = "";

            // Process response in chunks
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, fullResponse.length);
                const chunk = fullResponse.substring(start, end);

                // Add delay to simulate streaming
                await new Promise(resolve => setTimeout(resolve, 100));

                // Update accumulated response
                accumulatedResponse += chunk;

                // Update the message with the current accumulated response
                setLocalMessages(prev =>
                    prev.map(msg =>
                        msg.id === tempMessageId
                            ? { ...msg, response: accumulatedResponse }
                            : msg
                    )
                );
            }

            // Once all chunks are processed, save to database
            if (chatPresent) {
                await createGroup.mutateAsync({
                    chatId: chatid,
                    prompt: newPrompt,
                    response: fullResponse
                }, {
                    onSuccess: () => {
                        refetch();
                    }
                });
            } else {
                await createGroup.mutateAsync({
                    chatId: chatid,
                    prompt: newPrompt,
                    response: fullResponse,
                    title: generateTitle(newPrompt)
                }, {
                    onSuccess: () => {
                        refetch();
                    }
                });
            }
        } catch (error) {
            // Rollback local messages on error
            setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
            toast.error("Failed to send message");
        }

    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "end" })
        }
    }, [localMessages])

    return (
        <div className='h-screen flex flex-col'>
            {/* Header remains unchanged */}
            <div className='sticky min-h-18 px-4 flex border border-b-gray-400 rounded-b-3xl items-center justify-between'>
                <div className='flex gap-x-2'>
                    {!open && (
                        <div className='flex items-center gap-x-1'>
                            <SidebarTrigger />
                            <span className='hover:cursor-pointer' onClick={handleChatCreation}>
                                <SquarePen size={20} />
                            </span>
                        </div>
                    )}
                    <Button className='flex gap-x-1.5 border-0 border-none p-3' variant={'ghost'}>
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

            {/* Chat messages section */}
            <div className="flex-1 flex flex-col">
                <ScrollArea className='max-h-[500px] w-full rounded-3xl'>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="w-7/12 mx-auto space-y-4">
                            {localMessages.map((message) => (
                                <React.Fragment key={message.id}>
                                    {/* User Message */}
                                    <div className="flex justify-end animate-fade-in">
                                        <div className="max-w-[70%] bg-zinc-500 text-white p-3 rounded-3xl">
                                            {message.prompt}
                                        </div>
                                    </div>
                                    {/* AI Response */}
                                    <div className="flex justify-start animate-fade-in">
                                        <div className=" bg-transparent  p-3 rounded-lg">
                                            <MDEditor.Markdown
                                                style={{
                                                    padding: '2px',
                                                    backgroundColor: 'transparent',
                                                    color: 'dimgray',
                                                    width: '100%'
                                                }}

                                                source={message.response}
                                                className='w-full'
                                            />
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div
                        ref={messagesEndRef}
                    />
                </ScrollArea>



                {/* Input section */}
                <div className={`w-7/12 mx-auto ${currentChat?.messages?.length ? 'mt-auto py-4' : 'flex-1 flex flex-col items-center justify-center'}`}>
                    {!currentChat?.messages?.length && !save && (
                        <h1 className="text-2xl mb-4">What can I help with?</h1>
                    )}
                    <div className="text-center w-full rounded-4xl border-2 p-2 border-gray-600">
                        <Textarea
                            className="w-full rounded-2xl max-h-40 border-none focus:outline-none focus:ring-0 focus:border-transparent"
                            placeholder='Ask anything'
                            value={prompt ?? ''}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <div className='flex mt-2 items-center justify-between'>
                            <div className="flex gap-x-2">
                                <Button className="w-fit rounded-full" variant="outline">
                                    <Plus />
                                </Button>
                                <Button
                                    className={`rounded-full cursor-pointer ${selectedOption === 'hello1' ? 'text-white' : 'text-black'}`}
                                    variant={selectedOption === "hello1" ? "secondary" : "outline"}
                                    onClick={() => handleSelection("hello1")}
                                >
                                    Employ
                                </Button>
                                <Button
                                    className={`rounded-full cursor-pointer ${selectedOption === 'hello2' ? 'text-white' : 'text-black'}`}
                                    variant={selectedOption === "hello2" ? "secondary" : "outline"}
                                    onClick={() => handleSelection("hello2")}
                                >
                                    Lease
                                </Button>
                                <Button
                                    className={`rounded-full cursor-pointer ${selectedOption === 'hello2' ? 'text-white' : 'text-black'}`}
                                    variant={selectedOption === "hello2" ? "secondary" : "outline"}
                                    onClick={() => handleSelection("hello2")}
                                >
                                    Licence
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={handleFormSubmit}
                                    className='w-10 h-10 rounded-full'>
                                    <ArrowUp />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPage