'use client'

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

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

export default function EditorTiny({ value, onChange }) {
    const editorRef = useRef<any>(null);

    const handlePrint = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();

            const printWindow = window.open('', '', 'width=800,height=600');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                        <title>Visualização do Documento</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                        </style>
                        </head>
                        <body>
                        ${content}
                        <script>
                            window.onload = function () {
                            window.print();
                            }
                        </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
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
                menubar: true,
                plugins: [
                    'link',
                    'image',
                    'preview',
                    'code',
                    'table',
                    'lists',
                ],
                toolbar:
                    'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code preview',
                skin: false,
                content_css: false,    
            }}

        />
    )
}