import { S3Client } from '@aws-sdk/client-s3';
import freeze from '@specfocus/spec-focus/tasks/freeze';
import type { TaskContext } from '@specfocus/spec-focus/tasks/types';

// Endpoint domain
const ENDPOINT = 'https?:\/\/?[-a-zA-Z0-9@:%._\+~#=]{1,256}';

export interface S3Resources {
  s3Client: S3Client;
}

export type S3Context = TaskContext<
  S3Resources,
  {},
  {}
>;

const DEFAULT_DEPENDENCIES = {
};

export const context = freeze(
  {
    flags: [],
    rules: {
    },
    vars: {},
  },
  {
    s3Client: (
      endpoint?: string,
      accessKeyId?: string,
      secretAccessKey?: string,
    ): S3Client => {
      if (endpoint && !endpoint.match(ENDPOINT)) {
        endpoint = 'https://' + endpoint;
      }
      return new S3Client(
        {
          // region: 'us-west-1',
          endpoint: endpoint || 'https://s3.us-west-1.amazonaws.com',
          /*
          1. Sign in to the AWS Management Console and open the IAM console at https://console.aws.amazon.com/iam/.
          2. In the navigation pane, choose Users.
          3. Choose the name of the user whose access keys you want to manage, and then choose the Security credentials tab.
          4. In the Access keys section, do any of the following:
          5. To create an access key, choose Create access key. Then choose Download .csv file to save the access key ID and secret access key to a CSV file on your computer. Store the file in a secure location. You will not have access to the secret access key again after this dialog box closes. After you download the CSV file, choose Close. When you create an access key, the key pair is active by default, and you can use the pair right away.
          */
          credentials: {
            accessKeyId: accessKeyId || process.env.AWS_KEY_ID!,
            secretAccessKey: secretAccessKey || process.env.AWS_KEY_ID!
          }
        }
      );
    }
  },
  <K extends keyof typeof DEFAULT_DEPENDENCIES>(name: K) => DEFAULT_DEPENDENCIES[name]
);