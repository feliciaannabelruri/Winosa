import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Write your blog content here...',
  minHeight = '400px',
}) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link',
  ];

  return (
    <div className="quill-wrapper rounded-2xl overflow-hidden border border-gray-200">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ minHeight }}
      />

      <style>{`
        .quill-wrapper .ql-toolbar {
          border: none;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
          padding: 8px 12px;
          border-radius: 16px 16px 0 0;
        }
        .quill-wrapper .ql-container {
          border: none;
          font-size: 14px;
          font-family: inherit;
        }
        .quill-wrapper .ql-editor {
          min-height: ${minHeight};
          padding: 16px;
          line-height: 1.7;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          font-size: 14px;
        }
        .quill-wrapper .ql-editor h1 { font-size: 1.75rem; font-weight: 700; }
        .quill-wrapper .ql-editor h2 { font-size: 1.4rem; font-weight: 600; }
        .quill-wrapper .ql-editor h3 { font-size: 1.15rem; font-weight: 600; }
        .quill-wrapper .ql-editor blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          color: #6b7280;
          margin: 0.8rem 0;
        }
        .quill-wrapper .ql-editor pre {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;