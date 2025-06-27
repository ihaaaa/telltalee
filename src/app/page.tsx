"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAnalysis, getCaveImage, getOracleCaveImage } from "./actions";
import type { AnalyzeUserInputOutput } from "@/ai/flows/analyze-user-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, HeartPulse, Loader2, MessageSquareQuote, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PixelTextBubble } from "@/components/pixel-text-bubble";
import { OracleIcon } from "@/components/oracle-icon";

const formSchema = z.object({
  userInput: z.string()
    .min(1, { message: "Please share a little something." })
    .max(1000, { message: "The confidant can only process so much at once. Please keep it under 1000 characters." }),
});

const messages = [
  "What tale does your heart tell?",
  "The stars are listening...",
  "Speak, and be heard.",
  "Your thoughts are safe here.",
  "The cosmos awaits your words."
];

export default function CombinedPage() {
  const [showOracle, setShowOracle] = useState(false);
  const [bubbleText, setBubbleText] = useState(messages[0]);
  const [caveImageUrl, setCaveImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [oracleCaveImageUrl, setOracleCaveImageUrl] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<AnalyzeUserInputOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setBubbleText(messages[Math.floor(Math.random() * messages.length)]);
    
    const fetchCaveImage = async () => {
        setIsImageLoading(true);
        try {
            const result = await getCaveImage();
            if (result.data) {
                setCaveImageUrl(result.data.imageUrl);
            } else {
                toast({
                    variant: "destructive",
                    title: "Vision Unclear",
                    description: result.error || "Could not conjure a vision of the cave. Please try refreshing.",
                });
            }
        } catch (e) {
             toast({
                variant: "destructive",
                title: "Vision Unclear",
                description: "Could not conjure a vision of the cave. Please try refreshing.",
            });
        } finally {
            setIsImageLoading(false);
        }
    };
    fetchCaveImage();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: "",
    },
  });

  const handleEnterCave = () => {
    setShowOracle(true);
    if (!oracleCaveImageUrl) { // Prevent re-fetching
        getOracleCaveImage().then(result => {
            if (result.data) {
                setOracleCaveImageUrl(result.data.imageUrl);
            } else {
                toast({
                    variant: "destructive",
                    title: "Vision Unclear",
                    description: result.error || "Could not conjure a vision of the inner cave.",
                });
            }
        }).catch(() => {
             toast({
                variant: "destructive",
                title: "Vision Unclear",
                description: "Could not conjure a vision of the inner cave.",
            });
        });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const newMessages = [...userMessages, values.userInput];
    setUserMessages(newMessages);
    const combinedInput = newMessages.join('\n\n');

    try {
      const result = await getAnalysis({ userInput: combinedInput });
      if (result.error) {
        toast({ variant: "destructive", title: "An Error Occurred", description: result.error });
        setAnalysis(null);
        setUserMessages([]);
      } else {
        const newAnalysis = result.data || null;
        setAnalysis(newAnalysis);
        if (newAnalysis?.sentimentAnalysis !== 'Awaiting more details') {
          setUserMessages([]);
        }
      }
    } catch (e) {
      toast({ variant: "destructive", title: "An Unexpected Error Occurred", description: "Something went wrong. Please try again." });
      setAnalysis(null);
      setUserMessages([]);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  const isAwaitingMoreDetails = analysis?.sentimentAnalysis === 'Awaiting more details';

  return (
    <div className="relative min-h-screen">
      {/* Landing Page View */}
      <div
        className={cn( "absolute inset-0 transition-opacity duration-1000 ease-in-out", showOracle ? "opacity-0 pointer-events-none" : "opacity-100" )}
      >
        <div className="absolute inset-0 -z-10">
            {caveImageUrl && (
                <Image
                    src={caveImageUrl}
                    fill
                    alt="A mystical cave with a view of a starry night sky."
                    className="object-cover"
                />
            )}
            <div className="absolute inset-0 bg-black/60" />
        </div>
        <main
          className="relative z-10 flex flex-col items-center justify-center h-screen p-4 sm:p-8"
        >
          {isImageLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-foreground font-bold text-xl drop-shadow-md">Conjuring a vision...</p>
            </div>
          )}
          <div className="relative z-10 flex flex-col items-center text-center text-white">
            <div className="mb-8 animate-in fade-in delay-500 duration-1000">
                <div className="w-56">
                    <PixelTextBubble>{bubbleText}</PixelTextBubble>
                </div>
            </div>

            <h1 className="text-4xl font-bold font-headline text-white drop-shadow-lg">
              TELL-TALE
            </h1>
            <p className="text-lg text-gray-300 mt-4 max-w-md mx-auto drop-shadow-md">
              A quiet space to unburden your thoughts and unveil your story, deep within the crystal cave.
            </p>

            <Button
              size="lg"
              className="mt-8 bg-primary/90 hover:bg-primary text-primary-foreground text-xl px-8 py-6 rounded-none shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-foreground/50"
              onClick={handleEnterCave}
              disabled={isImageLoading}
            >
              Enter the Cave
            </Button>
          </div>
        </main>
      </div>
      
      {/* Oracle Page View */}
      <div
        className={cn( "absolute inset-0 transition-opacity duration-1000 ease-in-out", showOracle ? "opacity-100 z-20" : "opacity-0 pointer-events-none" )}
      >
        <div className="absolute inset-0 z-0">
          {oracleCaveImageUrl && (
              <Image
                  src={oracleCaveImageUrl}
                  fill
                  alt="A mystical cave with glowing pink and blue crystals."
                  className="object-cover animate-in fade-in duration-1000"
              />
          )}
          <div className="absolute inset-0 bg-black/60" />
          {!oracleCaveImageUrl && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          )}
        </div>
        <main className="relative z-10 flex flex-col items-center h-screen overflow-y-auto px-4 sm:px-8">
          <div className="w-full max-w-2xl mx-auto py-12">
            <header className="flex flex-col items-center text-center mb-8">
              <OracleIcon className="w-24 h-24 mb-4" />
              <h1 className="text-3xl font-bold font-headline text-foreground">
                TELL-TALE
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Share your thoughts, and see what tale they tell.
              </p>
            </header>

            <Card className="shadow-lg rounded-none border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Tell Your Tale</CardTitle>
                <CardDescription className="text-base">
                  {isAwaitingMoreDetails ? "The confidant is listening patiently." : "Describe your current feelings. Your words are safe here."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAwaitingMoreDetails && (
                    <div className="mb-4 p-3 bg-secondary rounded-none text-secondary-foreground text-base">
                        <p className="italic">{analysis?.advice}</p>
                    </div>
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="userInput"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Your thoughts</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={isAwaitingMoreDetails ? "Please tell me more..." : "Tell me what is on your mind..."}
                              className="resize-none min-h-[120px] text-base rounded-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-primary/90 hover:bg-primary rounded-none text-lg py-6" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isLoading ? "Analyzing..." : (isAwaitingMoreDetails ? "Share More" : "Share Your Tale")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {isLoading && !analysis && (
              <div className="text-center mt-8 flex items-center justify-center text-muted-foreground text-base">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing your tale...
              </div>
            )}

            {analysis && !isAwaitingMoreDetails && (
              <div className="mt-8 space-y-6 animate-in fade-in-50 duration-500">
                {analysis.crisisDetected && (
                  <Alert variant="destructive" className="rounded-none border-2">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle className="text-lg">Important: Immediate Support Recommended</AlertTitle>
                    <AlertDescription className="text-base">
                      It sounds like you are going through a very difficult time. Please know that help is available. Consider reaching out to a crisis hotline or a mental health professional.
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="rounded-none border-2">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <HeartPulse className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle className="text-xl">Sentiment Analysis</CardTitle>
                        <CardDescription className="text-base">The tone of your tale.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold" style={{color: "hsl(var(--accent-foreground))"}}>{analysis.sentimentAnalysis}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-2">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <MessageSquareQuote className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle className="text-xl">A New Perspective</CardTitle>
                        <CardDescription className="text-base">Insight tailored for you.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-base">{analysis.advice}</p>
                  </CardContent>
                </Card>

                {analysis.resources && (
                  <div className="text-center pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-none text-base py-5 px-6">
                          <BookOpen className="mr-2" />
                          View Helpful Resources
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-none border-2">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Helpful Resources</DialogTitle>
                          {analysis.resourceTips && (
                            <DialogDescription className="text-base pt-1">
                                {analysis.resourceTips}
                            </DialogDescription>
                          )}
                        </DialogHeader>
                        <div className="py-4 whitespace-pre-wrap leading-relaxed text-base text-muted-foreground">
                            {analysis.resources}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
