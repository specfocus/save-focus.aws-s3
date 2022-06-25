import { DeleteBucketCommand, type DeleteBucketCommandInput } from '@aws-sdk/client-s3';
import type { StorageLocation } from '@specfocus/save-focus/resources/location';
import type { Task } from '@specfocus/spec-focus/tasks/types';
import type { S3Context } from '../../save-focus.ibm-s3/tasks/context';

export interface DeleteBucketParams extends Pick<StorageLocation, 'trail'> {
}

export type DeleteBucketTask = Task<void, DeleteBucketParams, S3Context>;

const s3DeleteBucket: DeleteBucketTask = async (
  {
    trail
  }: DeleteBucketParams,
  {
    resolve
  }: S3Context
): Promise<void> => {
  const [Bucket, ...args] = trail;
  const s3Client = await resolve('s3Client', ...args);
  const input: DeleteBucketCommandInput = {
    Bucket
  };

  await s3Client.send(
    new DeleteBucketCommand(input)
  );
};

export default s3DeleteBucket;
