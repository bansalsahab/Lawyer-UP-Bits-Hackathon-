import { SignUp } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const signUp = (props: Props) => {
    return (
        <div>
            <SignUp routing='hash' />
        </div>
    )
}

export default signUp