import * as dotenv from 'dotenv';

export class ConfigService {
    private readonly envConfig: Record<string, string>;
    constructor() {
        const result = dotenv.config();

        if (result.error) {
            this.envConfig = process.env;
        } else {
            this.envConfig = result.parsed;
        }
    }

    public get(key: string): string {
        return this.envConfig[key];
    }

    public async getPortConfig() {
        return this.get('PORT');
    }

    public getEncryptKey() {
        return 'secret';
    }

    public getJWTKey() {
        return 'secret';
    }

    public async getMongoConfig() {
        return {
            // uri: 'mongodb+srv://' + this.get('MONGO_USER') + ':' + this.get('MONGO_PASSWORD') + '@' + this.get('MONGO_HOST') + '/' + this.get('MONGO_DATABASE'),
            uri: 'mongodb://freeman:abcd1234@localhost:27014/ws?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
            // mongosh "mongodb+srv://cluster0.lx2wdhp.mongodb.net/myFirstDatabase" --apiVersion 1 --username admin
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
    }
    public imagePath() {
        return {
            ImageYellowPath:'https://groundhog.whsse.net/groundhog/share/yellow.jpg',
            ImageBlackPath: 'https://groundhog.whsse.net/groundhog/share/black.jpg',
            
            // resultAssessmentImagePath: 'https://api-siamit-cleanup.flowmisite.com/ResultImageAssessment',
            // resultAssessmentImagePath: 'http://localhost:3000/ResultImageAssessment',
        };
    }

    public userIdPath() {
        return {
            userId: 'userId=',
        };
    }
}
