import { Link, createFileRoute } from '@tanstack/react-router'
import { MailCheck } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/stockzz/auth-layout'

export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [{ title: 'Reset password · Stockzz' }] }),
  component: Reset,
})

function Reset() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email you signed up with."
      footer={<Link to="/login" className="font-medium text-primary hover:underline">Back to log in</Link>}
    >
      {done ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
          <MailCheck className="size-8 text-primary" aria-hidden />
          <p className="font-semibold">Request received for {email}</p>
          <p className="text-sm text-muted-foreground">
            Reset emails start sending once secure accounts are connected. In this preview no password is stored, so
            you can simply log in again.
          </p>
        </div>
      ) : (
        <form
          noValidate
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.')
            setError(null)
            setDone(true)
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg">Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  )
}
