'use client';

import { loginAction } from '@/src/lib/actions/auth.actions';
import { initialLoginState } from '@/src/lib/actions/auth.state';
import { useActionState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

type LoginFormProps = {
  redirectTo?: string;
};

function getFieldError(
  errors: Record<string, string[] | undefined> | undefined,
  field: string,
) {
  return errors?.[field]?.[0];
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo ?? '/admin'} />

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-white">
          Email admin
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@email.com"
          autoComplete="email"
          disabled={isPending}
          required
        />
        {getFieldError(state.errors, 'email') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'email')}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-white">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="La tua password"
          autoComplete="current-password"
          disabled={isPending}
          required
        />
        {getFieldError(state.errors, 'password') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'password')}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {state.message}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Accesso in corso...' : 'Accedi'}
      </Button>
    </form>
  );
}