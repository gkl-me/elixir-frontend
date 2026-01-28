'use client'

import { logoutAction } from "../actions/auth.action"

export  default  function  OnboardingPage(){


    const handle = async () => {
        await logoutAction()
    }


    return(
        <div>
            onboarding page
            <div>
                <button onClick={handle}>logout</button>
            </div>
        </div>
    )
}