"use client"
import * as AWS from 'aws-sdk';
import * as aws from "aws-sdk/lib/maintenance_mode_message.js";
import * as crypto from 'crypto';
import dynamic from 'next/dynamic';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import type ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats, useModules } from "./EditorToolbar";
aws.suppress = true;

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      return <RQ ref={forwardedRef} {...props} />
    }

    return QuillJS
  },
  {
    ssr: false,
  },
)


const AWS_S3_BUCKET = "haslabs";
const s3 = new AWS.S3({
  region: "auto",
  accessKeyId: process.env.NEXT_PUBLIC_accessKeyId,
  secretAccessKey: process.env.NEXT_PUBLIC_secretAccessKey,
  endpoint: process.env.NEXT_PUBLIC_S3_endpoint,
});

const INITIAL = `<p>Hello</p><p>How are you?</p><p>are you okay?</p><p>Love you</p><p><br></p><p><img src=\"https://pub-867c2a8b0bb046428323e9ca7550be21.r2.dev/91a215ee17Group 140.png\"></p>`


const RichTextEditor = () => {
  const [value, setValue] = useState('');
  const quillRef = useRef<ReactQuill>(null)

  useEffect(() => {
    setValue(INITIAL);
  }, [])

  useEffect(() => {
    console.log(value);
  }, [value])

  const imageHandler = () => {

    const editor = (quillRef as any)?.current.getEditor();
    if (typeof document !== 'undefined') {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = (input as any)?.files[0];
        if (/^image\//.test(file.type)) {
          console.log(file);
          const key = crypto.randomBytes(5).toString('hex') + file.name;
          const url = "https://pub-867c2a8b0bb046428323e9ca7550be21.r2.dev";
          const linkUrl = `${url}/${key}`;
          const params: AWS.S3.Types.PutObjectRequest = {
            Bucket: AWS_S3_BUCKET,
            Key: key,
            Body: file,
            ContentType: file.type,
            ACL: 'public-read',
          };
          const data: any = await s3.putObject(params).promise();
          console.log(data)
          if (data) {
            editor.insertEmbed(editor.getSelection(), "image", linkUrl);
          }
        } else {
          console.log('You could only upload images.');
        }
      };
    }
  }

  const saveHandler = () => {
    alert("save");
  }

  const editHandler = () => {
    alert("edit");
  }

  return (
    <div>
      <EditorToolbar />
      <ReactQuillBase forwardedRef={quillRef}
        className='w-full'
        theme="snow"
        value={value}
        onChange={setValue}
        modules={useModules({ imageHandler, saveHandler, editHandler })}
        placeholder={"Write something awesome..."}
        formats={formats} />
    </div>
  );
}

export default RichTextEditor