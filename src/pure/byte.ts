import {b64Encode} from "./base64.ts";

interface BlobType{
    "text": string;
    "base64": string;
    "byte": Uint8Array;
    "buffer": ArrayBuffer;
    "stream": ReadableStream<Uint8Array>;
}

/**
* Convert from blob to specified data type.
* @example
* ```ts
* const file = new File(["my-text"], "example.txt");
* const data = await blobConvert(file, "text");
* ```
*/
export async function blobConvert<T extends keyof BlobType>(blob:Blob, type:T):Promise<BlobType[T]>{
    switch(type){
        case "text": return <BlobType[T]>await blob.text();
        case "base64": return <BlobType[T]>b64Encode(new Uint8Array(await blob.arrayBuffer()));
        case "byte": return <BlobType[T]>new Uint8Array(await blob.arrayBuffer());
        case "buffer": return <BlobType[T]>await blob.arrayBuffer();
        case "stream": return <BlobType[T]>blob.stream();
        default: throw new Error();
    }
}

/**
* Concat multiple buffer sources into single Uint8Array.
* @example
* ```ts
* const byte = byteConcat(new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]));
* ```
*/
export function byteConcat(...sources:BufferSource[]):Uint8Array{
    const output = new Uint8Array(sources.reduce((n, {byteLength}) => n + byteLength , 0));

    let i = 0;
    for(const source of sources){
        output.set(new Uint8Array("buffer" in source ? source.buffer : source), i);
        i += source.byteLength;
    }

    return output;
}