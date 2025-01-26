import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// Importing custom componenets
import Toolbar from './Toolbar.jsx';

const sanitizeContent = (htmlContent) => {
	return DOMPurify.sanitize(htmlContent, {
		ALLOWED_TAGS: ['img', 'p', 'div', 'span', 'b', 'i', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'a'],
		ALLOWED_ATTR: ['src', 'alt', 'href', 'title', 'class', 'style'],
	});
};

const EditorContentUpdater = React.memo(({ setContent }) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const updateContent = () => {
			let htmlContent = '';
			editor.getEditorState().read(() => {
				htmlContent = $generateHtmlFromNodes(editor);
			});
			const sanitizedContent = sanitizeContent(htmlContent);
			setContent(sanitizedContent);
		};

		const unregister = editor.registerUpdateListener(() => {
			updateContent();
		});

		return () => {
			unregister();
		};
	}, [editor, setContent]);

	return null;
});

const Editor = ({ onSave }) => {
	const [content, setContent] = useState('');

	const initialConfig = useMemo(
		() => ({
			namespace: 'MyEditor',
			theme: editorTheme,
			nodes: [HeadingNode],
			onError: (error) => console.error('Lexical Error:', error),
		}),
		[]
	);

	const handleSave = useCallback(() => {
		if (onSave) {
			onSave(content);
		}
	}, [content, onSave]);

	useEffect(() => {
		handleSave();
	}, [content, handleSave]);

	return (
		<div className="w-full mx-auto bg-slate-50 dark:bg-slate-800 rounded-lg h-[80vh] p-5 flex flex-col items-center gap-2">
			<LexicalComposer initialConfig={initialConfig}>
				<Toolbar />
				<RichTextPlugin
					contentEditable={
						<ContentEditable className="focus:outline-none rounded-lg h-full w-full p-3 bg-white dark:bg-[#334155aa] dark:text-white" />
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
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
	},
};

export default React.memo(Editor);
