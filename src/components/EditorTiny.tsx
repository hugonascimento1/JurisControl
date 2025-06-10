'use client';

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/skins/ui/oxide/skin.css';
import html2pdf from 'html2pdf.js';

export default function EditorTiny({ value, onChange }) {
  const editorRef = useRef<any>(null);

  const gerarPDF = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent({ format: 'html' });

      const style = `
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
          }
          p {
            margin: 8px 0;
          }
          h1, h2, h3, h4 {
            margin-top: 20px;
            margin-bottom: 10px;
          }
        </style>
      `;

      const elemento = document.createElement('div');
      elemento.innerHTML = style + content;
      elemento.style.padding = '20px';
      document.body.appendChild(elemento);

      html2pdf()
        .from(elemento)
        .set({
          margin: 10,
          filename: 'documento.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .save()
        .then(() => {
          document.body.removeChild(elemento); // limpa após salvar
        });
    }
  };

  return (
    <Editor
      licenseKey="gpl"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 430,
        // language: 'pt_BR',
        menubar: 'file edit insert format tools',
        plugins: [
          'link',
          'image',
          'preview',
          'code',
          'table',
          'lists',
        ],
        toolbar:
          'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code preview | downloadpdf',
        skin: false,
        content_css: false,
        setup: (editor) => {
          editor.ui.registry.addButton('downloadpdf', {
            text: 'Exportar PDF',
            icon: 'export-pdf',
            onAction: () => gerarPDF(),
          });
        },
      }}
    />
  );
}
