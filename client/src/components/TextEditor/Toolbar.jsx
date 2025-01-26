// Importing required modules
import React, { useCallback, useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from "lexical";

// Importing the icons and flowbite components
import { FaUndo, FaRedo } from "react-icons/fa";
import { Select } from "flowbite-react";

// Creating the Toolbar component to handle rich text editor functionality
const Toolbar = () => {
    // Hook to get the editor context from Lexical Composer
    const [editor] = useLexicalComposerContext();

    // State variables to manage the status of Toolbar buttons
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    // Low priority for the event listener
    const LowPriority = 1;

    // A callback function to update the Toolbar based on the current selection in the editor
    const $updateToolbar = useCallback(() => {
        // Get the current selection from the editor
        const selection = $getSelection();

        // Check if the selection is a range and update the Toolbar states accordingly
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
    }, []);

    // Function to handle the changes made to the Heading element style
    const handleHeadingChange = (e) => {
        // Get the selected heading type from the event
        const headingType = e.target.value;

        // Update the editor context with the selected heading style
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // Apply the selected heading style to the selected text
                $setBlocksType(selection, () => $createHeadingNode(headingType));
            }
        });
    };

    // useEffect to register event listeners when the component is mounted
    useEffect(() => {
        return mergeRegister(
            // Register an update listener to update the toolbar whenever the editor state changes
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    // Update the toolbar whenever the editor state is updated
                    $updateToolbar();
                });
            }),
            // Register a listener for selection changes in the editor
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    // Return false to continue propagating the command
                    return false;
                },
                LowPriority
            ),
            // Register a listener for undo command availability
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    // Update the undo button availability
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            // Register a listener for redo command availability
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    // Update the redo button availability
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, $updateToolbar]);

    // JSX to render the Toolbar component
    return (
        <div className="w-full px-3 py-1 flex gap-1 items-center justify-start rounded-md bg-gray-200 dark:bg-slate-700 ">
            {/* Undo and Redo buttons */}
            <div className="flex items-center justify-center gap-1 p-2 border-r border-slate-300 dark:border-slate-600">
                <button
                    type="button"
                    disabled={!canUndo}
                    onClick={() => {
                        editor.dispatchCommand(UNDO_COMMAND, undefined);
                    }}
                    className={`flex items-center justify-center p-1 rounded-md text-sm`}
                    aria-label="Undo"
                >
                    <FaUndo className={`${canUndo ? "dark:text-white" : "text-gray-400"}`} />
                </button>
                <button
                    type="button"
                    disabled={!canRedo}
                    onClick={() => {
                        editor.dispatchCommand(REDO_COMMAND, undefined);
                    }}
                    className={`flex items-center justify-center p-1 rounded-md text-sm`}
                    aria-label="Redo"
                >
                    <FaRedo className={`${canRedo ? "dark:text-white" : "text-gray-400"}`} />
                </button>
            </div>

            {/* Text Styling button :: Bold, Italic, Underline, Strikethrough */}
            <div className="flex items-center justify-center gap-1 p-2 border-r border-slate-300 dark:border-slate-600">
                <button
                    type="button"
                    className={`flex items-center justify-center font-bold p-2 rounded-md size-6 ${isBold ? "bg-slate-300 bg-opacity-45" : ""}`}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    }}
                >B</button>
                <button
                    type="button"
                    className={`flex items-center justify-center italic p-2 rounded-md size-6 ${isItalic ? "bg-slate-300 bg-opacity-45" : ""}`}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                    }}
                >i</button>
                <button
                    type="button"
                    className={`flex items-center justify-center font-semibold underline p-2 rounded-md size-6 ${isUnderline ? "bg-slate-300 bg-opacity-45" : ""}`}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                    }}
                >U</button>
                <button
                    type="button"
                    className={`flex items-center justify-center font-medium line-through p-2 rounded-md size-6 ${isStrikethrough ? "bg-slate-300 bg-opacity-45" : ""}`}
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                    }}
                >S</button>
            </div>

            {/* Dropdown for Headings style selection */}
            <div className="flex items-center justify-center gap-0 p-2 border-r border-slate-300 dark:border-slate-600">
                <Select
                    defaultValue=""
                    onChange={handleHeadingChange}
                    className="flex border-0 outline-none custom-select-menu"
                    aria-label="Heading Level"
                >
                    <option value="" disabled className="text-slate-600">Select Heading</option>
                    <option value="h1" className="text-[20px] font-[900] text-2">Heading 1</option>
                    <option value="h2" className="text-[18px] font-[800]">Heading 2</option>
                    <option value="h3" className="text-[16px] font-[700]">Heading 3</option>
                    <option value="h4" className="text-[14px] font-[700]">Heading 4</option>
                </Select>
            </div>

        </div>
    );
};

// Exporting the Toolbar component
export default Toolbar;
