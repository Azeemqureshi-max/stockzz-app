import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/stockzz/auth-layout'
import { nameFromEmail, useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Log in · Stockzz' }] }),
  component: Login,
})

function Login() {
  const { signIn } = useWorkspace()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.')
    if (!password) return setError('Enter your password.')
    signIn({ name: nameFromEmail(email), email })
    toast.success('Welcome to Stockzz', { description: 'You’re in a preview workspace.' })
    navigate({ to: '/app/suggestions' })
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your stock ideas, saved stocks and portfolio."
      footer={<>New to Stockzz? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/reset-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg">Log in</Button>
      </form>
    </AuthLayout>
  )
}
