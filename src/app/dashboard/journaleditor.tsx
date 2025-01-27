"use client"

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from "@/components/ui/button"

interface JournalEditorProps {
  onSave: (content: string) => void;
}

export default function JournalEditor({ onSave }: JournalEditorProps) {
  const [content, setContent] = useState("")
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <div className="prose prose-sm max-w-none">
        <EditorContent 
          editor={editor} 
          className="min-h-[200px] focus:outline-none"
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => onSave(content)}>Save Entry</Button>
      </div>
    </div>
  )
}