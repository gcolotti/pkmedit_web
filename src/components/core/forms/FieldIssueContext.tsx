import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

const FieldIssueContext = createContext<Set<string>>(new Set())

export function FieldIssueProvider({
  children,
  paths,
}: {
  children: ReactNode
  paths: Set<string>
}) {
  return (
    <FieldIssueContext.Provider value={paths}>
      {children}
    </FieldIssueContext.Provider>
  )
}

export function useFieldIssue(path?: string) {
  const paths = useContext(FieldIssueContext)
  const invalid = Boolean(
    path &&
    [...paths].some(
      (issuePath) =>
        path === issuePath ||
        path.startsWith(`${issuePath}.`) ||
        issuePath.startsWith(`${path}.`),
    ),
  )
  const labelClassName = invalid ? ' text-rose-600 dark:text-rose-300' : ''
  const fieldClassName = invalid
    ? ' border-rose-500 text-rose-700 focus:border-rose-500 dark:border-rose-400 dark:text-rose-200'
    : ''

  return { fieldClassName, invalid, labelClassName }
}
