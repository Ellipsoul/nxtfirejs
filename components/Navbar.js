import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import hackerPic from '../public/hacker.png';
import { UserContext } from '../lib/context';

// Navbar, visible on all pages
export default function Navbar() {
    // Hook into the provided context, will be updated when dependent components are re-rendered
    const { user, username } = useContext(UserContext);

    return (
        <nav className='navbar'>
            <ul>
                {/* Home button, visible to all users */}
                <li>
                    <Link href='/' passHref>
                        <button className='btn-logo'>Home</button>
                    </Link>
                </li>

                {/* Dynamic display depending on whether the user is signed in */}
                { username ? 
                <>
                    {/* Goes to 'admin' page where user can write posts */}
                    <li className='push-left'>
                        <Link href='/admin' passHref>
                            <button className='btn-blue'>Write Posts</button>
                        </Link>
                    </li>
                    {/* Links to user profile */}
                    <li>
                        <Link href={`/${username}`} passHref>
                            <Image src={user ? user.photoURL : hackerPic} alt="" width={100} height={100}/>
                        </Link>
                    </li>
                </> : 
                <li> {/* User not logged in, render a sign in button */}
                    <Link href='/enter' passHref>
                        <button className='btn-blue'>Log In</button>
                    </Link>
                </li>
                }
            </ul>
        </nav>
    )
}
