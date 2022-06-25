import type { GetObjectCommandInput } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { PullTask } from '@specfocus/spec-focus/tasks/types';
import type { S3Context } from '../../save-focus.ibm-s3/tasks/context';
import { Readable } from 'stream';
import { ObjectParams } from './get-object-length';

export interface GetObjectParams extends ObjectParams {
  skip?: number;
  take?: number;
}

export type GetObjectTask = PullTask<Buffer, GetObjectParams, S3Context>;

const s3GetObject: GetObjectTask = async function* (
  {
    match: Key,
    trail,
    skip,
    take
  }: GetObjectParams,
  {
    resolve
  }: S3Context
): AsyncGenerator<Buffer> {
  const [Bucket, ...args] = trail;
  const s3Client = await resolve('s3Client', ...args);
  const input: GetObjectCommandInput = {
    Bucket,
    Key
  };
  
  if (skip || take) {
    const min = skip || 0;
    const max = take ? String(min + take - 1) : '';
    input.Range = `bytes=${min}-${max}`;
  }
  
  const output = await s3Client.send(
    new GetObjectCommand(input)
  );
  const stream = output.Body as Readable;
  
  if (!stream) {
    return;
  }
  
  for await (const chunk of stream) {
    yield typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
  }
};

export default s3GetObject;
