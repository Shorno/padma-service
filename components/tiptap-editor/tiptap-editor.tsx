'use client'

import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import { TableKit } from '@tiptap/extension-table'
import { cn } from '@/lib/utils'

// --- Tiptap Node Extensions ---
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension'
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils'

// --- Toolbar Components ---
import { TiptapToolbar } from './tiptap-toolbar'

// Styles
import '@/components/tiptap-node/image-upload-node/image-upload-node.scss'

interface TiptapEditorProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export default function TiptapEditor({
    value = '',
    onChange,
    placeholder = 'Start writing...',
    className,
    disabled = false,
}: TiptapEditorProps) {
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
            ImageUploadNode.configure({
                accept: 'image/*',
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error('Upload failed:', error),
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
                ),
                'data-placeholder': placeholder,
            },
        },
    })

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
        <EditorContext.Provider value={{ editor }}>
            <div className={cn(
                'rounded-md border bg-background overflow-hidden',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}>
                {/* Toolbar - uses EditorContext */}
                <TiptapToolbar disabled={disabled} />

                {/* Editor Content */}
                <EditorContent editor={editor} role="presentation" />
            </div>
        </EditorContext.Provider>
    )
}
