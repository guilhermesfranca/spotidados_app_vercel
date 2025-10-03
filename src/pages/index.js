import Image from 'next/image';
import Link from 'next/link'

export default function Home() { 
    return (
        <div className="min-h-screen bg-black text-white flex justify-center">
            <div className="w-full flex flex-col items-center justify-center max-w-md p-8 bg-gradient-to-br from-pink-500 via-orange-500 to-red-600 shadow-lg">
                <Image 
                    src="/logo.png" 
                    alt="Spotidados Logo" 
                    width={180} 
                    height={120} 
                    className="mb-6 animate-pulse" 
                />
                <h2 className="text-3xl font-bold text-white mb-2 text-center">
                    Welcome to Spotidados
                </h2>
                <p className="text-white mb-6 text-center">
                    Log in to explore your music stats!
                </p>
                <Link
                    href="/homePage" 
                    className="bg-white text-pink-500 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
                >
                    Enter
                </Link>
            </div>
        </div>  
    )
}