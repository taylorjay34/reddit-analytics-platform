import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card'

interface SubredditCardProps {
  name: string
  description?: string
}

export function SubredditCard({ name, description }: SubredditCardProps) {
  return (
    <Link href={`/${name}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">r/{name}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
} 