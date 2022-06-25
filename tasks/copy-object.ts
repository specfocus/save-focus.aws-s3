import {
  PutObjectCommand,
  CopyObjectCommand,
  CopyObjectCommandInput,
  CopyObjectCommandOutput,
  ListPartsCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  ListPartsCommandInput,
  ListPartsCommandOutput,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  HeadBucketCommand,
  HeadBucketCommandInput,
  HeadBucketCommandOutput,
  HeadObjectCommand,
  HeadObjectCommandInput, 
  HeadObjectCommandOutput, 
  UploadPartCommand, 
  UploadPartCommandInput, 
  UploadPartCommandOutput, 
  ListBucketsCommand, 
  ListBucketsCommandInput, 
  ListBucketsCommandOutput, 
  ListObjectsCommand,
  ListObjectsCommandInput
} from '@aws-sdk/client-s3';
import { Action } from '@specfocus/main-focus/actions';
import Context from '../../save-focus.ibm-s3/tasks/context';

function createCommand(this: Context, action: Action) {
  const input: CopyObjectCommandInput = {
    Bucket: '',
    Key: '',
    CopySource: ''
  };
  return new CopyObjectCommand(input);
}

export default createCommand;