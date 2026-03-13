'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw } from 'lucide-react'

interface CodeEditorProps {
  onSubmit?: (code: string) => void
}

export function CodeEditor({ onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(`def twoSum(nums, target):
    # Write your solution here
    pass

# Example usage:
# nums = [2, 7, 11, 15]
# target = 9
# print(twoSum(nums, target))`)

  const handleReset = () => {
    setCode(`def twoSum(nums, target):
    # Write your solution here
    pass

# Example usage:
# nums = [2, 7, 11, 15]
# target = 9
# print(twoSum(nums, target))`)
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code)
    }
  }

  return (
    <Card className="h-full flex flex-col bg-card border border-border">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
        <h3 className="font-semibold text-foreground">Code Editor</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSubmit} className="gap-2">
            <Play className="w-4 h-4" />
            Submit
          </Button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 p-4 bg-background text-foreground font-mono text-sm resize-none focus:outline-none border-0"
        placeholder="Write your code here..."
        spellCheck="false"
      />
    </Card>
  )
}
