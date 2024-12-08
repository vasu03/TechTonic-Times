// Importing the required module
import React, { useState, useEffect } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import DOMPurify from 'dompurify';

// Importing the custom components
import Toolbar from './Toolbar.jsx';

// Error handler for Lexical editor
const onError = (error) => {
	console.error('Lexical Error:', error);
};

// Component to update editor content in real-time
const EditorContentUpdater = ({ setContent }) => {
	// hook to get the context to lexical editor 
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const updateContent = () => {
			let htmlContent = '';
			// Read the current editor state and generate HTML
			editor.getEditorState().read(() => {
				htmlContent = $generateHtmlFromNodes(editor);
			});
			// Sanitize the generated HTML content
			const sanitizedContent = DOMPurify.sanitize(htmlContent, {
				ALLOWED_TAGS: ['img', 'p', 'div', 'span', 'b', 'i', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'a'],
				ALLOWED_ATTR: ['src', 'alt', 'href', 'title', 'class', 'style'],
			});
			setContent(htmlContent);
		};

		// Register a listener to update content on editor state change
		const unregister = editor.registerUpdateListener(() => {
			updateContent();
		});

		// Cleanup function to unregister the listener
		return () => {
			unregister();
		};
	}, [editor, setContent]);

	// This component does not render any UI
	return null;
};

// Main Editor component
const Editor = ({ onSave }) => {
	// State to hold the current editor content
	const [content, setContent] = useState('');

	// Configuration for the Lexical editor
	const initialConfig = {
		namespace: 'MyEditor', 	// Unique identifier for this editor
		theme: editorTheme, 	// Theme object for styling the editor
		nodes: [HeadingNode], 	// Register custom nodes 
		onError, // Error handler
	};

	// Effect to handle content save logic when it changes
	useEffect(() => {
		if (onSave) {
			// Invoke the save callback with updated content
			onSave(content);
		}
	}, [content, onSave]);

	return (
		<div className="w-full mx-auto bg-slate-50 dark:bg-slate-800 rounded-lg h-[80vh] p-5 flex flex-col items-center gap-2">
			{/* LexicalComposer is the parent container for the editor */}
			<LexicalComposer initialConfig={initialConfig}>
				{/* Toolbar component for additional editor actions */}
				<Toolbar />
				{/* RichTextPlugin provides rich text editing capabilities */}
				<RichTextPlugin
					contentEditable={
						<ContentEditable className="focus:outline-none rounded-lg h-full w-full p-3 bg-white dark:bg-[#334155aa] dark:text-white" />
					}
					ErrorBoundary={LexicalErrorBoundary} // Handles rendering errors in the editor
				/>
				{/* Adds undo/redo functionality */}
				<HistoryPlugin />
				{/* Automatically focuses on the editor when it mounts */}
				<AutoFocusPlugin />
				{/* Updates content in real-time */}
				<EditorContentUpdater setContent={setContent} />
			</LexicalComposer>
		</div>
	);
};

// Theme configuration for the editor
const editorTheme = {
	ltr: 'ltr',
	rtl: 'rtl',
	paragraph: 'editor-paragraph',
	quote: 'editor-quote',
	heading: {
		h1: 'text-3xl font-extrabold',
		h2: 'text-2xl font-extrabold',
		h3: 'text-xl font-bold',
		h4: 'text-base font-bold',
	},
	list: {
		nested: {
			listitem: 'editor-nested-listitem',
		},
		ol: 'editor-list-ol',
		ul: 'editor-list-ul',
		listitem: 'editor-listItem',
		listitemChecked: 'editor-listItemChecked',
		listitemUnchecked: 'editor-listItemUnchecked',
	},
	hashtag: 'editor-hashtag',
	image: 'editor-image',
	link: 'editor-link',
	text: {
		bold: 'font-bold',
		code: 'editor-textCode',
		italic: 'italic',
		strikethrough: 'line-through',
		subscript: 'editor-textSubscript',
		superscript: 'editor-textSuperscript',
		underline: 'underline',
		underlineStrikethrough: 'underline line-through',
	},
	code: 'editor-code',
	codeHighlight: {
		atrule: 'editor-tokenAttr',
		attr: 'editor-tokenAttr',
		boolean: 'editor-tokenProperty',
		builtin: 'editor-tokenSelector',
		cdata: 'editor-tokenComment',
		char: 'editor-tokenSelector',
		class: 'editor-tokenFunction',
		'class-name': 'editor-tokenFunction',
		comment: 'editor-tokenComment',
		constant: 'editor-tokenProperty',
		deleted: 'editor-tokenProperty',
		doctype: 'editor-tokenComment',
		entity: 'editor-tokenOperator',
		function: 'editor-tokenFunction',
		important: 'editor-tokenVariable',
		inserted: 'editor-tokenSelector',
		keyword: 'editor-tokenAttr',
		namespace: 'editor-tokenVariable',
		number: 'editor-tokenProperty',
		operator: 'editor-tokenOperator',
		prolog: 'editor-tokenComment',
		property: 'editor-tokenProperty',
		punctuation: 'editor-tokenPunctuation',
		regex: 'editor-tokenVariable',
		selector: 'editor-tokenSelector',
		string: 'editor-tokenSelector',
		symbol: 'editor-tokenProperty',
		tag: 'editor-tokenProperty',
		url: 'editor-tokenOperator',
		variable: 'editor-tokenVariable',
	}
};

export default Editor;
