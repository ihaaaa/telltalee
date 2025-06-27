
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OracleIcon } from '@/components/oracle-icon';
import { CaveEntranceIcon } from '@/components/cave-entrance-icon';

export default function LandingPage() {
  return (
    <div className="dark">
      <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://placehold.co/1920x1080.png" 
            data-ai-hint="starry night" 
            alt="Starry night sky" 
            className="object-cover w-full h-full opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center text-white">
          <div className="relative w-64 h-64 mb-4 group">
            <CaveEntranceIcon className="absolute inset-0 w-full h-full text-foreground/5" />
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <OracleIcon className="w-24 h-24 text-primary" />
            </div>
          </div>

          <h1 className="text-5xl font-bold font-headline text-white drop-shadow-lg">
            The Mindful Oracle Awaits
          </h1>
          <p className="text-gray-300 mt-4 max-w-md mx-auto">
            Step into the cave of reflection. A quiet space to explore your thoughts and find clarity.
          </p>

          <Link href="/oracle" passHref>
            <Button size="lg" className="mt-8 bg-primary/90 hover:bg-primary text-primary-foreground text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Enter the Cave
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
