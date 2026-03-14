import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw, Code2 } from 'lucide-react'
import { Editor } from '@monaco-editor/react'

const LANGUAGES = [
  { 
    id: 'python', 
    name: 'Python', 
    template: 'def solution():\n    # Write your code here\n    pass\n\n# Call your function\nsolution()' 
  },
  { 
    id: 'javascript', 
    name: 'JavaScript', 
    template: 'function solution() {\n    // Write your code here\n}\n\n// Call your function\nsolution();' 
  },
  { 
    id: 'java', 
    name: 'Java', 
    template: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}' 
  },
  { 
    id: 'cpp', 
    name: 'C++', 
    template: '#include <iostream>\n\nint main() {\n    // Write your code here\n    return 0;\n}' 
  },
  { 
    id: 'go', 
    name: 'Go', 
    template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your code here\n}' 
  },
]

interface CodeEditorProps {
  onSubmit?: (code: string, language: string) => void
}

export function CodeEditor({ onSubmit }: CodeEditorProps) {
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [code, setCode] = useState(language.template)
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = LANGUAGES.find(l => l.id === e.target.value) || LANGUAGES[0]
    setLanguage(lang)
    setCode(lang.template)
  }

  const handleReset = () => {
    setCode(language.template)
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code, language.id)
    }
  }

  return (
    <Card className="h-full flex flex-col bg-card border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Code Editor</h3>
          </div>
          
          <select 
            value={language.id}
            onChange={handleLanguageChange}
            className="bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

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
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language.id}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>
    </Card>
  )
}
