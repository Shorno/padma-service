'use client'

import { useState } from 'react'
import { useTiptapEditor } from '@/hooks/use-tiptap-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Link as LinkIcon, Unlink } from 'lucide-react'

interface LinkPopoverProps {
    disabled?: boolean
}

export function LinkPopover({ disabled = false }: LinkPopoverProps) {
    const { editor } = useTiptapEditor()
    const [open, setOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')

    if (!editor) return null

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setOpen(false)
        }
    }

    const removeLink = () => {
        editor.chain().focus().unsetLink().run()
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    disabled={disabled}
                    title="Add Link (⌘+K)"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
                <div className="space-y-2">
                    <p className="text-sm font-medium">Insert Link</p>
                    <Input
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addLink()}
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={addLink}>Add Link</Button>
                        {editor.isActive('link') && (
                            <Button size="sm" variant="outline" onClick={removeLink}>
                                <Unlink className="h-4 w-4 mr-1" />
                                Remove
                            </Button>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
