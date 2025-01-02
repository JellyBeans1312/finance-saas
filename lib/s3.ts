import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: process.env.AWS_REGION! }),
    identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
  }),
});

export async function uploadLogoToS3(
  base64File: string,
  fileName: string
): Promise<string> {
  const base64Data = base64File.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `logos/${fileName}`,
    Body: buffer,
    ContentType: base64File.split(';')[0].split(':')[1],
  });

  await s3Client.send(command);
  
  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `logos/${fileName}`,
  });
  
  return await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
}

export async function deleteLogoFromS3(imageUrl: string): Promise<void> {
  try {
    // Extract the key from the URL
    // Example URL: https://bucket-name.s3.region.amazonaws.com/logos/filename
    const urlParts = new URL(imageUrl);
    const key = urlParts.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
}