import { PutObjectCommand, type PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { type Task } from '@specfocus/spec-focus/tasks/types';
import { type S3Context } from '../../save-focus.ibm-s3/tasks/context';
import { PutObjectParams } from './put';

export type PutUrlTask = Task<string, PutObjectParams, S3Context>;

const s3PutObjectUrl: PutUrlTask = async (
  {
    match: Key,
    trail
  }: PutObjectParams,
  {
    resolve
  }: S3Context
): Promise<string> => {
  const [Bucket, ...args] = trail;
  const s3Client = await resolve('s3Client', ...args);
  const input: PutObjectCommandInput = {
    Bucket,
    Key
  };
  const url = await getSignedUrl(
    s3Client,
    new PutObjectCommand(input),
    { expiresIn: 3600 }
  );
  return url;
};

export default s3PutObjectUrl;
