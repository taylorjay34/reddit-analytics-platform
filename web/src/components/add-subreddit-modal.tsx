import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { PlusCircle } from 'lucide-react'

interface AddSubredditModalProps {
  onAdd: (subreddit: string) => void
}

export function AddSubredditModal({ onAdd }: AddSubredditModalProps) {
  const [subredditName, setSubredditName] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subredditName.trim()) {
      onAdd(subredditName.trim())
      setSubredditName('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Add Subreddit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subreddit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subreddit">Subreddit Name</Label>
            <Input
              id="subreddit"
              placeholder="e.g., ollama"
              value={subredditName}
              onChange={(e) => setSubredditName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Subreddit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 