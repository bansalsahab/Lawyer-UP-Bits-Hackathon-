import { SignIn } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const signIn = (props: Props) => {
    return (
        <div className='flex justify-center items-center'>
            <SignIn routing='hash' />
        </div>
    )
}

export default signIn