"use client"
import { Document } from '@prisma/client';
import * as AWS from 'aws-sdk';
import * as aws from "aws-sdk/lib/maintenance_mode_message.js";
import axios from 'axios';
import * as crypto from 'crypto';
import dynamic from 'next/dynamic';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import type ReactQuill from 'react-quill';
import { useRouter } from 'next/navigation'
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats } from "./EditorToolbar";
import { useToast } from "@/components/ui/use-toast"

aws.suppress = true;

const modules = dynamic(() => import("./EditorToolbar"), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

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

// const INITIAL = `<p>Hello</p><p>How are you?</p><p>are you okay?</p><p>Love you</p><p><br></p><p><img src=\"https://pub-867c2a8b0bb046428323e9ca7550be21.r2.dev/91a215ee17Group 140.png\"></p>`





const RichTextEditor = ({ props }: { props: Document }) => {
  const { toast } = useToast()
  const router = useRouter()
  const [value, setValue] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const quillRef = useRef<ReactQuill>(null)
  let fetchOnce = false;

  useEffect(() => {
    if (props?.data_doc && !fetchOnce) {
      fetchOnce = true
      setValue(props.data_doc);
    }
  }, [])

  useEffect(() => {
    console.log(JSON.stringify(value));
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

  const saveHandler = async () => {
    try {
      console.log("value", value)
      if (value) {
        const res = await axios.post('/api/document', {
          id: props?.id,
          data_doc: value,
          isPassword: false,
          password: ""
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const result = await res.data;
        setValue(res.data.data_doc);
        toast({
          variant: 'success',
          title: "Success",
          description: "Document saved",
        })
        // console.log("Success:", result);
        // alert("success");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Ooops, something error",
      })
    }
  }

  const editHandler = async () => {
    try {
      const res = await axios.put('/api/document', {
        id: props?.id,
        newId: newUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await res.data;
      toast({
        variant: 'success',
        title: "Success",
        description: "Document url updated",
      })
      if (result) {
        setTimeout(() => {
          router.push(`/${newUrl}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Ooops, something error",
      })
    }
  }

  const modules = React.useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar",
        handlers: {
          image: imageHandler,
        }
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
      }
    };
  }, []);

  return (
    <div>
      <EditorToolbar saveHandler={saveHandler} editHandler={editHandler} setNewUrl={setNewUrl} newUrl={newUrl} />
      <ReactQuillBase forwardedRef={quillRef}
        className='w-full'
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder={"Write something awesome..."}
        formats={formats} />
    </div>
  );
}

export default RichTextEditor