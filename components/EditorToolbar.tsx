"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { FaEdit, FaKey, FaSave, FaShareAlt } from "react-icons/fa";
import { Quill } from "react-quill";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";


const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];
Quill.register(Font, true);

// Formats objects for setting up the Quill editor
export const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
    "clean",
    "save",
    "edit",
    "password",
];

// Quill Toolbar component
const QuillToolbar = ({ saveHandler, editHandler, passwordHandler, shareHandler, newUrl, setNewUrl, className }: any) => (
    <div id="toolbar" className={className}>
        <span className="ql-formats">
            <select className="ql-font" defaultValue="arial">
                <option value="arial">Arial</option>
                <option value="comic-sans">Comic Sans</option>
                <option value="courier-new">Courier New</option>
                <option value="georgia">Georgia</option>
                <option value="helvetica">Helvetica</option>
                <option value="lucida">Lucida</option>
            </select>
            <select className="ql-size" defaultValue="medium">
                <option value="extra-small">Size 1</option>
                <option value="small">Size 2</option>
                <option value="medium">Size 3</option>
                <option value="large">Size 4</option>
            </select>
            <select className="ql-header" defaultValue="3">
                <option value="1">Heading</option>
                <option value="2">Subheading</option>
                <option value="3">Normal</option>
            </select>
        </span>
        <span className="ql-formats hidden">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            <button className="ql-script" value="super" />
            <button className="ql-script" value="sub" />
            <button className="ql-blockquote" />
            <button className="ql-direction" />
        </span>
        <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
        </span>
        <span className="ql-formats">
            <button className="ql-formula" />
            <button className="ql-code-block" />
            <button className="ql-clean" />
        </span>
        <span className="ql-formats w-full flex items-center justify-center space-x-3">
            <button className="ql-save" onClick={saveHandler}>
                <FaSave />
            </button>
            <div className="ql-edit">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline"><FaEdit /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Update Url</DialogTitle>
                            <DialogDescription>
                                Make changes to your URL, example /haslabsb
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    new Url
                                </Label>
                                <Input
                                    id="url"
                                    defaultValue="Pedro Duarte"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={editHandler}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <button className="ql-password" onClick={passwordHandler}>
                <FaKey />
            </button>
            <button className="ql-share" onClick={shareHandler}>
                <FaShareAlt />
            </button>
        </span>
    </div>
);

export default QuillToolbar;
