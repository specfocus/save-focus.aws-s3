import { GetObjectCommand, type GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { type Task } from '@specfocus/spec-focus/tasks/types';
import { type S3Context } from '../../save-focus.ibm-s3/tasks/context';
import { type GetObjectParams } from './get-object';

export type GetObjectUrlTask = Task<string, GetObjectParams, S3Context>;

const s3GetObjectUrl: GetObjectUrlTask = async (
  {
    match: Key,
    trail,
    skip,
    take
  }: GetObjectParams,
  {
    resolve
  }: S3Context
): Promise<string> => {
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

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand(input),
    { expiresIn: 3600 }
  );

  return url;
};

export default s3GetObjectUrl;
