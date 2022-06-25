import type { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Readable from '@specfocus/main-focus/async/readable';
import type { Task } from '@specfocus/spec-focus/tasks/types';
import type { S3Context } from '../../save-focus.ibm-s3/tasks/context';
import { ObjectParams } from './get-object-length';

export interface PutObjectParams extends ObjectParams {
  content: AsyncIterable<Uint8Array>;
}

export type ChecksumCRC32 = string | undefined;

export type PutTask = Task<
  ChecksumCRC32,
  PutObjectParams,
  S3Context
>;

const s3Put: PutTask = async (
  {
    content,
    match: Key,
    trail
  }: PutObjectParams,
  {
    resolve
  }: S3Context
): Promise<ChecksumCRC32> => {
  const [Bucket, ...args] = trail;
  const s3Client = await resolve('s3Client', ...args);
  const input: PutObjectCommandInput = {
    Body: Readable(content),
    Bucket,
    Key
  };

  const output = await s3Client.send(
    new PutObjectCommand(input)
  );

  return output.ChecksumCRC32;
};

export default s3Put;
