
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton,SignOutButton } from '@clerk/clerk-react';

function App() {
  

  return (
    <>
     <h1>Welcome to TalentMeet</h1>
    <SignedOut>
      <SignInButton mode='modal'>
        <button>Sign up</button>
      </SignInButton>
    </SignedOut>

    <SignedIn>
      <SignOutButton />
    </SignedIn>

     <UserButton/>

    </>
  )
}

export default App
