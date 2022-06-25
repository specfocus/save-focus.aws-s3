import s3DeleteBucket from './delete-bucket';
import s3GetObject from './get-object';
import { type ObjectParams } from './get-object-length';
import s3GetObjectLength from './get-object-length';
import { context } from './get-object-length.spec';
import s3Put from './put';

const params: ObjectParams = {
  match: 'hello-word.txt',
  trail: ['kyndrylo']
}

describe('AWS S3 put', () => {
  it('should store file and then fetch the same', async () => {
    let length = await s3GetObjectLength(params, context);

    if (length) {
      await s3DeleteBucket(params, context);
    }

    const crc32 = s3Put({ ...params, content: fakeAsync('') }, context);

    length = await s3GetObjectLength(params, context);

    const chunks = [];
    for await (const chunk of s3GetObject(params, context)) {
      chunks.push(chunk);
    }
    const chunkTotalLength = chunks.map(chunk => chunk.length).reduce((acc, length) => acc + length, 0);
    expect(chunkTotalLength).toBe(length);
  });
});

async function* fakeAsync(test: string): AsyncGenerator<Uint8Array, void, any> {
  let index = 0;
  for (index = 0; index < test.length; index++) {
    const len = 5 + Math.random() * 10;
    const part = test.substring(index, index + len + 1);
    index += len;
    yield Buffer.from(part);
  }
}