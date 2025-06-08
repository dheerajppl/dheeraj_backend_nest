import { Injectable, OnModuleInit } from '@nestjs/common';
import * as path from 'path'; 
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  firebaseApp: admin.app.App;
  private firebaseSdkPath: string;

  constructor(private config: ConfigService) {
    this.firebaseSdkPath = this.config.get<string>('FIREBASE_SDK_PATH');
  if (!this.firebaseSdkPath) {
    throw new Error('FIREBASE_SDK_PATH is not set in the environment');
  }
  }

  async onModuleInit() {
    const pathToSdk = path.join(process.cwd(), this.firebaseSdkPath); 
    const serviceAccount = await import(pathToSdk);

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as object),
    });
  }

  async sendPushNotification(token: string, title: string, body: string) {
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent notification:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}
