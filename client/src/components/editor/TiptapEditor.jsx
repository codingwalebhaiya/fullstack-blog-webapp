
import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

const TiptapEditor = ({
  value,
  onChange,
  placeholder = "Start writing your amazing story...",
  height = "500px",
}) => {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "code-block",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image rounded-lg max-w-full h-auto shadow-sm",
        },
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link text-blue-600 hover:text-blue-800 underline transition-colors",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none p-6 min-h-[400px] bg-white",
        style: `min-height: ${height}`,
      },
    },
  });

  // Improved Link Functionality
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const selectedText = editor.state.selection.empty ? "" : editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    const url = window.prompt(
      "Enter URL" + (selectedText ? ` for "${selectedText}"` : ""),
      previousUrl
    );

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Validate URL format
    let formattedUrl = url;
    if (!url.match(/^https?:\/\//)) {
      formattedUrl = `https://${url}`;
    }

    // If there's selected text, wrap it with link
    if (selectedText) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formattedUrl })
        .run();
    } else {
      // If no text selected, insert link with URL as text
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${formattedUrl}</a>`)
        .run();
    }
  }, [editor]);

  // Remove Link
  const unsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  // Improved YouTube Video Embedding
  const addYouTube = useCallback(() => {
    if (!editor) return;

    const url = prompt("Enter YouTube URL");

    if (!url) return;

    // Extract video ID from various YouTube URL formats
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    )?.[1];

    if (videoId) {
      // Create a safe YouTube embed wrapper
      const youtubeWrapper = document.createElement('div');
      youtubeWrapper.className = 'youtube-embed my-6 p-4 bg-gray-50 rounded-lg border border-gray-200';
      youtubeWrapper.setAttribute('data-youtube-id', videoId);
      
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.width = '100%';
      iframe.height = '400';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'rounded-lg shadow-md';
      
      youtubeWrapper.appendChild(iframe);
      
      const caption = document.createElement('p');
      caption.className = 'text-sm text-gray-500 mt-2 text-center';
      caption.textContent = 'YouTube Video';
      youtubeWrapper.appendChild(caption);

      // Insert the YouTube embed at current cursor position
      editor.chain().focus().insertContent(youtubeWrapper.outerHTML).run();
    } else {
      alert("Please enter a valid YouTube URL");
    }
  }, [editor]);

  // Image Upload Functionality
  const handleImageUpload = useCallback(() => {
    if (!editor) return;
    fileInputRef.current?.click();
  }, [editor]);

  const onImageUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      // Here you would typically upload to your server
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      
      // Insert image at current position
      editor
        .chain()
        .focus()
        .setImage({ 
          src: imageUrl,
          alt: file.name,
          title: file.name 
        })
        .run();

      // In a real app, you would:
      // 1. Upload to your server
      // 2. Get back the actual URL
      // 3. Update the image src with the actual URL
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [editor]);

  // Blockquote
  const toggleBlockquote = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBlockquote().run();
  }, [editor]);

  // Horizontal Rule
  const addHorizontalRule = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const toggleInlineCode = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const clearFormatting = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  const pasteAsPlainText = useCallback(() => {
    if (!editor) return;

    navigator.clipboard
      .readText()
      .then((text) => {
        editor.chain().focus().insertContent(text).run();
      })
      .catch((err) => {
        console.error("Failed to read clipboard: ", err);
      });
  }, [editor]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white" style={{ height }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  const EditorButton = ({
    onClick,
    active,
    title,
    children,
    disabled = false,
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
        ${active
          ? "bg-blue-500 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}
      `}
      title={title}
    >
      {children}
    </button>
  );

  const ToolbarSection = ({ children, title }) => (
    <div className="flex items-center gap-1 p-2 bg-white rounded-lg border border-gray-200">
      {children}
    </div>
  );

  return (
    <div className="tiptap-editor bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Enhanced Toolbar */}
      <div className="editor-toolbar border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex flex-wrap items-center gap-3">
        {/* Text Formatting */}
        <ToolbarSection title="Text Formatting">
          <EditorButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <span className="font-bold text-base">B</span>
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <span className="italic text-base">I</span>
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <span className="underline text-base">U</span>
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <span className="line-through text-base">S</span>
          </EditorButton>
        </ToolbarSection>

        {/* Headings */}
        <ToolbarSection title="Headings">
          <EditorButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <span className="text-lg font-bold">H1</span>
          </EditorButton>
          <EditorButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <span className="text-base font-bold">H2</span>
          </EditorButton>
          <EditorButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <span className="text-sm font-bold">H3</span>
          </EditorButton>
        </ToolbarSection>

        {/* Lists & Blocks */}
        <ToolbarSection title="Lists & Blocks">
          <EditorButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <span className="text-lg">•</span>
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <span className="text-base">1.</span>
          </EditorButton>
          <EditorButton
            onClick={toggleBlockquote}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <span className="text-lg">❝</span>
          </EditorButton>
          <EditorButton
            onClick={addHorizontalRule}
            title="Horizontal Rule"
          >
            <span className="text-lg">―</span>
          </EditorButton>
        </ToolbarSection>

        {/* Code */}
        <ToolbarSection title="Code">
          <EditorButton
            onClick={toggleInlineCode}
            active={editor.isActive("code")}
            title="Inline Code"
          >
            <code className="text-sm px-1">{"</>"}</code>
          </EditorButton>
          <EditorButton
            onClick={toggleCodeBlock}
            active={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <code className="text-sm px-1">{"{ }"}</code>
          </EditorButton>
        </ToolbarSection>

        {/* Alignment */}
        <ToolbarSection title="Alignment">
          <EditorButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            ⬅
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            ⬇
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            ➡
          </EditorButton>
        </ToolbarSection>

        {/* Media */}
        <ToolbarSection title="Media">
          <EditorButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="Insert Link"
          >
            <span className="text-lg">🔗</span>
          </EditorButton>
          
          {editor.isActive("link") && (
            <EditorButton
              onClick={unsetLink}
              title="Remove Link"
            >
              <span className="text-lg">🚫</span>
            </EditorButton>
          )}
          
          <EditorButton 
            onClick={handleImageUpload} 
            title="Upload Image"
          >
            <span className="text-lg">🖼️</span>
          </EditorButton>
          
          <EditorButton onClick={addYouTube} title="Insert YouTube Video">
            <span className="text-lg">📺</span>
          </EditorButton>
        </ToolbarSection>

        {/* Actions */}
        <ToolbarSection title="Actions">
          <EditorButton onClick={pasteAsPlainText} title="Paste as Plain Text">
            <span className="text-lg">📋</span>
          </EditorButton>
          <EditorButton onClick={clearFormatting} title="Clear Formatting">
            <span className="text-lg">✨</span>
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <span className="text-lg">↩️</span>
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <span className="text-lg">↪️</span>
          </EditorButton>
        </ToolbarSection>
      </div>

      {/* Enhanced Editor Content */}
      <div className="editor-content bg-gradient-to-br from-white to-gray-50" style={{ height }}>
        <EditorContent 
          editor={editor} 
          className="h-full overflow-auto"
        />
      </div>

      {/* Enhanced Footer */}
      <div className="editor-footer border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Words: {
                editor
                  .getText()
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Characters: {editor.getText().length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
