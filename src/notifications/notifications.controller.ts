import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGaurd } from 'src/gaurds/gaurds.guard';
@UseGuards(AuthGaurd)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly AuthService: AuthService,
    private readonly firebaseService: FirebaseService
  ) { }
  @Post()
  async send(@Body() body: { title: string; message: string, userId: string },) {

    const user = await this.AuthService.getUserById(body.userId)

    if (!user?.fcmToken) {
      throw new Error('User does not have a registered FCM token');
    }
    return this.firebaseService.sendPushNotification(
      user?.fcmToken,
      body.title,
      body.message,
    );
  }
}
