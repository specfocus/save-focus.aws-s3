import { DeleteObjectCommand, type DeleteObjectCommandInput } from '@aws-sdk/client-s3';
import { type Task } from '@specfocus/spec-focus/tasks/types';
import { type S3Context } from '../../save-focus.ibm-s3/tasks/context';
import { type ObjectParams } from './get-object-length';

export interface DeleteObjectParams extends ObjectParams {
}

export type DeleteTask = Task<void, DeleteObjectParams, S3Context>;

const s3Delete: DeleteTask = async (
  {
    match: Key,
    trail
  }: DeleteObjectParams,
  {
    resolve
  }: S3Context
): Promise<void> => {
  const [Bucket, ...args] = trail;
  const s3Client = await resolve('s3Client', ...args);
  const input: DeleteObjectCommandInput = {
    Bucket,
    Key
  };

  await s3Client.send(
    new DeleteObjectCommand(input)
  );
};

export default s3Delete;
