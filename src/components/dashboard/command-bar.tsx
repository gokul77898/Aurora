'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Search, Bot } from 'lucide-react';
import { getFleetCommandResponse } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';

export default function CommandBar() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleQuery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    setResponse('');
    try {
      const result = await getFleetCommandResponse({ query: input });
      setResponse(result.response);
    } catch (error) {
        console.error(error);
        setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Ask the fleet...</span>
        <span className="inline-flex lg:hidden">Ask...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <form onSubmit={handleQuery}>
            <CommandInput
            placeholder="Ask about your fleet... e.g. 'Which trains are in maintenance?'"
            value={input}
            onValueChange={setInput}
            />
        </form>
        <CommandList>
          {!loading && !response && <CommandEmpty>No results found.</CommandEmpty>}
          {loading && (
             <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
             </div>
          )}
          {response && !loading && (
            <CommandItem disabled className='py-2 px-4'>
                <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                        {response}
                    </p>
                </div>
            </CommandItem>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
