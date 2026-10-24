import {inflateSync} from 'node:zlib';
const crcTable=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);return c>>>0});
function crc32(bytes:Uint8Array):number {let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
/** Bounded PNG structure, CRC and scanline validation; no rendering or colour-profile execution. */
export function pngSize(bytes: Uint8Array): { width: number; height: number } {
  const b=Buffer.from(bytes);
  if(b.length<33||b.length>2*1024*1024||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw new Error('Sticker must be a PNG under 2 MiB.');
  let offset=8,width=0,height=0,depth=0,color=0,interlace=0,header=false,ended=false,hasPalette=false,idatEnded=false;
  const compressed:Buffer[]=[];
  while(offset+12<=b.length){
    const n=b.readUInt32BE(offset),type=b.toString('ascii',offset+4,offset+8);
    if(offset+12+n>b.length)throw new Error('Truncated PNG.');
    if(type==='acTL')throw new Error('Animated PNG is not supported.');
    if(!/^[A-Za-z]{4}$/.test(type)||crc32(b.subarray(offset+4,offset+8+n))!==b.readUInt32BE(offset+8+n))throw new Error('Invalid PNG chunk or CRC.');
    if(!header&&type!=='IHDR')throw new Error('Invalid PNG header.');
    if(type==='IHDR'){
      if(header||n!==13)throw new Error('Invalid PNG header.');
      header=true;width=b.readUInt32BE(offset+8);height=b.readUInt32BE(offset+12);depth=b[offset+16];color=b[offset+17];interlace=b[offset+20];
      const depths:Record<number,number[]>={0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]};
      if(!width||!height||width>2048||height>2048||!depths[color]?.includes(depth)||b[offset+18]!==0||b[offset+19]!==0||interlace>1)throw new Error('Invalid or oversized PNG.');
    }else if(type==='PLTE'){
      if(hasPalette||compressed.length||n===0||n%3||n>768)throw new Error('Invalid PNG palette.');hasPalette=true;
    }else if(type==='IDAT'){
      if(idatEnded)throw new Error('Noncontiguous PNG image data.');compressed.push(b.subarray(offset+8,offset+8+n));
    }else if(type==='IEND'){
      if(n!==0||!compressed.length)throw new Error('PNG has no image data.');ended=true;offset+=12;break;
    }else if(/^[A-Z]/.test(type))throw new Error('Unsupported critical PNG chunk.');
    if(compressed.length&&type!=='IDAT')idatEnded=true;
    offset+=n+12;
  }
  if(!ended||offset!==b.length||(color===3&&!hasPalette))throw new Error('Incomplete PNG.');
  const channels:Record<number,number>={0:1,2:3,3:1,4:2,6:4};
  const passes=interlace?[[0,0,8,8],[4,0,8,8],[0,4,4,8],[2,0,4,4],[0,2,2,4],[1,0,2,2],[0,1,1,2]]:[[0,0,1,1]];
  const rows:Array<{count:number;bytes:number}>=[];let expected=0;
  for(const[x,y,dx,dy]of passes){const w=Math.max(0,Math.ceil((width-x)/dx)),h=Math.max(0,Math.ceil((height-y)/dy));if(!w||!h)continue;const bytes=Math.ceil(w*channels[color]*depth/8);rows.push({count:h,bytes});expected+=h*(bytes+1);}
  const scanlines=inflateSync(Buffer.concat(compressed),{maxOutputLength:expected+1});
  if(scanlines.length!==expected)throw new Error('Invalid PNG scanline length.');
  let at=0;for(const row of rows)for(let i=0;i<row.count;i++){if(scanlines[at]>4)throw new Error('Invalid PNG scanline filter.');at+=row.bytes+1;}
  return {width,height};
}
