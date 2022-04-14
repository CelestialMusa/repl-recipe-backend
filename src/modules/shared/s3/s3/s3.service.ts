import { Injectable } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from '../../config/config.service';



@Injectable()
export class S3Service {
    s3Client: S3Client;
    params: any;

    /**
     *
     */
    constructor(
        private _configService: ConfigService
    ) {
        //? INFO: S3 Client uses IAM role for authorization, ACCESS Key Secret not used anywhere. 
        this.s3Client = new S3Client({region: _configService.get('AWS_REGION')});
        this.params = {
            Bucket: _configService.get('AWS_S3_BUCKET_NAME'),
        }
    }

    async uploadToS3(original_name, buffer: any){
        this.params['Key'] = original_name;
        this.params['Body'] = buffer;

        return await this.s3Client.send(new PutObjectCommand(this.params));
    }

    //? INFO : Convert incomingMessage response to readable buffer. Reference = https://transang.me/modern-fetch-and-how-to-get-buffer-output-from-aws-sdk-v3-getobjectcommand/
    async retrieveFromS3(original_name: string){
        this.params['Key'] = original_name;

        const stream = (await this.s3Client.send(new GetObjectCommand(this.params))).Body as Readable;

        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.once('end', () => resolve(Buffer.concat(chunks)));
            stream.once('error', reject);
        })
    }

    async get_s3_pre_signed_url(original_name: string){
        this.params['Key'] = original_name;

        return await getSignedUrl(this.s3Client, new GetObjectCommand(this.params), {expiresIn: 604800});
    }
}
