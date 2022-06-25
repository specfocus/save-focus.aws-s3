import { ListBucketsCommand } from '@aws-sdk/client-s3';
import type { StorageLocation } from '@specfocus/save-focus/resources/location';
import type { Task } from '@specfocus/spec-focus/tasks/types';
import type { S3Context } from '../../save-focus.ibm-s3/tasks/context';

export interface ListBucketsParams extends Pick<StorageLocation, 'trail'>{
}

export type ListBucketsTask = Task<string[], ListBucketsParams, S3Context>;

const s3List: ListBucketsTask = async (
  {
    trail
  }: ListBucketsParams,
  {
    resolve
  }: S3Context
): Promise<string[]> => {
  const s3Client = await resolve('s3Client', ...trail);
  const output = await s3Client.send(
    new ListBucketsCommand({
    })
  );
  
  return output.Buckets!.map(o => o.Name!);
};

export default s3List;
