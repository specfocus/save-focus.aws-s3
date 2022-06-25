import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { type StorageLocation } from '@specfocus/save-focus/resources/location';
import { type Task } from '@specfocus/spec-focus/tasks/types';
import { type S3Context } from '../../save-focus.ibm-s3/tasks/context';

export interface ListObjectsParams extends Pick<StorageLocation, 'trail'> {
}

export type ListObjectsTask = Task<string[], ListObjectsParams, S3Context>;

const s3ListObjects: ListObjectsTask = async (
  {
    trail
  }: ListObjectsParams,
  {
    resolve
  }: S3Context
): Promise<string[]> => {
  const [Bucket, ...args] = trail;
  const s3Client = await resolve('s3Client', ...args);
  const output = await s3Client.send(
    new ListObjectsCommand({
      Bucket
    })
  );

  return output.Contents!.map(o => o.Key!);
};

export default s3ListObjects;
