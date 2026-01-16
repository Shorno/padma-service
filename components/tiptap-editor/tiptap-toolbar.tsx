'use client'

import { useTiptapEditor } from '@/hooks/use-tiptap-editor'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Minus,
    Code,
    Link as LinkIcon,
    Unlink,
    Pilcrow,
    ChevronDown,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// --- Tiptap UI Primitives ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
import { Button } from '@/components/tiptap-ui-primitive/button'

// --- Tiptap UI Components ---
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button'

// --- Link Popover ---
import { LinkPopover } from './link-popover'

// Styles
import '@/components/tiptap-ui-primitive/toolbar/toolbar.scss'

interface TiptapToolbarProps {
    disabled?: boolean
}

export function TiptapToolbar({ disabled = false }: TiptapToolbarProps) {
    const { editor } = useTiptapEditor()

    if (!editor) return null

    return (
        <Toolbar variant="fixed">
            {/* Heading Dropdown */}
            <ToolbarGroup>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="tiptap-button"
                            data-style="ghost"
                            data-active-state={editor.isActive('heading') ? 'on' : 'off'}
                            disabled={disabled}
                            title="Text Style"
                        >
                            {editor.isActive('heading', { level: 1 }) && (
                                <>
                                    <Heading1 className="tiptap-button-icon" />
                                    <span className="tiptap-button-text">Heading 1</span>
                                </>
                            )}
                            {editor.isActive('heading', { level: 2 }) && (
                                <>
                                    <Heading2 className="tiptap-button-icon" />
                                    <span className="tiptap-button-text">Heading 2</span>
                                </>
                            )}
                            {editor.isActive('heading', { level: 3 }) && (
                                <>
                                    <Heading3 className="tiptap-button-icon" />
                                    <span className="tiptap-button-text">Heading 3</span>
                                </>
                            )}
                            {!editor.isActive('heading') && (
                                <>
                                    <Pilcrow className="tiptap-button-icon" />
                                    <span className="tiptap-button-text">Paragraph</span>
                                </>
                            )}
                            <ChevronDown className="tiptap-button-icon" style={{ marginLeft: '2px', opacity: 0.5 }} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault()
                                editor.chain().focus().setParagraph().run()
                            }}
                            className={cn(
                                'flex items-center justify-between cursor-pointer',
                                !editor.isActive('heading') && 'bg-accent'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Pilcrow className="h-4 w-4" />
                                <span>Paragraph</span>
                            </div>
                            <span className="text-xs text-muted-foreground">⌘+Alt+0</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault()
                                editor.chain().focus().toggleHeading({ level: 1 }).run()
                            }}
                            className={cn(
                                'flex items-center justify-between cursor-pointer',
                                editor.isActive('heading', { level: 1 }) && 'bg-accent'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Heading1 className="h-4 w-4" />
                                <span className="text-lg font-bold">Heading 1</span>
                            </div>
                            <span className="text-xs text-muted-foreground">⌘+Alt+1</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault()
                                editor.chain().focus().toggleHeading({ level: 2 }).run()
                            }}
                            className={cn(
                                'flex items-center justify-between cursor-pointer',
                                editor.isActive('heading', { level: 2 }) && 'bg-accent'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Heading2 className="h-4 w-4" />
                                <span className="text-base font-semibold">Heading 2</span>
                            </div>
                            <span className="text-xs text-muted-foreground">⌘+Alt+2</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault()
                                editor.chain().focus().toggleHeading({ level: 3 }).run()
                            }}
                            className={cn(
                                'flex items-center justify-between cursor-pointer',
                                editor.isActive('heading', { level: 3 }) && 'bg-accent'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Heading3 className="h-4 w-4" />
                                <span className="text-sm font-medium">Heading 3</span>
                            </div>
                            <span className="text-xs text-muted-foreground">⌘+Alt+3</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ToolbarGroup>

            <ToolbarSeparator />

            {/* Text Formatting */}
            <ToolbarGroup>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('bold') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    tooltip="Bold (⌘+B)"
                >
                    <Bold className="tiptap-button-icon" />
                </Button>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('italic') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    tooltip="Italic (⌘+I)"
                >
                    <Italic className="tiptap-button-icon" />
                </Button>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('underline') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    tooltip="Underline (⌘+U)"
                >
                    <UnderlineIcon className="tiptap-button-icon" />
                </Button>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('strike') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    tooltip="Strikethrough"
                >
                    <Strikethrough className="tiptap-button-icon" />
                </Button>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('code') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    tooltip="Inline Code"
                >
                    <Code className="tiptap-button-icon" />
                </Button>
            </ToolbarGroup>

            <ToolbarSeparator />

            {/* Link & Image */}
            <ToolbarGroup>
                <LinkPopover disabled={disabled} />
                <ImageUploadButton
                    hideWhenUnavailable={false}
                    onInserted={() => console.log('Image inserted!')}
                />
            </ToolbarGroup>

            <ToolbarSeparator />

            {/* Lists */}
            <ToolbarGroup>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('bulletList') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    tooltip="Bullet List"
                >
                    <List className="tiptap-button-icon" />
                </Button>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('orderedList') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    tooltip="Numbered List"
                >
                    <ListOrdered className="tiptap-button-icon" />
                </Button>
            </ToolbarGroup>

            <ToolbarSeparator />

            {/* Block Elements */}
            <ToolbarGroup>
                <Button
                    type="button"
                    data-style="ghost"
                    data-active-state={editor.isActive('blockquote') ? 'on' : 'off'}
                    disabled={disabled}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    tooltip="Quote"
                >
                    <Quote className="tiptap-button-icon" />
                </Button>
                <Button
                    type="button"
                    data-style="ghost"
                    disabled={disabled}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    tooltip="Horizontal Rule"
                >
                    <Minus className="tiptap-button-icon" />
                </Button>
            </ToolbarGroup>

            <ToolbarSeparator />

            {/* Undo/Redo */}
            <ToolbarGroup>
                <Button
                    type="button"
                    data-style="ghost"
                    disabled={disabled || !editor.can().undo()}
                    onClick={() => editor.chain().focus().undo().run()}
                    tooltip="Undo (⌘+Z)"
                >
                    <Undo className="tiptap-button-icon" />
                </Button>
                <Button
                    type="button"
                    data-style="ghost"
                    disabled={disabled || !editor.can().redo()}
                    onClick={() => editor.chain().focus().redo().run()}
                    tooltip="Redo (⌘+Shift+Z)"
                >
                    <Redo className="tiptap-button-icon" />
                </Button>
            </ToolbarGroup>
        </Toolbar>
    )
}
