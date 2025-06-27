"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { getAnalysis } from "../actions";
import type { AnalyzeUserInputOutput } from "@/ai/flows/analyze-user-input";
import { OracleIcon } from "@/components/oracle-icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, HeartPulse, Loader2, MessageSquareQuote, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  userInput: z.string()
    .min(1, { message: "Please share a little something." })
    .max(1000, { message: "The oracle can only process so much at once. Please keep it under 1000 characters." }),
});

export default function OraclePage() {
  const [analysis, setAnalysis] = useState<AnalyzeUserInputOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const newMessages = [...userMessages, values.userInput];
    setUserMessages(newMessages);
    const combinedInput = newMessages.join('\n\n');

    try {
      const result = await getAnalysis({ userInput: combinedInput });
      if (result.error) {
        toast({
          variant: "destructive",
          title: "An Error Occurred",
          description: result.error,
        });
        setAnalysis(null);
        setUserMessages([]); // Reset on error
      } else {
        const newAnalysis = result.data || null;
        setAnalysis(newAnalysis);
        if (newAnalysis?.sentimentAnalysis !== 'Awaiting more details') {
          // Full analysis received, clear for next time.
          setUserMessages([]);
        }
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "An Unexpected Error Occurred",
        description: "Something went wrong on our end. Please try again.",
      });
      setAnalysis(null);
      setUserMessages([]); // Reset on error
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  const isAwaitingMoreDetails = analysis?.sentimentAnalysis === 'Awaiting more details';

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 transition-colors duration-500">
      <div className="w-full max-w-2xl mx-auto">
        <header className="flex flex-col items-center text-center mb-8">
          <OracleIcon className="mb-4" />
          <h1 className="text-4xl font-bold font-headline text-foreground">
            Mindful Oracle
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts, and let the Oracle offer you a moment of clarity.
          </p>
        </header>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Consult the Oracle</CardTitle>
            <CardDescription>
              {isAwaitingMoreDetails
                ? "The Oracle is listening patiently for more details."
                : "Describe your current feelings or situation below. Your words are safe here."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAwaitingMoreDetails && (
                <div className="mb-4 p-3 bg-secondary rounded-md text-secondary-foreground">
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
                          className="resize-none min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary/90 hover:bg-primary" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Consulting..." : (isAwaitingMoreDetails ? "Share More" : "Ask for Guidance")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && !analysis && (
          <div className="text-center mt-8 flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            The Oracle is contemplating...
          </div>
        )}

        {analysis && !isAwaitingMoreDetails && (
          <div className="mt-8 space-y-6 animate-in fade-in-50 duration-500">
            {analysis.crisisDetected && (
              <Alert variant="destructive" className="rounded-xl">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Important: Immediate Support Recommended</AlertTitle>
                <AlertDescription>
                  It sounds like you are going through a very difficult time. Please know that help is available.
                  Consider reaching out to a crisis hotline or a mental health professional. You are not alone.
                </AlertDescription>
              </Alert>
            )}

            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center gap-4">
                <HeartPulse className="w-8 h-8 text-primary" />
                <div>
                    <CardTitle>Sentiment Analysis</CardTitle>
                    <CardDescription>How your words feel to the Oracle.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold" style={{color: "hsl(var(--accent-foreground))"}}>{analysis.sentimentAnalysis}</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center gap-4">
                <MessageSquareQuote className="w-8 h-8 text-primary" />
                <div>
                    <CardTitle>The Oracle's Advice</CardTitle>
                    <CardDescription>Wisdom tailored for you.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{analysis.advice}</p>
              </CardContent>
            </Card>

            {analysis.resources && (
              <div className="text-center pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <BookOpen className="mr-2" />
                      View Helpful Resources
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Helpful Resources</DialogTitle>
                      {analysis.resourceTips && (
                        <DialogDescription>
                            {analysis.resourceTips}
                        </DialogDescription>
                      )}
                    </DialogHeader>
                    <div className="py-4 whitespace-pre-wrap leading-relaxed text-sm text-muted-foreground">
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
  );
}
