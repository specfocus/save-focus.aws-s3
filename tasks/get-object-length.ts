import { type StorageLocation } from '@specfocus/save-focus/resources/location';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { type Task } from '@specfocus/spec-focus/tasks/types';
import { type S3Context } from '../../save-focus.ibm-s3/tasks/context';

export interface ObjectParams extends Pick<StorageLocation, 'match' | 'trail'> {
}

export type GetObjectLengthTask = Task<number, ObjectParams, S3Context>;

const s3GetObjectLength: GetObjectLengthTask = async (
  {
    match: Key,
    trail
  }: ObjectParams,
  {
    resolve
  }: S3Context
): Promise<number> => {
  const [Bucket, ...args] = trail;
  const s3Client = await resolve('s3Client', ...args);
  const output = await s3Client.send(
    new HeadObjectCommand({
      Bucket,
      Key
    })
  );

  const length = output.ContentLength || 0;

  return length;
};

export default s3GetObjectLength;
