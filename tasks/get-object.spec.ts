import s3GetObject from './get-object';
import s3GetObjectLength from './get-object-length';
import { context, params } from './get-object-length.spec';

describe('AWS S3 get', () => {
  it('should get object', async () => {
    const length = await s3GetObjectLength(params, context);

    const chunks = [];
    for await (const chunk of s3GetObject(params, context)) {
      chunks.push(chunk);
    }
    const chunkTotalLength = chunks.map(chunk => chunk.length).reduce((acc, length) => acc + length, 0);
    expect(chunkTotalLength).toBe(length);
  });
});