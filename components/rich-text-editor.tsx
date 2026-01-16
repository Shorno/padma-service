'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import { TableKit } from '@tiptap/extension-table'
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
    Image as ImageIcon,
    Unlink,
    Table as TableIcon,
    TableCellsMerge,
    Trash2,
    Plus,
    Rows3,
    Columns3,
    Upload,
    Loader2,
    Link2,
    Pilcrow,
    ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useEffect, useState, useRef, useTransition, useCallback } from 'react'
import { uploadImageToCloudinary } from '@/app/actions/cloudinary'
import { toast } from 'sonner'

interface RichTextEditorProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Start writing...',
    className,
    disabled = false,
}: RichTextEditorProps) {
    const [linkUrl, setLinkUrl] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [linkPopoverOpen, setLinkPopoverOpen] = useState(false)
    const [imagePopoverOpen, setImagePopoverOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-md my-4',
                },
            }),
            Underline,
            TableKit.configure({
                tableCell: {
                    HTMLAttributes: {
                        class: 'border border-border px-3 py-2',
                    },
                },
                tableHeader: {
                    HTMLAttributes: {
                        class: 'border border-border px-3 py-2 bg-muted font-semibold text-left',
                    },
                },
                table: {
                    HTMLAttributes: {
                        class: 'border-collapse w-full my-4',
                    },
                },
            }),
        ],
        content: value,
        editable: !disabled,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
                    // Distinct heading sizes
                    'prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-6 prose-h1:mb-4',
                    'prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-5 prose-h2:mb-3',
                    'prose-h3:text-xl prose-h3:font-medium prose-h3:mt-4 prose-h3:mb-2',
                    'prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0',
                    'prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground prose-blockquote:pl-4 prose-blockquote:italic',
                    placeholder && !value ? 'before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none' : ''
                ),
                'data-placeholder': placeholder,
            },
        },
    })

    // Update editor content when value prop changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [editor, value])

    const addLink = () => {
        if (linkUrl && editor) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setLinkPopoverOpen(false)
        }
    }

    const removeLink = () => {
        if (editor) {
            editor.chain().focus().unsetLink().run()
        }
    }

    const addImageFromUrl = () => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl('')
            setImagePopoverOpen(false)
        }
    }

    const handleFileUpload = useCallback(async (file: File) => {
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            toast.error('File too large. Please upload files smaller than 5MB.')
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file.')
            return
        }

        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', 'services/content')

                const result = await uploadImageToCloudinary(formData)

                if (result.success && result.url && editor) {
                    editor.chain().focus().setImage({ src: result.url }).run()
                    toast.success('Image uploaded successfully!')
                    setImagePopoverOpen(false)
                } else {
                    if (!(result.success)) {
                        toast.error(result.error || 'Failed to upload image.')
                    }
                }
            } catch (error) {
                toast.error('An error occurred while uploading the image.')
            }
        })
    }, [editor])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileUpload(files[0])
        }
    }, [handleFileUpload])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const insertTable = () => {
        if (editor) {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
    }

    if (!editor) {
        return (
            <div className={cn('rounded-md border bg-background', className)}>
                <div className="h-[52px] border-b bg-muted/50" />
                <div className="min-h-[200px] p-4 text-muted-foreground">
                    Loading editor...
                </div>
            </div>
        )
    }

    return (
        <div className={cn(
            'rounded-md border bg-background overflow-hidden',
            disabled && 'opacity-50 cursor-not-allowed',
            className
        )}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
                {/* Heading Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant={editor.isActive('heading') ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-8 gap-1 px-2"
                            disabled={disabled}
                            title="Text Style"
                        >
                            {editor.isActive('heading', { level: 1 }) && (
                                <>
                                    <Heading1 className="h-4 w-4" />
                                    <span className="text-xs hidden sm:inline">Heading 1</span>
                                </>
                            )}
                            {editor.isActive('heading', { level: 2 }) && (
                                <>
                                    <Heading2 className="h-4 w-4" />
                                    <span className="text-xs hidden sm:inline">Heading 2</span>
                                </>
                            )}
                            {editor.isActive('heading', { level: 3 }) && (
                                <>
                                    <Heading3 className="h-4 w-4" />
                                    <span className="text-xs hidden sm:inline">Heading 3</span>
                                </>
                            )}
                            {!editor.isActive('heading') && (
                                <>
                                    <Pilcrow className="h-4 w-4" />
                                    <span className="text-xs hidden sm:inline">Paragraph</span>
                                </>
                            )}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={cn(
                                'flex items-center justify-between',
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
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={cn(
                                'flex items-center justify-between',
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
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={cn(
                                'flex items-center justify-between',
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
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={cn(
                                'flex items-center justify-between',
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

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    disabled={disabled}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    disabled={disabled}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    disabled={disabled}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    disabled={disabled}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    disabled={disabled}
                    title="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Link */}
                <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            disabled={disabled}
                            title="Add Link"
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

                {/* Image Upload */}
                <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={disabled}
                            title="Add Image"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                        <Tabs defaultValue="upload" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload" className="text-xs">
                                    <Upload className="h-3 w-3 mr-1" />
                                    Upload
                                </TabsTrigger>
                                <TabsTrigger value="url" className="text-xs">
                                    <Link2 className="h-3 w-3 mr-1" />
                                    URL
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload" className="mt-3">
                                <div
                                    className={cn(
                                        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
                                        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                                        isPending && 'pointer-events-none opacity-50'
                                    )}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        disabled={isPending}
                                    />
                                    {isPending ? (
                                        <div className="flex flex-col items-center gap-2 py-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <p className="text-sm text-muted-foreground">Uploading...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 py-2">
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Drop image here or click to browse</p>
                                                <p className="text-xs text-muted-foreground mt-1">Max 5MB • JPG, PNG, GIF, WebP</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="url" className="mt-3 space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="image-url" className="text-sm">Image URL</Label>
                                    <Input
                                        id="image-url"
                                        placeholder="https://example.com/image.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addImageFromUrl()}
                                    />
                                </div>
                                <Button size="sm" onClick={addImageFromUrl} className="w-full">
                                    Insert Image
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </PopoverContent>
                </Popover>

                {/* Table */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant={editor.isActive('table') ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            disabled={disabled}
                            title="Table"
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={insertTable}>
                            <Plus className="h-4 w-4 mr-2" />
                            Insert Table
                        </DropdownMenuItem>
                        {editor.isActive('table') && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                                    <Columns3 className="h-4 w-4 mr-2" />
                                    Add Column Before
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                                    <Columns3 className="h-4 w-4 mr-2" />
                                    Add Column After
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Column
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                                    <Rows3 className="h-4 w-4 mr-2" />
                                    Add Row Before
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                                    <Rows3 className="h-4 w-4 mr-2" />
                                    Add Row After
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Row
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
                                    <TableCellsMerge className="h-4 w-4 mr-2" />
                                    Merge Cells
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
                                    <TableCellsMerge className="h-4 w-4 mr-2" />
                                    Split Cell
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => editor.chain().focus().deleteTable().run()}
                                    className="text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Table
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    disabled={disabled}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    disabled={disabled}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Block Elements */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    disabled={disabled}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    disabled={disabled}
                    title="Horizontal Rule"
                >
                    <Minus className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled || !editor.can().undo()}
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled || !editor.can().redo()}
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    )
}

interface ToolbarButtonProps {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant={isActive ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </Button>
    )
}
