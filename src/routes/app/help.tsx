import { createFileRoute } from '@tanstack/react-router'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const Route = createFileRoute('/app/help')({
  head: () => ({ meta: [{ title: 'Help · Stockzz' }] }),
  component: Help,
})

const FAQ = [
  ['Can I buy or sell stocks in Stockzz?', 'No. Stockzz is a research and monitoring tool. It never places trades or connects to your brokerage account.'],
  ['Are the suggestions financial advice?', 'No. Suggestions are starting points for your own research, based on your stated preferences and available information. Always do your own checks before investing.'],
  ['What does “DEMO DATA” mean?', 'It marks sample values used to preview the app. They are not real prices, results or news. Real figures will show their source, timestamp and whether they are live or delayed.'],
  ['What is an investment thesis?', 'A short note on why you invested and what would change your mind. Stockzz keeps every version so you can see how your thinking evolved.'],
  ['How do alerts work?', 'Stockzz periodically checks verified sources for the companies you monitor and only alerts you when something meaningful happens. It does not monitor in real time.'],
  ['Is my data private?', 'Yes. Your saved stocks, portfolio, theses and alerts belong to your account only.'],
]

function Help() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Help</h1>
        <p className="mt-1 text-muted-foreground">Quick answers about how Stockzz works.</p>
      </div>
      <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5">
        {FAQ.map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
